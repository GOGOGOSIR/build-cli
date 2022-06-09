import inquirer from 'inquirer'

class Prompt {
  constructor(cfg = {}) {
    this.createPrompt = inquirer.prompt
    this.cfgPrompts = cfg.prompt
  }

  register(prompt) {
    this.cfgPrompts.push(prompt)
  }

  async start() {
    if (!this.cfgPrompts.length)
      throw new Error('cfgPrompts is empty')

    const answer = await this.createPrompt(this.cfgPrompts)

    return answer
  }
}

export default Prompt
