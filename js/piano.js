var keyLock = new Set()
var shiftDown = false
var keyMap = []

keyMap[97] = 11
keyMap[98] = 12
keyMap[99] = 13
keyMap[100] = 14
keyMap[101] = 15
keyMap[102] = 16
keyMap[103] = 17
keyMap[104] = 21

keyMap[90] = 21
keyMap[88] = 22
keyMap[67] = 23
keyMap[86] = 24
keyMap[66] = 25
keyMap[78] = 26
keyMap[77] = 27
keyMap[188] = 31

keyMap[65] = 31
keyMap[83] = 32
keyMap[68] = 33
keyMap[70] = 34
keyMap[71] = 35
keyMap[72] = 36
keyMap[74] = 37
keyMap[75] = 41

keyMap[81] = 41
keyMap[87] = 42
keyMap[69] = 43
keyMap[82] = 44
keyMap[84] = 45
keyMap[89] = 46
keyMap[85] = 47
keyMap[73] = 51

keyMap[49] = 51
keyMap[50] = 52
keyMap[51] = 53
keyMap[52] = 54
keyMap[53] = 55
keyMap[54] = 56
keyMap[55] = 57
keyMap[56] = 61
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
