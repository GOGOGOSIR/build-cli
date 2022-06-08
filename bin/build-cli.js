#!/usr/bin/env node

import updater from 'update-notifier'
import parser from 'yargs-parser'
import cli from '../lib/cli.js'
import { getPackageData } from '../lib/util.js'

const pkg = getPackageData()

const aliases = {
  c: 'config',
  v: 'version',
  h: 'help'
}

const parseCliArguments = (args) => {
  const options = parser(args, {
    alias: aliases,
    configuration: {
      'parse-numbers': false,
      'camel-case-expansion': false
    }
  })

  return options
}

const options = parseCliArguments([].slice.call(process.argv, 2))

updater({ pkg }).notify()

cli(options).then(() => {
  process.exit(0)
}, () => {
  process.exit(1)
})
