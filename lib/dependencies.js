import chalk from 'chalk'
import Git from './git.js'

class Dependencies {
  constructor(cfg, promptInstance) {
    this.cfg = cfg
    this.promptInstance = promptInstance
    this.init()
  }

  init() {
    const { dependencies } = this.cfg

    if (!dependencies || !dependencies.length)
      return false

    this.createPrompt(dependencies)
  }

  createPrompt(dependencies) {
    const dependenciesProjectName = []
    for (const item of dependencies) {
      const repoGit = new Git({ dependencies: item, workspacePath: this.cfg.targetWorkspacePath })
      const branchList = repoGit.getBranchList()
      const projectName = repoGit.projectName

      if (!dependenciesProjectName.includes(projectName)) {
        dependenciesProjectName.push(projectName)
        this.cfg.dependenciesData.push({
          ...item,
          branchList,
          projectName,
          gitInstance: repoGit
        })
      }
    }

    this.promptInstance.register({
      type: 'checkbox',
      name: 'targetDependenciesProject',
      message: '请选择要参与构建的依赖项目',
      choices: dependenciesProjectName,
      default: dependenciesProjectName
    })
    for (const project of dependenciesProjectName) {
      const target = this.cfg.dependenciesData.find(item => item.projectName === project)
      this.promptInstance.register({
        type: 'list',
        name: project,
        message: () => {
          if (target)
            return `请选择 ${chalk.green(project)} 要参与构建的分支, 默认选择的分支为 ${chalk.green(target.defaultBranch)}`
          else
            return ''
        },
        choices: () => {
          if (target)
            return target.branchList
          else
            return []
        },
        default: () => {
          if (target)
            return target.defaultBranch
          else
            return ''
        },
        when: ({ targetDependenciesProject }) => {
          return targetDependenciesProject.includes(project)
        }
      })
    }
  }
}

export default Dependencies
