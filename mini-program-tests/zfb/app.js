import FormData from 'mini-program-formdata'

if (typeof globalThis !== 'object') {
  Object.defineProperty(Object.prototype, 'globalThis', {
    get() {
      return this
    },
  })
}

globalThis.FormData = FormData

const rawRequest = my.request
function request(reqOpt) {
  if (reqOpt.data instanceof FormData) {
    const blob = reqOpt.data._blob()
    if (!reqOpt.headers) reqOpt.headers = {}
    reqOpt.headers['content-type'] = blob.type
    blob.arrayBuffer().then((buffer) => {
      reqOpt.data = buffer
      // console.log(reqOpt);
      rawRequest(reqOpt)
    })
  }
}
Object.defineProperty(my, 'request', {
  get() {
    return request
  },
})

App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch')
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
})
