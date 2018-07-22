var keyStringMap = ["C", "#C", "D", "#D", "E", "F", "#F", "G", "#G", "A", "#A", "B"]

var keySelecter = new Vue({
  el: '#key-selecter',
  data: {
    key: 0
  },
  computed: {
    keyName: function() {
      var key = this.key
      while (key < 0) {
        key += 12
      }
      while (key > 11) {
        key -= 12
      }
      return keyStringMap[key]
    }
  },
  methods: {
    up: function() {
      this.key++;
    },
    down: function() {
      this.key--;
    }
  }
})
