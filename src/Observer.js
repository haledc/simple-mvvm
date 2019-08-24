import Dep from './Dep'

class Observer {
  constructor(data) {
    this.data = data
    this.walk()
  }

  walk() {
    Object.keys(this.data).forEach(key =>
      this.defineReactive(this.data, key, this.data[key])
    )
  }

  defineReactive(data, key, val) {
    const dep = new Dep()

    // 递归遍历子属性
    if (typeof val === 'object') observe(val)

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (newVal === val) return
        val = newVal
        dep.notify()
      }
    })
  }
}

function observe(value) {
  if (!value || typeof value !== 'object') return
  return new Observer(value)
}

export default observe
