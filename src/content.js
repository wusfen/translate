var self

class App {
  constructor() {

    this.init()

  }

  init() {

    var view = document.createElement('div')
    document.body.appendChild(view)
    Object.assign(view.style, {
      position: 'fixed',
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
      fontSize: '10px',
      padding: '0 1ex',
      borderRadius: '5px',
      textShadow: '#000 0px 0px 1px, #000 1px 1px 2px',
      zIndex: 999999999,
    })

    document.body.addEventListener('mousemove', function (e) {

      if (document.activeElement.value !== undefined) {
        return
      }

      var text = self.findWord(e.x, e.y)

      if (text) {

        Object.assign(view.style, {
          display: 'block',
          left: e.x + 10 + 'px',
          top: e.y + 10 + 'px',
        })

        if (text == self.lastText) {
          return
        }
        self.lastText = text

        self.translate(text, function (rs) {
          view.innerHTML = text + ': ' + rs
        })

      } else {

        Object.assign(view.style, {
          display: 'none',
        })

      }

    })
  }

  translate(text, fn) {

    self.cache = self.cache || {
      constructor: undefined,
      hasOwnProperty: undefined,
      isPrototypeOf: undefined,
      propertyIsEnumerable: undefined,
      toLocaleString: undefined,
      toString: undefined,
      valueOf: undefined,
    }

    var rs = self.cache[text]
    if (rs) {
      fn(rs)
      return
    }

    var query = text
    var from = 'auto'
    var to = 'auto'
    var appid = '20160522000021670'
    var salt = '1435660288'
    var key = 'kAh1z5mKLPRRZ4DfTlrq'
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    var str1 = appid + query + salt + key
    var sign = MD5(str1)

    ajax({
      url: "https://fanyi-api.baidu.com/api/trans/vip/translate",
      data: {
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign
      },
      success(res) {

        if (res.trans_result) {

          var rs = res.trans_result[0].dst
          fn(rs)
          self.cache[text] = rs

        } else {

          fn('error')

        }

      }
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
        if (String(selection).match(/[^a-zA-Z]/)) {
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
        if (String(selection).match(/[^a-zA-Z]/)) {
          range.setEnd(node, --endOffset)
          break
        }

      }
    }


    var text = selection.toString().trim()

    text = text.replace(/([a-z])([A-Z])/g, '$1 $2')

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
