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

    const container = {
      prompt: []
    }
    const cfg = getConfig(opts)
    const prompt = new Prompt(container)
    const dependencies = new Dependencies(cfg, prompt)
    const project = new Project(cfg, prompt, dependencies.dependenciesData)
    const answer = await prompt.start()

    project.build(answer)
    console.log(`answer: ${JSON.stringify(answer)}`)
    return Promise.resolve()
  } catch (err) {
    error(err)
  }
}

export default runTasks
