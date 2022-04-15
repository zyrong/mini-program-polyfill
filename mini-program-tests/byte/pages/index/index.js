const Blob = require('mini-program-blob')
const File = require('mini-program-file')
const FormData = require('mini-program-formdata')

Page({
  data: {},
  onLoad: function () {
    const blob = new Blob(['blob'])
    blob.text().then((text) => {
      console.log(text)
    })

    const file = new File(['filecontent'], 'filename')
    file.text().then((text) => {
      console.log(text)
    })

    const fd = new FormData()
    fd.append('string', 'string')
    fd.append('file', new File(['filecontent'], 'filename'))

    const IP = '192.168.50.28'
    const PORT = '3333'

    tt.request({
      url: `http://${IP}:${PORT}/post`,
      method: 'POST',
      data: fd,
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      },
    })
  },
})
