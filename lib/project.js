import { execaSync } from 'execa'
import shell from 'shelljs'
import chalk from 'chalk'
import Spinner from './spinner.js'
import { error, log, success } from './logger.js'

class Project {
  constructor(cfg, promptInstance, dependenciesInstance) {
    this.cfg = cfg
    this.promptInstance = promptInstance
    this.dependenciesInstance = dependenciesInstance// 依赖的信息
    this.dependenciesProject = null
    this.init()
  }

  init() {
    const { projectName, cwd, targetBranch = {} } = this.cfg
    if (!projectName)
      throw new Error('projectName 为空')

    this.targetBranchNameList = Object.keys(targetBranch)

    if (!this.targetBranchNameList.length)
      throw new Error('项目构建的目标分支不能为空')

    shell.cd(cwd)

    const { stdout: branchList } = execaSync('git', ['branch', '--list'])
    const { stdout: currentBranch } = execaSync('git', ['branch', '--show-current'])

    const effectBranchList = branchList
      .split('\n')
      .map(branchName => branchName.replace('*', '').trim())
      .filter((name) => {
        return name && !this.targetBranchNameList.includes(name)
      })

    this.allBranch = branchList
    this.currentBranch = currentBranch.trim()

    this.createPrompt(effectBranchList)
  }

  createPrompt(effectBranchList) {
    const list = [
      {
        choices: effectBranchList,
        default: this.currentBranch,
        message: '请选择当前项目要构建的分支:',
        name: 'source',
        type: 'list'
      },
      {
        choices: this.targetBranchNameList,
        name: 'target',
        message: '请选择目标分支:',
        type: 'list'
      }
    ]
    for (const p of list)
      this.promptInstance.register(p)
  }

  updateDependencies(dependenciesProject) {
    if (!Object.keys(dependenciesProject).length)
      return false

    // console.log(JSON.stringify(dependenciesProject))

    for (const [name, value] of Object.entries(dependenciesProject)) {
      log(`\n🦄 ${chalk.green(`更新 ${name} 相关分支`)}`, 'green')
      value.gitInstance.updateTargetBranch(value.branch)
    }
  }

  buildMain(answers) {
    const { source, target } = answers
    const { targetBranch = {}, projectName, distName, cwd } = this.cfg
    const command = targetBranch[target]

    if (!command)
      throw new Error('构建命令不存在')

    if (!distName)
      throw new Error('参数 distName 缺失')

    shell.cd(cwd)

    const { stdout: currentBranch } = execaSync('git', ['branch', '--show-current'])
    log(`\n🏁 ${chalk.green(`当前工作目录${process.cwd()}`)}\n${chalk.magenta(`当前所在分支: ${currentBranch}，所选择参与构建分支: ${source}`)}`)

    try {
      const [packageManager, ...args] = command.split(' ')
      const buildMsg = `build: ${new Date().toLocaleString()}`

      log(`\n🚚  ${chalk.yellow(`开始构建 ${projectName} 的 ${source} 分支`)}`)

      if (currentBranch !== source) {
        const { stdout: notClear } = execaSync('git', ['status', '-s'], { stdio: 'pipe' })
        if (notClear)
          throw new Error(`${projectName} 的 ${currentBranch} 分支git工作区未清空`)

        execaSync('git', ['checkout', source], { stdio: 'inherit' })
      }

      if (this.allBranch.includes(target))
        execaSync('git', ['branch', '-D', target], { stdio: 'inherit' })
      execaSync('git', ['checkout', '-b', target], { stdio: 'inherit' })
      execaSync(packageManager, [...args], { stdio: 'inherit' })
      execaSync('rm', ['-rf', `${projectName}.zip`], { stdio: 'inherit' })
      execaSync('zip', ['-r', `${projectName}.zip`, distName], { stdio: 'inherit' })
      execaSync('git', ['add', `${projectName}.zip`], { stdio: 'inherit' })
      execaSync('git', ['commit', '-m', buildMsg], { stdio: 'inherit' })
      execaSync('git', ['push', '--set-upstream', 'origin', target, '-f'], { stdio: 'inherit' })
      execaSync('git', ['checkout', currentBranch], { stdio: 'inherit' })
    } catch (err) {
      const { stdout: errorBranch } = execaSync('git', ['branch', '--show-current'])

      log(`\n🏁 ${chalk.red(`发生 error 所在的分支: ${errorBranch}，checkout 的目标分支: ${currentBranch}`)}\n`)

      // 切换回默认分支
      if (errorBranch !== currentBranch) {
        // 删除  `${projectName}.zip` 文件
        execaSync('rm', ['-rf', `${projectName}.zip`], { stdio: 'inherit' })
        const { stdout } = execaSync('git', ['status', '-s'], { stdio: 'pipe' })
        if (stdout) {
          execaSync('git', ['stash', '-u'], { stdio: 'inherit' })
          execaSync('git', ['checkout', currentBranch], { stdio: 'inherit' })
          execaSync('git', ['stash', 'pop'], { stdio: 'inherit' })
        } else {
          execaSync('git', ['checkout', currentBranch], { stdio: 'inherit' })
        }
      }

      throw new Error(err)
    }
  }

  async run({ answers, _this }) {
    const { targetDependenciesProject, ...others } = answers

    if (targetDependenciesProject && Array.isArray(targetDependenciesProject) && targetDependenciesProject.length) {
      const dependenciesProject = {}
      for (const projectName of targetDependenciesProject) {
        const target = _this.cfg.dependenciesData.find(item => item.projectName === projectName) || {}
        dependenciesProject[projectName] = {
          branch: others[projectName],
          ...target
        }
      }

      _this.dependenciesProject = dependenciesProject

      _this.updateDependencies(dependenciesProject)
    }

    _this.buildMain(answers)
  }

  resetDependenciesStash() {
    if (!this.dependenciesProject || !Object.keys(this.dependenciesProject).length)
      return false

    const list = Object.values(this.dependenciesProject)
    const flag = list.some(i => i.gitInstance.stashPop)
    if (flag) {
      for (const item of list)
        item.gitInstance.stashPop()
    }
  }

  async build(answers) {
    try {
      const spinner = new Spinner()
      await spinner.show({ task: this.run, params: { answers, _this: this }, text: chalk.yellow('🌈 正在构建') })
      success(`🚀 ${chalk.green('build success!')}`)
    } catch (err) {
      error(`🚨 ${err.message}`)
    } finally {
      this.resetDependenciesStash()
    }
  }
}

export default Project
