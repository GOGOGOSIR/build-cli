import { error } from './logger.js'
import getConfig from './config.js'
import Prompt from './prompt.js'
import Dependencies from './dependencies.js'
import Project from './project.js'
import { isGitRepo } from './util.js'

async function runTasks(opts) {
  try {
    if (!isGitRepo())
      throw new Error('该仓库未初始化git')

    const cfg = getConfig(opts)
    const promptInstance = new Prompt(cfg)
    const dependenciesInstance = new Dependencies(cfg, promptInstance)
    const projectInstance = new Project(cfg, promptInstance, dependenciesInstance)
    const answer = await promptInstance.start()

    await projectInstance.build(answer)

    return Promise.resolve(true)
  } catch (err) {
    error(err)
  }
}

export default runTasks
