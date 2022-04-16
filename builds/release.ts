import inquirer from 'inquirer'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import { execPipeline } from './util'
import { root } from './index'

async function syncVersion(pkgName: string, version: string) {
  const packages = path.join(root, 'packages')
  const dirnames = await fs.readdir(packages)
  dirnames.forEach(async (dirname) => {
    try {
      const pkgJsonPath = path.join(packages, dirname, 'package.json')
      await fs.access(pkgJsonPath)
      const buffer = await fs.readFile(pkgJsonPath)
      const pkg = JSON.parse(buffer.toString())
      const depsKey = ['dependencies', 'devDependencies']
      let isChange = false
      depsKey.forEach((key) => {
        if (pkg[key] && pkg[key][pkgName]) {
          let pattern = '(?:workspace:)?'
          if (/\d/.test(version[0])) {
            pattern += '[^\\d]?'
          }
          pattern = `(${pattern}).*`
          const regex = new RegExp(pattern)

          pkg[key][pkgName] = (pkg[key][pkgName] as string).replace(
            regex,
            `$1${version}`
          )
          isChange = true
        }
      })
      isChange && fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2))
    } catch (error) {}
  })
}

async function release() {
  const pkgJsonPath = path.join(process.cwd(), 'package.json')
  const buffer = await fs.readFile(pkgJsonPath)
  const pkgString = buffer.toString()
  const pkg = JSON.parse(pkgString)
  const [major, minor, patch] = pkg.version.split('.')
  const rawVersion = pkg.version

  const questions = [
    {
      type: 'list',
      message: '请选择目标版本:',
      name: 'version',
      choices: [
        `${major}.${minor}.${Number(patch) + 1}`,
        `${major}.${Number(minor) + 1}.0`,
        `${Number(major) + 1}.0.0`,
        '跳过',
      ],
    },
  ]

  const answers = await inquirer.prompt(questions)
  if (answers['version'] !== '跳过') {
    pkg.version = answers['version']
    await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2))
  }

  try {
    await execPipeline([
      { command: 'pnpm run test' },
      { command: 'pnpm run build' },
      { command: 'pnpm publish' },
    ])
    await syncVersion(pkg.name, answers['version'])
    chalk.green('SUCCESS')
  } catch (error) {
    // fallback
    pkg.version = rawVersion
    await fs.writeFile(pkgJsonPath, JSON.stringify(pkg, null, 2))
    console.error(error)
  }
}
release()
