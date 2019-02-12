var self

class App {
  constructor() {
    this.addEvent()
  }
  addEvent() {
    document.body.addEventListener('mousemove', function (e) {
      self.findWord(e.x, e.y)
    })
  }
  findWord(x, y) {
    self.selectionSave()
    var selection = document.getSelection()

    // 从当前坐标创建一个选区
    var range = document.caretRangeFromPoint(x, y)
    var startOffset = range.startOffset
    var endOffset = range.endOffset
    var node = range.startContainer
    selection.addRange(range)

    // 文本节点扩展选区
    if (node.nodeValue) {
      // 左边扩选
      while (true) {
        startOffset -= 1
        if (startOffset < 0) {
          break
        }

        range.setStart(node, startOffset)

        // 遇到非英文回退
        if (String(selection).match(/[^a-zA-Z_-]/)) {
          range.setStart(node, ++startOffset)
          break
        }
      }
      // 右边扩选
      while (true) {
        endOffset += 1
        if (endOffset > node.nodeValue.length) {
          break
        }

        range.setEnd(node, endOffset)

        // 遇到非英文回退
        if (String(selection).match(/[^a-zA-Z_-]/)) {
          range.setEnd(node, --endOffset)
          break
        }
      }
    }


    var text = selection.toString()
    console.log(text)


    self.selectionRestore()
  }
  selectionSave() {
    var array = []
    var selection = document.getSelection()
    var rangeCount = selection.rangeCount
    for (let i = 0; i < rangeCount; i++) {
      var range = selection.getRangeAt(i)
      array.push(range)
    }
    this._selectionRanges = array
    selection.removeAllRanges()
  }
  selectionRestore() {
    var array = this._selectionRanges
    var selection = document.getSelection()
    selection.removeAllRanges()
    for (let i = 0; i < array.length; i++) {
      var range = array[i]
      selection.addRange(range)
    }
  }
}

self = new App