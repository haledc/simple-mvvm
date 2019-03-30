import Dep from './Dep'

/**
 * Watcher 观察者
 */
export default class Watcher {
  /**
   * 构造方法
   * @param {SimpleVM} vm
   * @param {String} key
   * @param {Function} cb
   */
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    this.value = this.get() // 获取初始值，同时把自己添加到订阅器
  }

  /**
   * 获取并返回值订阅的 data 初始值
   * @returns {*}
   */
  get() {
    Dep.target = this // 缓存自己
    const value = this.vm.data[this.key] // 获取值，此时触发了监听器的 getter，把自己添加到订阅器里
    Dep.target = null // 释放自己
    return value
  }

  /**
   * 更新订阅的 data 值，并更新 view 的值
   */
  update() {
    const newVal = this.vm.data[this.key] // 新值
    const oldVal = this.value // 旧值
    if (newVal !== oldVal) {
      this.value = newVal
      this.cb.call(this.vm, this.value) // 调用回调函数，把最新的值更新到 view 中
    }
  }
}
