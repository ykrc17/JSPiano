var set = new Set()
var shiftDown = false
var keyMap = []
keyMap[81]=41
keyMap[87]=42
keyMap[69]=43
keyMap[82]=44
keyMap[84]=45
keyMap[89]=46
keyMap[85]=47

document.onkeydown = function(e) {
  var audio = ""
  var keyCode = e.keyCode
  if (keyCode == 16) {
    shiftDown = true
    return
  }
  if (set.has(keyCode)) {
    return
  }
  // keyCode锁
  set.add(keyCode)

  audio=keyMap[keyCode]
  if (audio == null) {
    console.log("keyCode \"" + keyCode + "\" not supported")
    return
  }
  if (shiftDown) {
    audio += "b"
  }
  if (audio != "") {
    var element = document.getElementById("audio")
    element.src = "audio/" + audio + ".mp3"
    element.play()
  }
};

document.onkeyup = function(e) {
  var keyCode = e.keyCode
  set.delete(keyCode)
  if (keyCode == 16) {
    shiftDown = false
  }
}
