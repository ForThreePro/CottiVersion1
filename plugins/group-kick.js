import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) {
        await react('💔')
        let error = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐗𝐏𝐔𝐋𝐒𝐀𝐑 ﹒ USUARIO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👢 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
➛ Menciona a una reina
➛ Responde al mensaje de la reina
💅 ➛ Cotti: apunta bien pe

── *📝 AVISO* ╏ ✨
🔒 ➛ Solo admins coquette

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        let user = participants.find(p => p.id === mentionedJid)
        let isAdmin = user?.admin

        if (mentionedJid === conn.user.jid) {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎀\n❌ ➛ No puedo exorcizarme a mí misma reina\n💅 ➛ Cotti no se auto-banea\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }
        if (mentionedJid === ownerGroup) {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎀\n❌ ➛ No puedo expulsar al propietario del grupo\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }
        if (mentionedJid === ownerBot) {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎀\n❌ ➛ No puedo expulsar al dueño del bot reina\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }
        if (isAdmin) {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n── *📝 AVISO* ╏ 🎀\n❌ ➛ No puedo expulsar a una admin coquette\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }

        await react('👢')
        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')

        let kickMsg = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐗𝐏𝐔𝐋𝐒𝐀𝐃𝐀 ﹒ USUARIO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👢 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
👢 ➛ Usuario: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}
✨ ➛ Cotti le dio su patada con brillo

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: kickMsg, mentions: [mentionedJid, m.sender] }, { quoted: m })
    } catch (e) {
        await react('💔')
        let error = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ KICK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Se ha producido un problema reina
🔧 ➛ ${e.message}
💅 ➛ Cotti se asustó

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['kick @user']
handler.tags = ['grupo']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler