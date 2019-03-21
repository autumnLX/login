'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
let config = require('../config')
let getWebpackConfig = require('./webpack.prod.conf')




const spinner = ora('building for production...')
const argvs = process.argv.slice(2)
// rm(path.posix.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
//     if (err) throw err
    spinner.start()
    build()
// })
function build() {
    argvs.forEach(
        (modulename, index) => {
            // config.build.assetsPublicPath = modulename
            // config.build.assetsSubDirectory = modulename
            rm(path.posix.join(config.build.assetsSubDirectory, 'modules',modulename), err => {
                if (err) throw err
                webpack(getWebpackConfig(modulename, index + 1 === argvs.length), (err, stats) => {
                    spinner.stop()
                    if (err) throw err
                    process.stdout.write(stats.toString({
                        colors: true,
                        modules: false,
                        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                        chunks: false,
                        chunkModules: false
                    }) + '\n\n')

                    if (stats.hasErrors()) {
                        console.log(chalk.red('  Build failed with errors.\n'))
                        process.exit(1)
                    }

                    console.log(chalk.cyan('  Build complete.\n'))
                    console.log(chalk.yellow(
                        '  Tip: built files are meant to be served over an HTTP server.\n' +
                        '  Opening index.html over file:// won\'t work.\n'
                    ))
                })
            })

        }
    )
}
