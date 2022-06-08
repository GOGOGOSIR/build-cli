import path from 'node:path'
import shell from 'shelljs'
import { execaSync } from 'execa'
import { dirExists, parseGitUrl } from './util.js'

class Git {
  constructor({ remoteUrl, workspacePath }) {
    this.remoteUrl = remoteUrl
    this.projectName = parseGitUrl(remoteUrl).project
    this.workspacePath = workspacePath
  }

  // 进入仓库
  goIntoRepository() {
    if (!this.workspacePath)
      throw new Error('未找到工作区')

    if (dirExists(this.workspacePath, this.projectName)) {
      shell.cd(path.resolve(this.workspacePath, this.projectName))
    } else {
      shell.cd(this.workspacePath)
      execaSync('git', ['clone', this.remoteUrl], { stdio: 'inherit' })
      shell.cd(path.resolve(this.workspacePath, this.projectName))
    }
  }

  getBranchList(ignoreTargetName) {
    try {
      this.goIntoRepository()

      const { stdout: branchList } = execaSync('git', ['branch', '-r'])

      return branchList
        .split('\n')
        .filter(name => !name.includes('origin/HEAD'))
        .map((branchName) => {
          branchName = branchName.replace(/.+\//g, '').trim()
          if (ignoreTargetName && Array.isArray(ignoreTargetName)) {
            if (!ignoreTargetName.includes(branchName))
              return branchName
            else
              return ''
          } else {
            return branchName
          }
        })
        .filter(name => name && name.trim())
    } catch (err) {
      throw new Error(`获取分支失败：${err}`)
    }
  }

  pull() {
    return execaSync('git', ['pull'], { stdio: 'inherit' }).catch((err) => {
      throw new Error(`git pull error: ${err}`)
    })
  }

  async updateTargetBranch(branch) {
    if (!branch)
      throw new Error(`缺少参数 ${branch}`)

    try {
      execaSync('git', ['checkout', branch])
      await this.pull()
    } catch (err) {
      throw new Error(`updateTargetBranch Error: ${err}`)
    }
  }
}

export default Git
