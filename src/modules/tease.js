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
const Gender = require('../utilities/gender')
const fs = require('fs')

let teases = {}
fs.readFile('./config/teases.json', 'utf8', function onRead(err, data) {
  if (err) {
    console.error(err.message)
  }

  teases = JSON.parse(data)
})

Help.document({
  name: 'tease',
  use: 'Get teased!',
  syntax: ''
})

function checkMatchingRoles(a, b) {
  hasMatch = false
  a.forEach(role => {
    if (b.includes(role.name)) {
      hasMatch = true
    }
  })

  return hasMatch
}

exports.send = (message, suffix, config) => {
  let subject
  let parts = suffix.split(' ')

  if (parts[1]) {
    let re = /<@([0-9]+)>/g
    if (re.test(parts[1])) {
      subject = /<@([0-9]+)>/g.exec(parts[1])[1]
    } else {
      subject = message.author.id
    }
  } else {
    subject = message.author.id
  }

  message.guild.fetchMember(subject)
    .then(member => {
      let possibleTeases = []
      let roles = member.roles.array().map(role => role.name)

      teases.Gender.forEach(gender => {
        let included = false
        gender.roles.forEach(role => {
          if (roles.includes(role) && !included) {
            possibleTeases = [...possibleTeases, ...gender.teases]
            included = true
          }
        })
      })

      teases.Colour.forEach(colour => {
        if (roles.includes(colour.name)) {
          possibleTeases = [...possibleTeases, ...colour.teases]
        }
      })

      teases.Role.forEach(role => {
        if (roles.includes(role.name)) {
          possibleTeases = [...possibleTeases, ...role.teases]
        }
      })

      teases.People.forEach(person => {
        if (person.id === member.id) {
          possibleTeases = [...possibleTeases, ...person.teases]
        }
      })

      if (possibleTeases.length === 0) {
        message.channel.send('No teases were detected for you.')
      } else {
        let index = Random.getRandomIntExclusive(0, possibleTeases.length)
        let genders = Gender.getGenders(roles)
        let genderindex = Random.getRandomIntExclusive(0, genders.length)
        message.channel.send(Gender.genderString(
          genders[genderindex],
          possibleTeases[index]))
      }
    })
}
