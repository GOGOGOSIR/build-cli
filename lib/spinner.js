import ora from 'ora'
import { log } from './logger.js'

const noop = Promise.resolve()

class Spinner {
  constructor() {
    this.ora = ora
  }

  async show({ task, text, params, enabled = true }) {
    if (!enabled)
      return noop

    this.ora(text).start()
    log('\n')

    return await task(params)
  }
}

export default Spinner
