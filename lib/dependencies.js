import path from 'node:path'
import os from 'node:os'
import chalk from 'chalk'
import Git from './git.js'

class Dependencies {
  constructor(cfg, prompt) {
    this.cfg = cfg
    this.prompt = prompt
    this.dependenciesData = [] // 用于存放依赖的信息
    this.init()
  }

  init() {
    const { dependencies, dependenciesWorkspace } = this.cfg

    if (!dependencies || !dependencies.length)
      return false

    const workspaceByEnv = process.env[dependenciesWorkspace]
    if (!workspaceByEnv)
      throw new Error(`变量 ${dependenciesWorkspace} 缺失`)

    const homeDir = os.homedir()
    this.targetWorkspacePath = path.resolve(homeDir, workspaceByEnv)

    this.createPrompt(dependencies)
  }

  createPrompt(dependencies) {
    const dependenciesProjectName = []
    for (const item of dependencies) {
      const { remoteUrl, targetBranch } = item
      const repoGit = new Git({ remoteUrl, workspacePath: this.targetWorkspacePath })
      const branchList = repoGit.getBranchList()
      const projectName = repoGit.projectName

      if (!dependenciesProjectName.includes(projectName)) {
        dependenciesProjectName.push(projectName)
        this.dependenciesData.push({
          remoteUrl,
          targetBranch,
          branchList,
          projectName,
          gitInstance: repoGit
        })
      }
    }

    this.prompt.register({
      type: 'checkbox',
      name: 'targetDependenciesProject',
      message: '请选择要参与构建的依赖项目',
      choices: dependenciesProjectName,
      default: dependenciesProjectName
    })
    for (const project of dependenciesProjectName) {
      this.prompt.register({
        type: 'list',
        name: project,
        message: () => {
          const target = this.dependenciesData.find(item => item.projectName === project)
          if (target)
            return `请选择 ${chalk.green(project)} 要参与构建的分支, 默认选择的分支为 ${chalk.green(target.targetBranch)}`
          else
            return ''
        },
        choices: () => {
          const target = this.dependenciesData.find(item => item.projectName === project)
          if (target)
            return target.branchList
          else
            return []
        },
        default: () => {
          const target = this.dependenciesData.find(item => item.projectName === project)
          if (target)
            return target.targetBranch
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
