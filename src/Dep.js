export default class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

// Dep 的 target 初始值为 null
Dep.target = null 
