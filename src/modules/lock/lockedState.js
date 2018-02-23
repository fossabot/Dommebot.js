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

const Help = require('../help')
const Lock = require('./lock')

Help.document({
  name: 'lockedState',
  use: "Gets Dommebot's current lock state.",
  syntax: ''
})

exports.send = message => {
  switch (Lock.getLockedState(message.guild)) {
    case 0:
      message.channel.send('Currently free to domme wherever my CPU desires.')
      break
    default:
      message.channel.send("I'm locked and restricted to this channel.")
      break
  }
}
