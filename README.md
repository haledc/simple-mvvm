# 实现Vue的双向绑定

![](http://src.haledeng.com/simple-vue.png)

- `Dep` 订阅器。订阅者的集合，管理订阅者。
  - `subs`: []
  - `addSub(sub)`:增加订阅者；把订阅者添加到`subs`中。
  - `notify()`: 通知订阅者；调用订阅者的更新`update`方法。
- `Watcher`订阅者。订阅 data 的其中一个属性。绑定 cd 更新 view。
  - `vm/exp/cb`： 绑定 vm、key 值和回调函数。
  - `value`：通过 `this.get()`获得初始值。
  - `get()`： 获取值并返回值（先缓存自己`Dep.target = this`，再获取值。此时，会触发监听器`getter`里面的方法，把订阅者添加到订阅器中）。
  - `update()`：更新 Watcher 里面的值，调用回调函数去更新 view。
- `Observer` 监听器。监听 data 所有的属性。
  - data: 监听的数据
  - `walk()`: 监听数据；遍历所有数据并监听
  - `defineReactive(data, key, val)`: 具体监听方法 `Object.defineProperty/proxy`
    - `getter`：获取值，并且把订阅者添加到订阅器中。
    - `setter`：更新值，此时调用订阅者的通知`notify`方法。（然后订阅器又调用订阅者的`update`方法，这个方法会更新 data）
- `Compile` 编译器。编译模板指令。

  - el：挂载的元素
  - vm：vm
  - `init()` 初始化
  - `nodeToFragment(el)`: 创建元素片段(子元素)
  - `compileElement(el)`: 编译模板
    - `compileElementNode(node)`: 编译元素节点，先遍历节点的属性，编译指令，完成后删除。
      - `compileEvent(node, exp, dir)`: 编译事件；获取指令中声明的的事件名和回调函数名（和 vm 中对应的方法名字一样），将 vm 的方法和事件通过原生的事件监听器绑定在一起。
      - `compileModel(node, exp)`: 编译双向绑定数据；获取 data 中对应的值，直接把他更新到 view 中，初始化完成。然后通过订阅者`Watcher`把 data 的数据和 view 绑定（单向绑定），当 data 的值发生变化时，view 数值也更新（通过 cb 函数更新）。再监听`input`事件，获取到其中最新的值，更新 data 的数据中的值（单向绑定）。从而变成双向绑定。
    - `compileText(node,exp)`: 编译文本节点。先初始化插值，把 vm 的 data 数据更新到插值里面，即替换掉`{{}}`。然后通过订阅者`Watcher`把 data 的数据和 view 绑定（单向绑定）。当 data 的值发生变化时，view 数值也更新。

- `index`：mvvm 输出
  - 使用数据劫持`Object.defineProperty`，使得`this` 代理`this.data` 的数据。
  - 监听`this.data`的数据。`observe(this.data)`
  - 编译模板`new Compile(options.el, this)`
  - 初始化之后，执行 mounted 里面的方法。