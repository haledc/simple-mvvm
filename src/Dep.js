/**
 * Dep 依赖收集
 */
export default class Dep {
  /**
   * 构造方法
   */
  constructor() {
    this.subs = []
  }

  /**
   * 添加观察者
   * @param {Watcher} sub
   */
  addSub(sub) {
    this.subs.push(sub)
  }

  /**
   * 通知
   * 遍历所有观察者，调用它们的 update 方法
   */
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null // Dep 的 target 初始值为 null
