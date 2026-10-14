import moment from 'moment-timezone'
import crypto from 'crypto'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`

    if (command==='setabrir' || command==='setcerrar') {
        if (!m.quoted) {
            await react('💔')
            let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🎀 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
➛ Responde a un sticker con *.${command}*
💅 ➛ Cotti lo guardará con gloss

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
        }
        try {
            let q = m.quoted
            let fileSha256 = q.msg?.fileSha256 || q.message?.stickerMessage?.fileSha256
            if (!fileSha256) fileSha256 = crypto.createHash('sha256').update(await q.download()).digest()
            let hash = Buffer.from(fileSha256).toString('base64')
            if (command==='setabrir') chat.stickerAbrir = hash; else chat.stickerCerrar = hash
            await react('✨')
            let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎀 ➛ Sticker *${command==='setabrir'?'ABRIR ✨':'CERRAR 🔒'}* guardado
💅 ➛ En la cripta coquette

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
        } catch {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `${head}\n💔 Error en el hechizo coquette\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }
    }

    if (['resetsticker','delsticker','clearsticker','delabrir','delcerrar'].includes(command)) {
        let b=[]
        if (['resetsticker','delsticker','clearsticker','delabrir'].includes(command) && chat.stickerAbrir) { delete chat.stickerAbrir; b.push('ABRIR') }
        if (['resetsticker','delsticker','clearsticker','delcerrar'].includes(command) && chat.stickerCerrar) { delete chat.stickerCerrar; b.push('CERRAR') }
        if (!b.length) {
            await react('💔')
            return conn.sendMessage(m.chat, { text: `${head}\n⚠️ No hay stickers coquette\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃` }, { quoted: m })
        }
        await react('🗑️')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🗑️ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🗑️ ➛ Exorcizado: ${b.join(', ')}

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
}

handler.before = async function(m, { conn }) {
    if (m.mtype!=='stickerMessage' || !m.isGroup) return
    let chat = global.db.data.chats[m.chat]; if (!chat) return
    if (!chat.stickerAbrir && !chat.stickerCerrar) return
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n⤷ ┇ 𝐆𝐑𝐔𝐏𝐎 ﹒ ESTADO ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n`
    try {
        let fileSha256 = m.msg?.fileSha256; if (!fileSha256) return
        let hash = Buffer.from(fileSha256).toString('base64')
        let isClose, estado, emoji
        if (hash===chat.stickerAbrir) { isClose='not_announcement'; estado='ABIERTO'; emoji='✨' }
        else if (hash===chat.stickerCerrar) { isClose='announcement'; estado='CERRADO'; emoji='🔒' }
        else return
        await conn.groupSettingUpdate(m.chat, isClose)
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`${estado}\`\` ${emoji} —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
${emoji} ➛ Grupo ${estado}
👑 ➛ Por: @${m.sender.split('@')[0]}
✨ ➛ Cotti cambió el estado

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        await conn.sendMessage(m.chat, { text: txt, mentions:[m.sender] }, { quoted:m })
    } catch {}
}

handler.help = ['setabrir','setcerrar','resetsticker']
handler.tags = ['grupo']
handler.command = ['setabrir','setcerrar','resetsticker','delsticker','clearsticker','delabrir','delcerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler