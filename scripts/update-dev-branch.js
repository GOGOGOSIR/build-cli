import { execaSync } from 'execa'

const { stdout } = execaSync('git', ['branch', '-a'])
const hasDevBranch = stdout.split('\n').some(b => b.includes('dev'))
if (hasDevBranch) {
  execaSync('git', ['checkout', 'dev'], { stdio: 'inherit' })
  execaSync('git', ['rebase', 'master'], { stdio: 'inherit' })
} else {
  execaSync('git', ['checkout', '-b', 'dev'], { stdio: 'inherit' })
}
execaSync('git', ['push', 'origin', 'dev'], { stdio: 'inherit' })
execaSync('git', ['checkout', 'master'], { stdio: 'inherit' })
