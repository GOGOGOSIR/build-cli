import { oraPromise } from 'ora'
import { format } from './util.js'

const noop = Promise.resolve()

class Spinner {
  constructor() {
    this.ora = oraPromise
  }

  show({ task, label, context, enabled = true }) {
    if (!enabled)
      return noop

    const awaitTask = task()

    const text = format(label, context)
    this.ora(awaitTask, text)

    return awaitTask
  }
}

export default Spinner
