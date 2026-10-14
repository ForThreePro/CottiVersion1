import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = m.sender
    let nombre = conn.getName(user)
    let groupName = await conn.getName(m.chat)

    if (!m.isGroup) {
        let error = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ SALIR ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Este comando solo funciona en grupos
💅 ➛ La reina no sale de su castillo, solo de grupos

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let miNumero = '56931300864@s.whatsapp.net'
    if (user !== miNumero) {
        let error = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐀𝐂𝐂𝐄𝐒𝐎 𝐃𝐄𝐍𝐄𝐆𝐀𝐃𝐎 ﹒ SALIR ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
🔒 ➛ Este comando es exclusivo de la dueña
👑 ➛ Solo la reina mayor puede irse

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    let pp
    try {
        pp = await conn.profilePictureUrl(user, 'image')
    } catch {
        pp = 'https://files.evogb.win/YhR5LZ.jpg'
    }

    let texto = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 ﹒ ADIOS ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`SALIENDO\`\` 👋 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
👋 ➛ *${nombre}* se despide de: *${groupName}*
👑 ➛ Reina se va por más brillo

── *📝 MENSAJE* ╏ 💅
✨ ➛ Gracias por la confianza depositada
✨ ➛ Cada momento compartido en este grupo
✨ ➛ Por elegirnos como su Bot #1 de WhatsApp 2026
🎀 ➛ Me llevo los mejores recuerdos coquette
💌 ➛ Si necesitan volver a contar conmigo, aquí estaré
🌙 ➛ Amo este grupo, reinas

── *📞 SOPORTE* ╏ 🕯️
📱 ➛ Soporte 24/7: *+56 9 3130 0864*
✨ ➛ Soporte con brillo incluido

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: texto,
        mentions: [user]
    })

    await conn.sendMessage(m.chat, { text: `👑 Saliendo en 3... Reina terminando brillo ✨` })
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendMessage(m.chat, { text: `🎀 Saliendo en 2... Guardando corona` })
    await new Promise(r => setTimeout(r, 1000))
    await conn.sendMessage(m.chat, { text: `💅 Saliendo en 1... Bye reina!` })
    await new Promise(r => setTimeout(r, 1000))

    await conn.groupParticipantsUpdate(m.chat, [user], "remove")
}

handler.help = ['salir']
handler.tags = ['owner']
handler.command = /^salir$/i
handler.group = true
handler.botAdmin = true
export default handler