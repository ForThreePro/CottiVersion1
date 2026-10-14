import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`

    let isClose = command === 'abrir' ? 'not_announcement' : 'announcement'
    let estado = command === 'abrir' ? 'ABIERTO' : 'CERRADO'
    let emoji = command === 'abrir' ? '✨' : '🔒'

    try {
        await conn.groupSettingUpdate(m.chat, isClose)
        await react(emoji)
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`${estado}\`\` ${emoji} —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎀
${emoji} ➛ Grupo: *${estado}*
👑 ➛ Por: @${m.sender.split('@')[0]}
💅 ➛ Cotti cambió el estado coquette

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
    } catch {
        await react('💔')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No se pudo cambiar reina
🔒 ➛ ¿Soy admin coquette?
💅 ➛ Cotti necesita admin

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
}

handler.help = ['abrir','cerrar']
handler.tags = ['grupo']
handler.command = ['abrir','cerrar']
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler