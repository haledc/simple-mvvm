import observe from './Observer'
import Compile from './Compile'

/**
 * SimpleVM
 */
export default class SimpleVM {
  /**
   * 构造方法
   * @param {Object} options
   */
  constructor(options) {
    this.data = options.data
    this.methods = options.methods

    // 使用 this 代理 this.data
    Object.keys(this.data).forEach(key => this.proxyKeys(key))

    // 监听数据
    observe(this.data)

    // 编译模板 关联元素和 vm
    new Compile(options.el, this)

    // 初始化之后，执行 mounted 里面的方法
    options.mounted && options.mounted.call(this)
  }

  /**
   * 代理数据方法
   * @param {String} key
   */
  proxyKeys(key) {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        return this.data[key]
      },
      set: newVal => {
        this.data[key] = newVal
      }
    })
  }
}
