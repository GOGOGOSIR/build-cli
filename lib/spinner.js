import ora from 'ora'

const noop = Promise.resolve()

class Spinner {
  constructor() {
    this.ora = ora
  }

  async show({ task, text, params, enabled = true }) {
    if (!enabled)
      return noop

    this.ora(text).start()

    return await task(params)
  }
}

export default Spinner
