import SimpleVM from './src/index'

const vm = new SimpleVM({
  el: '#app',

  data: {
    title: 'hello world',
    content: 'hello Hale'
  },

  mounted() {
    setTimeout(() => {
      this.title = 'hello MVVM'
    }, 3000)
  },

  methods: {
    alert() {
      alert(this.title)
    }
  }
})

window.vm = vm
