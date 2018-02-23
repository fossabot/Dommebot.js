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
  name: 'dommeLock',
  use: 'Locks Dommebot to a single channel.',
  syntax: ''
})

exports.send = message => {
  let userMember = message.member
  let guildid = message.guild.id

  if (userMember.hasPermission('MANAGE_ROLES', false, true, true)) {
    if (Lock.getLockedState(message.guild) === '0') {
      Lock.setLockedState(message.guild, message.channel.id)
      message.channel.send("I'll stick around here for a bit, don't you think?")
    } else {
      message.channel.send("Don't you realize I'm already stuck here?")
    }
  } else {
    message.channel.send("I'm sorry, I'm afraid I can't do that.")
  }
}
