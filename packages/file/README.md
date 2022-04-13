# mini-program-file ![](https://badgen.net/npm/v/mini-program-file)  ![](https://badgen.net/npm/types/mini-program-file)  ![](https://badgen.net/npm/dt/mini-program-file) ![](https://badgen.net/badge/language/typescript/blue)

小程序的File polyfill。

<br/>

## 支持的小程序
- 微信小程序
- 支付宝小程序
> 其他小程序没有进行测试，可以自行测试

<br/>

## Example
```js
import File from 'mini-program-file'

// 设置为全局对象
// globalThis.File = File

const file = new File(["foo"], "foo.txt", {
  type: "text/plain",
});
```
> TIP: 支付宝小程序IDE环境下globalThis为undefined，[解决方法](https://github.com/zyrong/mini-program-polyfill/issues/1)  

<br/>

## API
参考: https://developer.mozilla.org/zh-CN/docs/Web/API/File
