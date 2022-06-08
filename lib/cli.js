import { getPackageData } from './util.js'
import { log } from './logger.js'
import runTasks from './index.js'

const pkg = getPackageData()

const helpText = `Build-cli! v${pkg.version}

  Usage: build-cli [options]

  -c --config            定义本地配置的路径 [default: ".build-cli.json"]
  -h --help              打印帮助文档
  -v --version           打印当前版本
`

export default async (options) => {
  if (options.version)
    log(`v${pkg.version}`, 'green')
  else if (options.help)
    log(helpText, 'green')
  else
    await runTasks(options)

  return Promise.resolve()
}
