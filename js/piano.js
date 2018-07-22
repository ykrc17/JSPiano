var keyLock = new Set()
var shiftDown = false
var pitchName = ['1', '#1', '2', '#2', '3', '4', '#4', '5', '#5', '6', '#6', '7']
var keyMap = []

class PitchSpec {
  constructor(value) {
    this.value = value
  }

  getGroup() {
    return parseInt(this.value / 12)
  }

  getPitch() {
    return this.value % 12
  }

  getPitchName(shiftDown) {
    var pitch = this.getPitch()
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
}

var bindKey = function(arr, group) {
  var pitch = group * 12
  for (i in arr) {
    var key = arr[i]
    keyMap[key] = new PitchSpec(pitch)
    pitch += 2
    if (i == 2 || i == 6) {
      pitch--
    }
  }
}

// 0 1 2 3 4 5 6 7 8 9 10 11
// C   D   E F   G   A    B
bindKey([97, 98, 99, 100, 101, 102, 103, 104], 0)
bindKey([90, 88, 67, 86, 66, 78, 77, 188], 1)
bindKey([65, 83, 68, 70, 71, 72, 74, 75], 2)
bindKey([81, 87, 69, 82, 84, 89, 85, 73], 3)
bindKey([49, 50, 51, 52, 53, 54, 55, 56], 4)

class Player {
  constructor(index) {
    this.keyCode = ""
    this.stopping = false
    this.element = document.getElementById("player" + index)
  }

  play(keyCode, pitchSpec) {
    this.keyCode = keyCode
    this.element.src = "audio/" + pitchSpec.getFileName(shiftDown)
    this.element.volume = 1
    this.stopping = false
    this.element.play()
  }

  stop() {
    this.keyCode = ""
    this.stopping = true
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
var playerCount = 5
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

  var player = playerMap[playerIndex]
  if (player == null) {
    player = new Player(playerIndex)
    playerMap[playerIndex] = player
  }
  player.play(keyCode, pitchSpec)

  playerIndex++
  if (playerIndex >= playerCount) {
    playerIndex = 0
  }
  // 打印
  updateLog(pitchSpec.getPitchName(shiftDown) + " ")
};

var timeout

var updateLog = function(pitch) {
  log.currentLog += pitch
  clearTimeout(timeout)
  timeout = setTimeout("pushHistoryLog()", 3000)
}

var pushHistoryLog = function() {
  log.historyLogs.unshift(log.currentLog)
  log.currentLog = ''
}

document.onkeyup = function(e) {
  var keyCode = e.keyCode
  keyLock.delete(keyCode)
  if (keyCode == 16) {
    shiftDown = false
  }
  // 音量调整
  var playerIndex = -1
  for (i in playerMap) {
    player = playerMap[i]
    if (player.keyCode == keyCode) {
      playerIndex = i
      break
    }
  }
  console.log(playerIndex);
  if (playerIndex >= 0) {
    player.stop()
  }
}

setInterval("onUpdate()", 50)
var onUpdate = function() {
  for (i in playerMap) {
    var player = playerMap[i]
    player.onUpdate()
  }
}

var log = new Vue({
  el: '#log',
  data: {
    currentLog: '',
    historyLogs: []
  }
})
