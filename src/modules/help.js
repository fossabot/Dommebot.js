/**
 * Dommebot is a free multipurpose bot made for Discord.
 * Copyright (C) 2018  Ellie Phant
 *
 * Dommebot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * Dommebot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Dommebot.  If not, see <https://www.gnu.org/licenses/>.
 */

const config = require('../../config/bot.json')

let commands = {default: 'Unknown command'}

/**
 * Documents a bot command.
 * @param {Object} entry The command's help information
 * @returns {void}
 */
function document (entry) {
  commands[entry.name] = entry
}

exports.document = document

document({
  name: 'help',
  use: 'Display this message, or help for a command.',
  syntax: '[command]'
})

/**
 * Creates the padding after each command based on length.
 * @param {string} str Command name to compare to
 * @returns {string} Padded string
 */
function pad (str) {
  let length = 0

  for (const c in commands) {
    if (c !== 'default' && commands[c].name.length > length - 2) {
      length = commands[c].name.length + 2
    }
  }

  let pad = Array(length).join(' ')

  return (str + pad).substring(0, pad.length)
}

exports.pad = pad

/**
 * Lists commands as documented in each module.
 * @returns {string} List of commands
 */
function getCommands () {
  let pjson = require('../../package.json')

  let list = '```\n'
  for (const c in commands) {
    if (c !== 'default' && !commands[c].hidden) {
      list += `${pad(commands[c].name + ':')}` +
              ` ${commands[c].use}\n`
    }
  }

  return list + `\nDommebot Version ${pjson.version}\n\`\`\``
}

/**
 * Fetches help for given command.
 * @param {string} c The command for which help information is obtained
 * @param {Object} config The bot's config
 * @returns {string} Help for specified command
 */
function getCommandHelp (c, config) {
  let arr = Object.keys(commands)
  let lower = arr.map(key => {
    return key.toLowerCase().replace(/-/g,'')
  })
  let command = c.replace(/-/g,'')
  if (lower.includes(command)) {
    let entry = commands[arr[lower.indexOf(command)]]
    let begin = '```\n' + entry.name + ': ' + entry.use + '\n\n'
    let end = `usage: ${config.bot.prefix} ${entry.name} ` +
              entry.syntax + '```'

    if (entry.onlySyntax) {
      return begin +
        `usage: ${entry.syntax}\`\`\``
    } else {
      return begin + end
    }
  } else {
    return `${commands.default} ${c}.`
  }
}

/**
 * Module to show help information for bot commands.
 * @param {Message} message The message that triggered this command
 * @param {string} suffix The part of the message after the bot's prefix
 * @returns {void}
 */
exports.send = (message, suffix) => {
  if (suffix === 'help') {
    message.channel.send(getCommands())
  } else {
    message.channel.send(getCommandHelp(suffix.substring(5).toLowerCase(), config))
  }
}
