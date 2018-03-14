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

/**
 * Requires
 */
const Discord = require("discord.js")
const fs = require('fs')

/**
 * Modules
 */
const Modules = require('./modules/')

let prefixes = []
let client
let config = {}

let commands = {
  addrank: {
    process: function process (message, suffix, config, client) {
      Modules.Ranks.addRank(message, suffix, config, client)
    }
  },
  delrank: {
    process: function process (message, suffix, config, client) {
      Modules.Ranks.delRank(message, suffix, config, client)
    }
  },
  dommelock: {
    process: function process (message) {
      Modules.Lock.DommeLock.send(message)
    }
  },
  freedomme: {
    process: function process (message) {
      Modules.Lock.FreeDomme.send(message)
    }
  },
  help: {
    process: function process (message, suffix) {
      Modules.Help.send(message, suffix)
    }
  },
  kinklist: {
    process: function process (message) {
      Modules.Kinklist.send(message)
    }
  },
  lockedstate: {
    process: function process (message) {
      Modules.Lock.LockedState.send(message)
    }
  },
  lookatthisnude: {
    process: function process (message) {
      Modules.LookAtThisNude.send(message)
    }
  },
  nickname: {
    process: function process (message, suffix, config) {
      Modules.Nickname.send(message, suffix, config)
    }
  },
  pronouns: {
    process: function process (message) {
      Modules.Pronouns.send(message)
    }
  },
  rank: {
    process: function process (message, suffix, config, client) {
      Modules.Ranks.rank(message, suffix, config, client)
    }
  },
  ranks: {
    process: function process (message, suffix, config) {
      Modules.Ranks.ranks(message, suffix, config)
    }
  },
  tease: {
    process: function process (message, suffix, config) {
      Modules.Tease.send(message, suffix, config)
    }
  }
}

/**
 * Parses messages for bot commands.
 * @param {Message} message Message to check for commands
 * @returns {void}
 */
function parseMessage (message) {
  let summoned = false
  let prefix = ''
  let parts = message.content.split(' ')
  if (message.channel.type === 'dm') {
    return
  }

  if (prefixes.includes(parts[0].toLowerCase())) {
    summoned = true
    prefix = parts[0].toLowerCase()
  } else if (parts[0] === `<@${client.user.id}>`) {
    summoned = true
    prefix = `<@${client.user.id}>`
  }

  if (summoned &&
      message.author.bot === false) {
    let lock = Modules.Lock.Lock.getLockedState(message.guild)
    if (message.channel.id === lock || lock === '0') {
      let cmd = parts[1].toLowerCase().replace(/-/g,'')
      let suffix = cmd + message.content.slice(prefix.length +
                                               parts[1].length + 1)

      if (commands[cmd]) {
        commands[cmd].process(message, suffix, config, client)
      }
    }
  }
}

/**
 * Register bot events.
 * @returns {void}
 */
function registerEvents() {
  client.on('ready', function onReady () {
    console.log(
      `Logged in as ${client.user.username} - ${client.user.id}\n`)
    client.user.setPresence({
      game: {
        name: config.bot.status,
        type: 0
      }
    })
  })

  client.on('message', message => parseMessage(message))

  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason)
  })
}

/**
 * Read config and initialize bot.
 */
fs.readFile('./config/bot.json', 'utf8', function onRead (err, data) {
  if (err) {
    console.error(err.message)
  }

  config = JSON.parse(data)
  prefixes = config.bot.prefixes

  client = new Discord.Client({
    disabledEvents: config.bot.disabledEvents
  })

  client.login(config.bot.token)

  registerEvents()
})
