import fs from 'node:fs'
import { execaSync } from 'execa'
import gitUrlParse from 'git-url-parse'

export const getPackageData = () => JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

export const isGitRepo = () => {
  const { stdout } = execaSync('git', ['rev-parse', '--git-dir'])
  if (stdout)
    return true
  else
    return false
}

export const parseGitUrl = (remoteUrl) => {
  if (!remoteUrl) return { host: null, owner: null, project: null, protocol: null, remote: null, repository: null }
  const normalizedUrl = (remoteUrl || '').replace(/\\/g, '/')
  const parsedUrl = gitUrlParse(normalizedUrl)
  const { resource: host, name: project, protocol, href: remote, owner } = parsedUrl
  const repository = `${owner}/${project}`
  return { host, owner, project, protocol, remote, repository }
}

export const dirExists = (targetPath, dirName) => {
  const dirs = fs
    .readdirSync(targetPath, {
      withFileTypes: true
    })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)

  return dirs.includes(dirName)
}

export const hasYarn = () => {
  try {
    execaSync('pnpm', ['--version'], { stdio: 'pipe' })
    return true
  } catch (ignoreError) {
    return false
  }
}
