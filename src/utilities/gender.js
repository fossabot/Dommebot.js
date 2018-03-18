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

const fs = require('fs')
let config = {}
fs.readFile('./config/gender.json', 'utf8', function onRead (err, data) {
  if (err) {
    console.error(err.message)
  }

  config = JSON.parse(data)
})

function getReplacements (gender) {
  let vars = config.genderVars[gender]
  let replacements = []
  try {
    Object.getOwnPropertyNames(vars).forEach(key => {
      replacements.push({regex: new RegExp(`&${key}`, 'g'), value: vars[key]})
    })
  } catch (ex) {
    console.log(ex.message)
  }

  return replacements
}

function getGenders (memberRoles) {
  let genders = []
  memberRoles.forEach(role => {
    config.genderRoles.forEach(genderRole => {
      let matches = []
      if (genderRole.roles.includes(role)) {
        matches.push(genderRole.group)
      }

      if (matches.includes('any')) {
        matches = [
          'masculine',
          'feminine',
          'epicene'
        ]
      }

      matches.forEach(match => {
        if (!genders.includes(match)) {
          genders.push(match)
        }
      })
    })
  })

  if (genders.length === 0) {
    genders = ['epicene']
  }

  return genders
}

function genderString (gender, string) {
  getReplacements(gender).forEach(replacement => {
    string = string.replace(replacement.regex, replacement.value)
  })

  return string
}

module.exports = {
  genderString: genderString,
  getGenders: getGenders
}
