import { addExif, sticker } from '../lib/sticker.js'
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

const api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

let handler = async (m, { conn, text, usedPrefix, command, args }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const error = (msg) => conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
${msg}
${footer}`
    }, { quoted: m })

    if (['wm','take','robar'].includes(command)) {
        if (!m.quoted || !/webp/.test(m.quoted.mimetype||'')) {
            await react('💔')
            return error(`❌ ➛ Responde a un *sticker coquette* 💅`)
        }
        let [packname,...author] = text.split('|')
        author = (author||[]).join('|')
        try {
            await react('⏳')
            let img = await m.quoted.download()
            let stiker = await addExif(img, packname || 'COTTI BOT 🎀', author || 'Cotti Coquette 🎃')
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            await react('✨')
        } catch { await react('💔'); error(`❌ ➛ Error al hacer coquette el sticker`) }
        return
    }

    if (['s','sticker','stiker'].includes(command)) {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg||q).mimetype || q.mediaType || ''
        if (!/webp|image|video|gif/.test(mime)) {
            await react('💔')
            return error(`❌ ➛ Responde a una *imagen, video o gif* reina 💖`)
        }
        try {
            await react('⏳')
            let img = await q.download()
            let stiker = await sticker(img, false, 'COTTI BOT 🎀', 'Cotti Coquette 🎃')
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            await react('✨')
        } catch { await react('💔'); error(`❌ ➛ Error al crear sticker coquette`) }
        return
    }

    if (['qc','quotly'].includes(command)) {
        let txt = args.join(" ").split("/").pop().trim() || m.quoted?.text || ""
        if (!txt) { await react('💔'); return error(`💅 ➛ Uso: *${usedPrefix}qc Hola reina*`) }
        if (txt.length > 30) { await react('💔'); return error(`❌ ➛ Máximo 30 caracteres mi amor`) }
        try {
            await react('⏳')
            let authorName = await conn.getName(m.sender).catch(()=> "Cotti Reina")
            let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')
            const obj = {
                type:"quote", format:"png", backgroundColor:"#FFB6D9", width:512, height:768, scale:2,
                messages:[{ entities:[], avatar:true, from:{id:1,name:authorName,photo:{url:pp}}, text:txt, replyMessage:{}}]
            }
            const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, { headers:{'Content-Type':'application/json'} })
            const buffer = Buffer.from(json.data.result.image, 'base64')
            let stiker = await sticker(buffer, false, 'COTTI BOT 🎀', '')
            await conn.sendFile(m.chat, stiker, 'quotly.webp', '', m)
            await react('✨')
        } catch { await react('💔'); error(`❌ ➛ Error al generar qc coquette`) }
        return
    }

    if (['emojimix','mix'].includes(command)) {
        let [emoji1, emoji2] = text.split(/[&+\s]+/)
        if (!emoji1 || !emoji2) { await react('💔'); return error(`💅 ➛ Uso: *${usedPrefix}emojimix* 🎀+🎃`) }
        try {
            await react('⏳')
            let url = `${api.url}/tools/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}&key=${api.key}`
            await conn.sendMessage(m.chat, { sticker:{url} }, { quoted:m })
            await react('✨')
        } catch(e){ await react('💔'); error(`❌ ➛ Error al generar emojimix coquette`) }
    }
}

handler.help = ['wm', 's', 'qc <texto>', 'emojimix <emoji1>+<emoji2>']
handler.tags = ['sticker']
handler.command = /^(wm|take|robar|s|sticker|stiker|qc|quotly|emojimix|mix)$/i
export default handler