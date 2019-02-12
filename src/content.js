var self

class App {
  constructor() {
    this.init()
  }
  init() {
    document.body.addEventListener('mousemove', function (e) {
      var text = self.findWord(e.x, e.y)
      console.log(text)
      if (!text) {
        return
      }

      if (self.lastText == text) {
        return
      } else {
        self.lastText = text
      }

      self.translate(text)
    })
  }
  translate(text) {
    if (text.trim()) {

      var query = 'apple'
      var from = 'en'
      var to = 'zh'
      var appid = '2015063000000001'
      var salt = '1435660288'
      var key = '12345678'
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var str1 = appid + query + salt + key
      var sign = MD5(str1)

      ajax({
        url: "https://openapi.baidu.com/public/2.0/bmt/translate",
        url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
        data: {
          client_id: "AVhF9A0GExzkU5gCkZ0Gbht7",
          from: 'auto',
          to: 'auto',
          q: text
        },
        data: {
          q: query,
          appid: appid,
          salt: salt,
          from: from,
          to: to,
          sign: sign
        },
        success(res) {
          document.title = res.trans_result[0].dst
        }
      })
    }
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


    var text = selection.toString().trim()

    self.selectionRestore()

    return text
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
