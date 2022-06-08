class Project {
  constructor(cfg, prompt, dependenciesData) {
    this.cfg = cfg
    this.prompt = prompt
    this.dependenciesData = dependenciesData// 依赖的信息
    this.init()
  }

  init () {
    const { projectName } = this.cfg
    if (!projectName) {
      throw new Error('projectName 为空')
    }

  }

  build (answer) { }
}

export default Project
