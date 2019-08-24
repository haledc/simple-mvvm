import Watcher from './Watcher'

export default class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    this.fragment = null
    this.init()
  }

  init() {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      console.log('DOM 元素不存在')
    }
  }

  nodeToFragment(el) {
    const fragment = document.createDocumentFragment()

    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }

  compileElement(el) {
    const childNodes = el.childNodes

    Array.prototype.forEach.call(childNodes, node => {
      const reg = /\{\{(.*)\}\}/
      const text = node.textContent

      if (this.isElementNode(node)) {
        this.compileElementNode(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        const key = reg.exec(text)[1].trim()
        this.compileText(node, key)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }

  compileElementNode(node) {
    const nodeAttrs = node.attributes

    Array.prototype.forEach.call(nodeAttrs, attr => {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const key = attr.value
        const dir = attrName.substring(2)

        if (this.isEventDirective(dir)) {
          this.compileEvent(node, key, dir)
        } else {
          this.compileModel(node, key)
        }
        node.removeAttribute(attrName)
      }
    })
  }

  compileEvent(node, key, dir) {
    const eventType = dir.split(':')[1] 
    const cb = this.vm.methods && this.vm.methods[key] 

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(this.vm), false)
    }
  }

  compileModel(node, key) {
    let val = this.vm[key] 
    this.modelUpdater(node, val) 

    new Watcher(this.vm, key, newVal => this.modelUpdater(node, newVal))

    node.addEventListener('input', e => {
      const newValue = e.target.value
      if (val === newValue) return
      this.vm[key] = newValue
    })
  }

  compileText(node, key) {
    const initText = this.vm[key]
    this.updateText(node, initText)
    new Watcher(this.vm, key, newVal => this.updateText(node, newVal))
  }

  updateText(node, value) {
    node.textContent = typeof value !== 'undefined' ? value : ''
  }

  modelUpdater(node, val) {
    node.value = typeof val !== 'undefined' ? val : ''
  }

  isTextNode(node) {
    return node.nodeType === 3
  }

  isElementNode(node) {
    return node.nodeType === 1
  }

  isDirective(attr) {
    return attr.startsWith('v-')
  }

  isEventDirective(dir) {
    return dir.startsWith('on')
  }
}
