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

const Help = require('./help')
const fs = require('fs')
Help.document({
  name: 'nickname',
  use: 'Sets your Dommebot nickname.',
  syntax: '[nickname]'
})

let nicknames = {}
fs.readFile('./config/nicknames.json', 'utf8', function onRead (err, data) {
  if (err) {
    console.error(err.message)
  }

  nicknames = JSON.parse(data)
})

function write () {
  fs.writeFile('./config/nicknames.json', JSON.stringify(nicknames, null, 2),
    'utf8', (err) => {
      if (err) {
        console.error(err.message)
      }
    })
}

exports.send = (message, suffix, config) => {
  let nick = ''
  if (suffix.length >= 8) {
    nick = suffix.substring(9)
  }

  if (nick === '') {
    let nickname = nicknames[message.guild.id][message.author.id]
    switch (nickname) {
      case undefined:
      case null:
        message.channel.send("You haven't set a nickname yet.")
        break
      default:
        message.channel.send('Your nickname is ' + nickname)
    }
  } else {
    let charRegexp = /([\\\t\n\r`*_~])+/g
    let charArr
    let chars = ''
    while ((charArr = charRegexp.exec(nick)) !== null) {
      chars += charArr[0]
    }
    let mentions = /<@[!]*[0-9]+>/.test(nick)
    if (chars !== '') {
      chars = chars.replace(/\n/mg, ' newline ')
                   .replace(/\t/mg, ' tab ')
                   .replace(/\r/mg, ' carriage return ')
      message.channel.send(
        `Nickname \`${nick}\` contains illegal characters: \`${chars}\``)
    } else if (mentions) {
      message.channel.send('Nickname cannot contain mentions.')
    } else if (nick.length > 128) {
      message.channel.send('Nickname exceeds length limit.')
    } else {
      nicknames[message.guild.id][message.author.id] = nick
      message.channel.send(`Set your nickname to ${nick}.`)
      write()
    }
  }
}
