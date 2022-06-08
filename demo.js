import { execaSync } from 'execa'
import { isGitRepo } from './lib/util.js'
// async function main() {
//   const res = await execa('git', ['rev-parse', '--git-dir'])
//   console.log(res)
// }

// main()

// const isGitRepo = async () => {
//   console.log('111')
//   const { stdout } = await execa('git', ['rev-parse', '--git-dir'])
//   console.log('222')
//   if (stdout)
//     return Promise.resolve(true)
//   else
//     return Promise.resolve(false)
// }
// isGitRepo()

class A {
  constructor() {
    this.a()
  }

  async a() {
    // const b = await isGitRepo()
    // await execa('cd', ['/Users/mac/Desktop'], { stdio: 'inherit' })
    const { stdout: branchList } = execaSync('git', ['branch', '-r'])
    const result = branchList
      .split('\n')
      .filter(name => !name.includes('origin/HEAD'))
        .map((branchName) => {
          branchName = branchName.replace(/.+\//g, '').trim()
          // if (ignoreTargetName && Array.isArray(ignoreTargetName)) {
          //   if (!ignoreTargetName.includes(branchName))
          //     return branchName
          //   else
          //     return ''
          // } else {
          //   return branchName
          // }
          return branchName
        })
        .filter(name => name && name.trim())
    console.log(result)
  }
}
const aa = new A()

// aa.a()
