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
const Random = require('../utilities/random')
const fs = require('fs')

let config = {}
fs.readFile('./config/begToSub.json', 'utf8', function onRead(err, data) {
  if (err) {
    console.error(err.message)
  }

  config = JSON.parse(data)
})

Help.document({
  name: 'begToSub',
  use: 'Submit to Dommebot',
  syntax: ''
})

exports.send = (message, suffix, client) => {
  let respIndex = Random.getRandomIntExclusive(0, config.responses.length)
  let pleaIndex = Random.getRandomIntExclusive(0, config.pleas.length)

  message.channel.send(config.responses[respIndex]).then(message => {
    message.author.send('Mmm... I want you to tell the chat this:\n\n' +
                        config.pleas[pleaIndex])
    .catch(err => {
      console.error(err.message)
    })
  })
}
