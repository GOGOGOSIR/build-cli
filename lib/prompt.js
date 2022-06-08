import inquirer from 'inquirer'

class Prompt {
  constructor(container = {}) {
    this.createPrompt = inquirer.prompt
    this.containerPrompts = container.prompt
  }

  register(prompt) {
    this.containerPrompts.push(prompt)
  }

  async start() {
    if (!this.containerPrompts.length)
      throw new Error('containerPrompts is empty')

    const answer = await this.createPrompt(this.containerPrompts)

    return answer
  }
}

export default Prompt
