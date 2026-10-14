import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, usedPrefix, text, command, isAdmin, isOwner }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n.⃟𖥔 ݁. 𖦹˙— \`\`INFO\`\` 🎀 —˙𖦹.꒷\n\n${txt}` + footer }, { quoted: m })

  if (!isAdmin && !isOwner) {
      await react('💔')
      return conn.sendMessage(m.chat, {
          text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ ADMIN ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷\n\n── *📝 AVISO* ╏ 🎀\n❌ ➛ Solo admins coquette\n${footer}`
      }, { quoted: m })
  }

  if (['resetlink','revokelink'].includes(command)) {
    try {
      await react('🔗')
      await conn.groupRevokeInvite(m.chat)
      let code = await conn.groupInviteCode(m.chat)
      await react('✨')
      return reply(`── *🔗 LINK* ╏ 💖\n🔗 ➛ Nuevo link coquette:\nhttps://chat.whatsapp.com/${code}\n\n✨ ➛ Cotti lo reseteó`)
    } catch { await react('💔'); return reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ Necesito ser admin reina`) }
  }

  if (['setname','setgroupname'].includes(command)) {
    if (!text) { await react('💔'); return reply(`── *📖 USO* ╏ 🎀\n💅 ➛ Usa: *${usedPrefix}setname Nuevo nombre*`) }
    try { await react('⏳'); await conn.groupUpdateSubject(m.chat, text); await react('✨'); return reply(`── *📊 INFO* ╏ 🎀\n🎀 ➛ Nombre cambiado a: *${text}*\n💅 ➛ Cotti lo aprobó`) }
    catch { await react('💔'); return reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ Error al cambiar nombre`) }
  }

  if (['setdesc','setgroupdesc'].includes(command)) {
    if (!text) { await react('💔'); return reply(`── *📖 USO* ╏ 🎀\n💅 ➛ Usa: *${usedPrefix}setdesc Nueva descripción*`) }
    try { await react('⏳'); await conn.groupUpdateDescription(m.chat, text); await react('✨'); return reply(`── *📊 INFO* ╏ 🎀\n🎀 ➛ Descripción coquette actualizada\n✨ ➛ Cotti la dejó brillosa`) }
    catch { await react('💔'); return reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ Error al cambiar descripción`) }
  }

  if (['setfoto','setppgroup','setppgc'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    try {
      await react('⏳')
      if (text && /https?:\/\//.test(text)) {
        await conn.updateProfilePicture(m.chat, { url: text })
      } else if (/image/.test(mime)) {
        let img = await q.download()
        await conn.updateProfilePicture(m.chat, img)
      } else { await react('💔'); return reply(`── *📖 USO* ╏ 🎀\n💅 ➛ Responde a una imagen o pasa un link coquette`) }
      await react('✨')
      return reply(`── *📊 INFO* ╏ 🎀\n🎀 ➛ Foto coquette actualizada\n✨ ➛ Cotti la dejó hermosa`)
    } catch { await react('💔'); return reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ Error al actualizar foto`) }
  }
}

handler.help = ['resetlink','setname','setdesc','setfoto']
handler.tags = ['grupos']
handler.command = ['resetlink','revokelink','setname','setgroupname','setdesc','setgroupdesc','setfoto','setppgroup','setppgc']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler