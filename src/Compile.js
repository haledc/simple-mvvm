import Watcher from './Watcher'

/**
 * Compile 编译器
 */
export default class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    this.fragment = null
    this.init()
  }

  /**
   * 初始化
   */
  init() {
    if (this.el) {
      // 创建片段
      this.fragment = this.nodeToFragment(this.el)

      // 编译片段
      this.compileElement(this.fragment)

      // 把编译好的片段挂载到元素上
      this.el.appendChild(this.fragment)
    } else {
      console.log('DOM 元素不存在')
    }
  }

  /**
   * 创建 fragment 片段，把需要解析的 dom 节点存入片段里
   * @param {Element} el
   */
  nodeToFragment(el) {
    const fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  /**
   * 编译 DOM
   * @param {String} el
   */
  compileElement(el) {
    const childNodes = el.childNodes
    ;[].slice.call(childNodes).forEach(node => {
      const reg = /\{\{(.*)\}\}/ // 匹配插值符号 {{  }}
      const text = node.textContent

      // 编译元素节点；比如 <p> <div>
      if (this.isElementNode(node)) {
        this.compileElementNode(node)

        // 编译文本节点的插值 {{ something }}
      } else if (this.isTextNode(node) && reg.test(text)) {
        const exp = reg.exec(text)[1].trim() // 获取插值的文本；trim() 去两边空格
        this.compileText(node, exp)
      }

      // 如果存在子节点，继续递归遍历子节点
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  /**
   * 编译元素节点
   * @param {Node} node
   */
  compileElementNode(node) {
    const nodeAttrs = node.attributes

    // 遍历节点的属性
    Array.prototype.forEach.call(nodeAttrs, attr => {
      const attrName = attr.name // '='左边的是属性名
      if (this.isDirective(attrName)) {
        const exp = attr.value // 获取指令要调用的方法名；'='右边的是属性值
        const dir = attrName.substring(2) // 提取指令；比如 v-on:click => on:click

        if (this.isEventDirective(dir)) {
          this.compileEvent(node, exp, dir) // 编译事件指令：v-on
        } else {
          this.compileModel(node, exp) // 编译双向绑定：v-model // 目前只有事件和双向绑定 2 种指令
        }
        node.removeAttribute(attrName) // 编译完成后删除
      }
    })
  }

  /**
   * 编译事件指令
   * @param {Node} node
   * @param {String} exp
   * @param {String} dir
   */
  compileEvent(node, exp, dir) {
    const eventType = dir.split(':')[1] // 获取事件类型 'on:click' => ['on', 'click']

    const cb = this.vm.methods && this.vm.methods[exp] // 在 vm 方法中获取事件对应的方法

    if (eventType && cb) {
      // DOM 事件 和 vm 的方法通过原生的事件监听器绑定在一起
      node.addEventListener(eventType, cb.bind(this.vm), false)
    }
  }

  /**
   * 编译双向绑定
   * @param {*} node
   * @param {*} exp
   */
  compileModel(node, exp) {
    let val = this.vm[exp] // 获取 date 中对应的值
    this.modelUpdater(node, val) // 更新输入框的值

    // 创建订阅者，如果 data 数据有变化，也更新输入框的值
    new Watcher(this.vm, exp, newVal => this.modelUpdater(node, newVal))

    // 监听输入，获取输入框的最新值，同时更新 data 里面的值
    node.addEventListener('input', e => {
      const newValue = e.target.value
      if (val === newValue) return
      this.vm[exp] = newValue
    })
  }

  /**
   * 编译文本节点
   * @param {*} node
   * @param {*} exp
   */
  compileText(node, exp) {
    const initText = this.vm[exp]

    // 更新文本
    this.updateText(node, initText)

    // 创建订阅者，如果 data 数据有变化，也更新文本
    new Watcher(this.vm, exp, newVal => this.updateText(node, newVal))
  }

  /**
   * 更新文本
   * 注意这里直接把插值符内外的文本都替换
   * @param {*} node
   * @param {*} value
   */
  updateText(node, value) {
    node.textContent = typeof value !== 'undefined' ? value : ''
  }

  /**
   * 更新 model 的值
   * @param {*} node
   * @param {*} value
   */
  modelUpdater(node, val) {
    node.value = typeof val !== 'undefined' ? val : ''
  }

  /**
   * 判断是否是文本节点
   * @param {*} node
   * @returns {Boolean}
   */
  isTextNode(node) {
    return node.nodeType === 3
  }

  /**
   * 判断是否是元素节点
   * @param {*} node
   * @returns {Boolean}
   */
  isElementNode(node) {
    return node.nodeType === 1
  }

  /**
   * 判断是否是指令
   * @param {String} attr
   * @returns {Boolean}
   */
  isDirective(attr) {
    return attr.startsWith('v-')
  }

  /**
   * 判断是否是事件指令
   * @param {String} dir
   * @returns {Boolean}
   */
  isEventDirective(dir) {
    return dir.startsWith('on')
  }
}
