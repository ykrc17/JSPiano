var keyLock = new Set()
var shiftDown = false
var keyMap = []

keyMap[65] = 31
keyMap[83] = 32
keyMap[68] = 33
keyMap[70] = 34
keyMap[71] = 35
keyMap[72] = 36
keyMap[74] = 37

keyMap[81] = 41
keyMap[87] = 42
keyMap[69] = 43
keyMap[82] = 44
keyMap[84] = 45
keyMap[89] = 46
keyMap[85] = 47
var playerIndex = 0
var playerCount = 5

document.onkeydown = function(e) {
  var audio = ""
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

  audio = keyMap[keyCode]
  if (audio == null) {
    console.log("keyCode \"" + keyCode + "\" not supported")
    return
  }
  if (shiftDown) {
    audio += "b"
  }
  if (audio != "") {
    var element = document.getElementById("player" + playerIndex)
    element.src = "audio/" + audio + ".mp3"
    element.play()
    playerIndex++
    if (playerIndex >= playerCount) {
      playerIndex = 0
    }
  }
};

document.onkeyup = function(e) {
  var keyCode = e.keyCode
  keyLock.delete(keyCode)
  if (keyCode == 16) {
    shiftDown = false
  }
}
