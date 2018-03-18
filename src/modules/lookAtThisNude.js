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
let responses = []
fs.readFile('./config/lookAtThisNude.json', 'utf8', function onRead (err, data) {
  if (err) {
    console.error(err.message)
  }

  responses = JSON.parse(data).responses
})

Help.document({
  name: 'lookAtThisNude',
  use: 'Have Dommebot critique your nude',
  syntax: ''
})

exports.send = message => {
  let index = Random.getRandomIntExclusive(0, responses.length)
  message.channel.send(responses[index])
}
