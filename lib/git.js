import path from 'node:path'
import shell from 'shelljs'
import chalk from 'chalk'
import { execaSync } from 'execa'
import { dirExists, hasYarn, parseGitUrl } from './util.js'
import { log } from './logger.js'

class Git {
  constructor({ dependencies, workspacePath }) {
    const { remoteUrl, packageManager, installCommand } = dependencies
    this.remoteUrl = remoteUrl
    this.projectName = parseGitUrl(remoteUrl).project
    this.workspacePath = workspacePath
    this.installCommand = installCommand
    this.packageManager = packageManager
  }

  // 进入仓库
  goIntoRepository() {
    if (!this.workspacePath)
      throw new Error('未找到工作区')

    let type = ''

    if (dirExists(this.workspacePath, this.projectName)) {
      shell.cd(path.resolve(this.workspacePath, this.projectName))
      type = 'exist'
    } else {
      shell.cd(this.workspacePath)
      execaSync('git', ['clone', this.remoteUrl], { stdio: 'inherit' })
      shell.cd(path.resolve(this.workspacePath, this.projectName))
      type = 'new'
    }
    log(`${chalk.green(`当前工作目录：${process.cwd()}`)}`)

    return type
  }

  // 获取每个项目的分支
  getBranchList(ignoreTargetName) {
    try {
      this.goIntoRepository()

      const { stdout: branchList } = execaSync('git', ['branch', '-r'])

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
      const type = this.goIntoRepository()

      execaSync('git', ['checkout', branch])
      execaSync('git', ['pull'], { stdio: 'inherit' })

      if (type === 'new')
        this.installDependencies()
    } catch (err) {
      throw new Error(`updateTargetBranch Error: ${err}`)
    }
  }
}

export default Git
