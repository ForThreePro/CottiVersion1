import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (!m.mentionedJid[0] &&!m.quoted) {
    await react('💔')
    let texto = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐂𝐈𝐎𝐍 ﹒ PROMOTE ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👑 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
➛ Menciona a una reina
➛ Responde al mensaje de la reina
💅 ➛ Reina: menciona pe

── *💡 EJEMPLOS* ╏ 💖
➛.promote @user
➛.demote @user

── *📝 AVISO* ╏ ✨
🔒 ➛ Solo admins coquette
💖 ➛ Solo las que traen gloss

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
  }

  let user = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted.sender
  let action = command === 'promote' || command === 'promover' || command === 'daradmin'? 'promote' : 'demote'

  await react(action === 'promote'? '✨' : '💔')

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], action)
  } catch {
    await react('💔')
    let error = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐑𝐎𝐑 ﹒ ADMIN ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No se pudo completar la acción reina
🔒 ➛ Verifica permisos del bot coquette
💅 ➛ La coquette dice: el bot no es admin pe

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
    return conn.sendMessage(m.chat, { text: error }, { quoted: m })
  }

  let msgAccion = action === 'promote'
? `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐏𝐑𝐎𝐌𝐎𝐕𝐈𝐃𝐀 ﹒ NUEVA ADMIN ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
👑 ➛ Nueva Admin: @${user.split('@')[0]}
💖 ➛ Por: @${m.sender.split('@')[0]}
✨ ➛ Cotti aprobó a la nueva reina

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
    : `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐃𝐄𝐆𝐑𝐀𝐃𝐀 ﹒ QUITAR ADMIN ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 💔 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
💔 ➛ Ya no es Admin: @${user.split('@')[0]}
💖 ➛ Por: @${m.sender.split('@')[0]}
🎀 ➛ Cotti le quitó el gloss

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`

  await conn.sendMessage(m.chat, { text: msgAccion, mentions: [user, m.sender] }, { quoted: m })
}

handler.help = ['promote @user', 'demote @user']
handler.tags = ['grupo']
handler.command = /^(promote|promover|daradmin|demote|degradar|quitaradmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler