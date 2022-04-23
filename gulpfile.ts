import gulp from 'gulp'
import { TaskCallback } from 'undertaker'
import path from 'path'
import packageJson from './package.json'
import fs from 'fs/promises'
import os from 'os'
import { delDist, buildCjs, buildEsm, npmlink, buildNpm } from './builds/index'

const pkgRoot = path.join(__dirname, '.')
const srcGlob = path.join(pkgRoot, './index.ts')
const dest = path.join(pkgRoot, path.dirname(packageJson.main))
const cjsFilename = path.basename(packageJson.main)
const esmFilename = path.basename(packageJson.module)

const delPath = path.join(pkgRoot, 'dist')

export async function build(done: TaskCallback) {
  try {
    await delDist(delPath)
    await Promise.all([
      buildCjs(srcGlob, dest, { 'index.js': cjsFilename }, false),
      buildEsm(srcGlob, dest, { 'index.js': esmFilename }, false),
    ])
    // await removeDTS_RawBlob()
    // await removeDTS_buffer()
    done()
  } catch (error: any) {
    done(error)
  }
}

function removeDTS_buffer() {
  return new Promise((resolve, reject) => {
    const d_ts_path = path.join(pkgRoot, './dist/index.d.ts')
    fs.readFile(d_ts_path).then((buffer) => {
      const string = buffer.toString().replace(/\s.*?private _buffer;/, '')
      fs.writeFile(d_ts_path, string).then(resolve)
    })
  })
}

function removeDTS_RawBlob() {
  return new Promise((resolve, reject) => {
    const d_ts_path = path.join(pkgRoot, './dist/index.d.ts')
    fs.readFile(d_ts_path).then((buffer) => {
      let string = buffer
        .toString()
        .replace(/declare const _default((.|\r|\n)*)/, '')
      string = string + os.EOL + 'export default BlobPolyfill'
      fs.writeFile(d_ts_path, string).then(resolve)
    })
  })
}