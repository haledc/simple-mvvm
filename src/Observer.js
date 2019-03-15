import Dep from './Dep'

/**
 * Observer 监听器
 */
class Observer {
  /**
   * 构造方法
   * @param {Object} data
   */
  constructor(data) {
    this.data = data
    this.walk() // 执行监听
  }

  /**
   * 监听 data，遍历 data 里面的所有值并监听
   */
  walk() {
    Object.keys(this.data).forEach(key =>
      this.defineReactive(this.data, key, this.data[key])
    )
  }

  /**
   * 具体监听方法 'Object.defineProperty'
   * @param {Object} data
   * @param {String} key
   * @param {*} val
   */
  defineReactive(data, key, val) {
    // 创建一个订阅器
    const dep = new Dep()

    // 递归遍历子属性
    observe(val)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target) // 添加到订阅器
        }
        return val
      },
      set(newVal) {
        if (newVal === val) return
        val = newVal
        dep.notify() // 调用 notify 通知
      }
    })
  }
}

/**
 * 监听方法
 * 工厂函数
 * @param {Object} value
 * @returns {Observer}
 */
function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observer(value)
}

export default observe
