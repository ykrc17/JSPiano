var keyLock = new Set()
var shiftDown = false
var pitchName = ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']
var keyMap = []

class PitchSpec {
  constructor(keyCode, value, volume = 1) {
    this.keyCode = keyCode
    this.value = value
    this.volume = volume
  }

  getValue() {
    return this.value + keySelecter.key
  }

  getGroup() {
    return parseInt(this.getValue() / 12)
  }

  getPitch(real) {
    return (real ? this.value : this.getValue()) % 12
  }

  getPitchName(shiftDown) {
    var pitch = this.getPitch(true)
    if (shiftDown) {
      pitch++
    }
    return pitchName[pitch]
  }

  getFileName(shiftDown) {
    var group = this.getGroup()
    var pitch = this.getPitch()
    if (shiftDown) {
      pitch++
      if (pitch >= 12) {
        group++
        pitch -= 12
      }
    }
    return group + (pitch < 10 ? "0" : "") + pitch + ".mp3"
  }

  play() {
    var player = playerMap[playerIndex]
    if (player == null) {
      player = new Player(playerIndex)
      playerMap[playerIndex] = player
    }
    player.play(this.keyCode, this)

    playerIndex++
    if (playerIndex >= playerCount) {
      playerIndex = 0
    }
    // 打印
    logger.currentLog += (this.getPitchName(shiftDown) + " ")
  }
}

class ChordSpec {
  constructor(keyCode, pitches) {
    this.pitchSpecs = []
    for (i in pitches) {
      var pitchFileName = pitches[i]
      this.pitchSpecs.push(new PitchSpec(keyCode, parseInt(pitchFileName / 100) * 12 + pitchFileName % 100, 0.8))
    }
  }

  play() {
    for (i in this.pitchSpecs) {
      this.pitchSpecs[i].play()
    }
  }
}

var bindKey = function(arr, group) {
  var pitch = group * 12
  for (i in arr) {
    var key = arr[i]
    keyMap[key] = new PitchSpec(key, pitch)
    pitch += 2
    if (i == 2 || i == 6) {
      pitch--
    }
  }
}

var bindChord = function(key, pitches) {
  keyMap[key] = new ChordSpec(key, pitches)
}

// 0 1 2 3 4 5 6 7 8 9 10 11
// C   D   E F   G   A    B
// bindKey([97, 98, 99, 100, 101, 102, 103, 104], 0)
bindKey([90, 88, 67, 86, 66, 78, 77, 188], 1)
bindKey([65, 83, 68, 70, 71, 72, 74, 75], 2)
bindKey([81, 87, 69, 82, 84, 89, 85, 73], 3)
bindKey([49, 50, 51, 52, 53, 54, 55, 56], 4)

bindChord(96, [11, 102, 105])
bindChord(97, [100, 104, 107])
bindChord(98, [102, 105, 109])
bindChord(99, [104, 107, 11])
bindChord(100, [105, 109, 100])
bindChord(101, [107, 11, 102])
bindChord(102, [109, 100, 104])
// bindChord(103, [011, 102, 105])

class Player {
  constructor(index) {
    this.keyCode = ""
    this.stopping = false
    this.element = document.getElementById("player" + index)
  }

  play(keyCode, pitchSpec) {
    this.keyCode = keyCode
    this.element.src = "audio/" + pitchSpec.getFileName(shiftDown)
    this.element.volume = pitchSpec.volume
    this.stopping = false
    this.element.play()
    refreshTimeout()
  }

  stop() {
    this.keyCode = ""
    this.stopping = true
    refreshTimeout()
  }

  onUpdate() {
    if (this.stopping) {
      var volume = this.element.volume
      volume -= 0.1
      if (volume < 0) {
        volume = 0
        this.stopping = false
      }
      this.element.volume = volume
    }
  }
}

var playerIndex = 0
var playerCount = 10
var playerMap = []

document.onkeydown = function(e) {
  var keyCode = e.keyCode
  if (keyCode == 16) {
    shiftDown = true
    return
  }
  if (keyLock.has(keyCode)) {
    return
  }
  // keyCode锁
  keyLock.add(keyCode)

  var pitchSpec = keyMap[keyCode]
  if (pitchSpec == null) {
    console.log("keyCode \"" + keyCode + "\" not supported")
    return
  }

  pitchSpec.play()
};

var timeout

var refreshTimeout = function() {
  clearTimeout(timeout)
  timeout = setTimeout("logger.nextLine()", 1500)
}

var updateLog = function(pitch) {
  log.currentLog += pitch
}

document.onkeyup = function(e) {
  var keyCode = e.keyCode
  keyLock.delete(keyCode)
  if (keyCode == 16) {
    shiftDown = false
  }
  // 音量调整
  for (i in playerMap) {
    player = playerMap[i]
    if (player.keyCode == keyCode) {
      player.stop()
    }
  }
}

setInterval("onUpdate()", 50)
var onUpdate = function() {
  for (i in playerMap) {
    var player = playerMap[i]
    player.onUpdate()
  }
}

var logger = new Vue({
  el: '#log',
  data: {
    currentLog: '',
    historyLogs: []
  },
  methods: {
    nextLine: function() {
      this.historyLogs.unshift(this.currentLog)
      this.currentLog = ''
      while (this.historyLogs.length > 20) {
        this.historyLogs.pop()
      }
    }
  }
})
