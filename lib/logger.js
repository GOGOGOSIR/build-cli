import chalk from 'chalk'

export const success = (msg) => {
  msg &&
    console.log(
      `${chalk.bgGreen(chalk.white(' SUCCESS: '))} ${chalk.green(msg)}`
    )
}

export const error = (msg) => {
  msg &&
    console.error(`${chalk.bgRed(chalk.white(' ERROR: '))} ${chalk.red(msg)}`)
}

export const warn = (msg) => {
  msg &&
    console.warn(
      `${chalk.bgYellow(chalk.white(' WARNING: '))} ${chalk.yellow(msg)}`
    )
}

export const log = (msg, color = 'white') => {
  msg && console.log(chalk[color](msg))
}
