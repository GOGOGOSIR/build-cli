import { cosmiconfigSync, defaultLoaders } from 'cosmiconfig'
import _ from 'lodash'
import defaultConfig from '../config/build-cli.js'
import { error } from './logger.js'

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

const getConfig = (cfg = {}) => {
  try {
    const localConfig = getLocalConfig({ file: cfg.config })
    return _.defaultsDeep({}, cfg, localConfig, defaultConfig)
  } catch (err) {
    error(err)
  }
}

export default getConfig
