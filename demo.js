import { execaSync } from 'execa'

// const test = 'npm run test'
// const [packageManager, ...args] = test.split(' ')
// execaSync(packageManager, [...args], { stdio: 'inherit' })

// const { stdout } = execaSync('git', ['status', '-s'], { stdio: 'pipe' })
// console.log(stdout)
const { stdout } = execaSync('pnpm', ['--version'], { stdio: 'pipe' })
console.log(stdout)
