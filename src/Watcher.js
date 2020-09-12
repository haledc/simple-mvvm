import Dep from "./Dep";

export default class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.value = this.get(); // 获取初始值，同时把自己添加到订阅器
  }

  get() {
    Dep.target = this; // 缓存自己
    const value = this.vm.data[this.key]; // 获取值，此时触发了监听器的 getter，把自己添加到订阅器里
    Dep.target = null; // 释放自己
    return value;
  }

  update() {
    const newVal = this.vm.data[this.key];
    const oldVal = this.value;
    if (newVal !== oldVal) {
      this.value = newVal;
      this.cb.call(this.vm, this.value); // 调用回调函数，把最新的值更新到 view 中
    }
  }
}
