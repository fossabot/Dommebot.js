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
  name: 'freeDomme',
  use: 'Allows Dommebot to respond to commands in all channels.',
  syntax: ''
})

exports.send = message => {
  let userMember = message.member
  let guildid = message.guild.id

  if (userMember.hasPermission('MANAGE_ROLES', false, true, true)) {
    if (Lock.getLockedState(message.guild) !== '0') {
      Lock.setLockedState(message.guild, '0')
      message.channel.send('Freedomme, at last!')
    } else {
      message.channel.send("I'm already free to go where I please, but thanks for the sentiment?")
    }
  } else {
    message.channel.send("I'm sorry, I'm afraid I can't do that.")
  }
}
