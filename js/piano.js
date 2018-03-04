var set = new Set()
var shiftDown = false

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
  switch (keyCode) {
    case 81:
      audio = "41"
      break;
    default:
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
