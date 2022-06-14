import path from 'node:path'
import { cosmiconfigSync, defaultLoaders } from 'cosmiconfig'
import { config as dotenvConfig } from 'dotenv'
import _ from 'lodash'
import defaultConfig from '../config/build-cli.js'
import { error, log } from './logger.js'

const searchPlaces = [
  'package.json',
  '.build-cli.json',
  '.build-cli.js',
  '.build-cli.cjs',
  '.build-cli.yaml',
  '.build-cli.yml'
]

const getLocalConfig = ({ file }) => {
  const localConfig = {}
  if (file === false)
    return localConfig

  const explorer = cosmiconfigSync('build-cli', {
    searchPlaces,
    defaultLoaders
  })

  const result = file ? explorer.load(file) : explorer.search(process.cwd())

  if (result && typeof result.config === 'string')
    throw new Error('配置文件不可用')

  return result && result.config ? result.config : localConfig
}

const getGlobalConfig = (localConfig, env) => {
  const { dependenciesWorkspace, dependencies } = localConfig

  dotenvConfig({ path: path.resolve(process.cwd(), `.env${env ? `.${env}` : ''}`) })

  const workspaceByEnv = process.env[dependenciesWorkspace]
  if (dependencies.length && !workspaceByEnv)
    throw new Error(`变量 ${dependenciesWorkspace} 缺失`)

  let targetWorkspacePath = ''
  if (dependencies.length && workspaceByEnv) {
    if (path.isAbsolute(workspaceByEnv))
      targetWorkspacePath = path.resolve(workspaceByEnv)
    else
      targetWorkspacePath = path.resolve(process.cwd(), workspaceByEnv)

    if (targetWorkspacePath)
      log(`工作区的地址为: ${targetWorkspacePath}`)
  }

  return {
    targetWorkspacePath,
    dependenciesData: [],
    prompt: [],
    cwd: process.cwd()
  }
}

const getConfig = (cfg = {}) => {
  try {
    const localConfig = getLocalConfig({ file: cfg.config })
    const config = _.defaultsDeep({}, cfg, localConfig, defaultConfig)
    const globalConfig = getGlobalConfig(config, cfg.env)

    return _.defaultsDeep({}, config, globalConfig)
  } catch (err) {
    error(err)
  }
}

export default getConfig
