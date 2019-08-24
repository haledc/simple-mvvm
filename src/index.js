import observe from './Observer'
import Compile from './Compile'

export default class SimpleVM {
  constructor(options) {
    this.data = options.data
    this.methods = options.methods

    // 使用 this 代理 this.data
    Object.keys(this.data).forEach(key => this.proxyKeys(key)) 
    observe(this.data)
    new Compile(options.el, this)
    options.mounted && options.mounted.call(this)
  }

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
