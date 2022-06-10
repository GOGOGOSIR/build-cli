import path from 'node:path'
import shell from 'shelljs'
import chalk from 'chalk'
import { execaSync } from 'execa'
import { dirExists, hasYarn, parseGitUrl } from './util.js'
import { error, log, success } from './logger.js'

class Git {
  constructor({ dependencies, workspacePath }) {
    const { remoteUrl, packageManager, installCommand } = dependencies
    this.remoteUrl = remoteUrl
    this.projectName = parseGitUrl(remoteUrl).project
    this.workspacePath = workspacePath
    this.installCommand = installCommand
    this.packageManager = packageManager
    this.isStash = false
    this.beforeBranch = ''
    this.isExist = dirExists(this.workspacePath, this.projectName)
  }

  // 进入仓库
  goIntoRepository(showLog = true) {
    if (!this.workspacePath)
      throw new Error('未找到工作区')

    if (dirExists(this.workspacePath, this.projectName)) {
      shell.cd(path.resolve(this.workspacePath, this.projectName))
    } else {
      shell.cd(this.workspacePath)
      execaSync('git', ['clone', this.remoteUrl], { stdio: 'inherit' })
      shell.cd(path.resolve(this.workspacePath, this.projectName))
    }

    if (showLog)
      log(`${chalk.green(`当前工作目录：${process.cwd()}`)}`)
  }

  // 获取每个项目的分支
  getBranchList(ignoreTargetName) {
    try {
      this.goIntoRepository(false)

      const { stdout: branchList } = execaSync('git', ['branch', '-r', '--sort=-committerdate'])

      return branchList
        .split('\n')
        .filter(name => !name.includes('origin/HEAD'))
        .map(branchName => branchName.replace(/.+\//g, '').trim())
        .filter((name) => {
          if (ignoreTargetName && Array.isArray(ignoreTargetName))
            return !ignoreTargetName.includes(name)
          else
            return name
        })
    } catch (err) {
      throw new Error(`获取分支失败：${err}`)
    }
  }

  installDependencies() {
    const packageManager = this.packageManager || (hasYarn() ? 'yarn' : 'npm')

    log(chalk.yellow('🚚 正在安装依赖'))

    execaSync(packageManager, ['install'], { stdio: 'inherit' })

    if (this.installCommand && Array.isArray(this.installCommand) && this.installCommand.length) {
      for (const command of this.installCommand) {
        const [pkgManager, ...args] = command.split(' ')
        execaSync(pkgManager, [...args], { stdio: 'inherit' })
      }
    }
  }

  // 更新目标分支并安装依赖
  updateTargetBranch(branch) {
    if (!branch)
      throw new Error(`缺少参数 ${branch}`)

    try {
      this.goIntoRepository()

      const { stdout: notClear } = execaSync('git', ['status', '-s'], { stdio: 'pipe' })
      const { stdout: beforeBranch } = execaSync('git', ['branch', '--show-current'], { stdio: 'pipe' })
      this.beforeBranch = beforeBranch

      if (notClear) {
        this.isStash = true
        log(`${chalk.green(`${this.projectName} 的 ${this.beforeBranch} 分支工作区未清空，正在进行 stash 操作`)}`)
        execaSync('git', ['stash', '-u'], { stdio: 'inherit' })
      }

      if (beforeBranch !== branch)
        execaSync('git', ['checkout', branch])

      execaSync('git', ['pull'], { stdio: 'inherit' })

      if (!this.isExist)
        this.installDependencies()
    } catch (err) {
      throw new Error(`updateTargetBranch ${err}`)
    }
  }

  stashPop() {
    try {
      if (this.isStash && this.beforeBranch) {
        this.goIntoRepository()
        log(`${chalk.green(`正在对 ${this.projectName} 的 ${this.beforeBranch} 分支进行 stash pop 操作`)}`)
        execaSync('git', ['checkout', this.beforeBranch])
        execaSync('git', ['stash', 'pop'], { stdio: 'inherit' })
        success(`${this.projectName} 的 ${this.beforeBranch} 分支 stash pop 成功`)
        this.stashPop = false
      }
      this.beforeBranch = ''
    } catch (err) {
      error(`${this.projectName} 的 ${this.beforeBranch} 分支 stash pop 异常：${err}`)
    }
  }
}

export default Git
