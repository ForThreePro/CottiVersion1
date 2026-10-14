import moment from 'moment-timezone'
moment.locale('es')

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ ${command.toUpperCase()} ﹒ USUARIO ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n`

    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!mentionedJid) {
        await react('💔')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👑 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
➛ Menciona a una reina
➛ Responde al mensaje de la reina
💅 ➛ Ejemplo: *.${command} @user*

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    if (participants.find(p=>p.id===mentionedJid)?.admin) {
        await react('💔')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No puedes silenciar admins coquette
💅 ➛ Cotti lo prohibió

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
    if (mentionedJid===conn.user.jid) {
        await react('💔')
        return conn.sendMessage(m.chat, { text: `${head}\n❌ No puedo silenciarme reina 💅\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
    }

    if (command==="mute") {
        if (mutedUsers.has(mentionedJid)) {
            await react('⚠️')
            let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⚠️ —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⚠️ ➛ Ya está en el ataúd de gloss

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
        }
        mutedUsers.add(mentionedJid); await react('🔇')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🔇 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
🔇 ➛ Silenciada en la cripta: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}
✨ ➛ Cotti le quitó la voz

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt, mentions:[mentionedJid, m.sender] }, { quoted:m })
    } else {
        if (!mutedUsers.has(mentionedJid)) {
            await react('⚠️')
            let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⚠️ —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⚠️ ➛ No está en la cripta coquette

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
        }
        mutedUsers.delete(mentionedJid); await react('🔊')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🔊 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
🔊 ➛ Liberada del hechizo: @${mentionedJid.split('@')[0]}
👑 ➛ Por: @${m.sender.split('@')[0]}
🎀 ➛ Cotti le devolvió el gloss

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt, mentions:[mentionedJid, m.sender] }, { quoted:m })
    }
}

handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) { try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {} }
}

handler.help = ['mute @user','unmute @user']
handler.tags = ['grupo']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler