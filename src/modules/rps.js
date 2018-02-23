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
let responses = {}
fs.readFile('./config/rps.json', 'utf8', function onRead(err, data) {
  if (err) {
    console.error(err.message)
  }

  responses = JSON.parse(data)
})

/*Help.document({
  name: 'rps',
  use: 'Play a simple game of rock paper scissors.',
  syntax: ''
})*/

exports.send = message => {
  let startIndex = Random.getRandomIntExclusive(0, responses.start.length)
  let choices = ['rock', 'paper', 'scissors']
  let map = {}

  message.channel.send(responses.start[startIndex])

  choices.forEach(function(choice, i) {
    map[choice] = {}
    map[choice][choice] = 0
    map[choice][choices[(i+1)%3]] = -1
    map[choice][choices[(i+2)%3]] = 1
  })

  let rpsIndex = Random.getRandomIntInclusive(0, 2)
  let choice2 = choices[rpsIndex]

  const filter = m => { m.author === message.author }
  message.channel.awaitMessages(filter, { maxMatches: 1 })
    .then(collected => {
      let choice1 = collected[0].content
      switch ((map[choice1] || {})[choice2] || 'invalid') {
        case 0:
          let tieIndex = Random.getRandomIntExclusive(0,
            responses.tie.length)
          message.channel.send(responses.tie[tieIndex])
          break
        case -1:
          let loseIndex = Random.getRandomIntExclusive(0,
            responses.lose.length)
          message.channel.send(responses.lose[loseIndex])
          break
        case 1:
          let winIndex = Random.getRandomIntExclusive(0,
            responses.win.length)
          message.channel.send(responses.win[winIndex])
          break
        case 'invalid':
        default:
          let invalidIndex = Random.getRandomIntExclusive(0,
            responses.invalid.length)
          message.channel.send(responses.invalid[invalidIndex])
          break
      }
    })
    .catch(collected => {
      message.channel.send('Time limit exceeded.')
    })
}
