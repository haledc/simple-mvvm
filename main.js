import SimpleVM from './src/index'

const vm = new SimpleVM({
  // 挂载元素
  el: '#app',

  // 数据
  data: {
    title: 'hello world 🚗',
    name: 'hale 🧑'
  },

  // 方法
  methods: {
    clickMe() {
      alert(this.name)
    }
  },

  // 挂载时的方法
  mounted() {
    setTimeout(() => {
      this.title = 'hello MVVM 🚀'
    }, 3000)
  }
})

window.vm = vm // 赋值给全局变量，方便调试
