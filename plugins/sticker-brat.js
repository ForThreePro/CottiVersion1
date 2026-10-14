import fetch from 'node-fetch'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ BRAT ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  let q = m.quoted ? m.quoted : m
  let txt = text || q.text || q.caption || ''
  if (!txt) {
    await react('💔')
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
💅 ➛ Usa: *${usedPrefix}${command} Tu texto*
✨ ➛ Ejemplo: *${usedPrefix}brat coquette*
${footer}`
    }, { quoted: m })
  }

  try {
    await react('⏳')
    let apiUrl = `https://api.stellarwa.xyz/tools/brat?text=${encodeURIComponent(txt)}&key=proyectsV2`
    let res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`API ${res.status}`)
    let inputBuffer = await res.buffer()

    let tmpInput = path.join(tmpdir(), `brat-${Date.now()}.gif`)
    let tmpOutput = path.join(tmpdir(), `brat-${Date.now()}.webp`)
    fs.writeFileSync(tmpInput, inputBuffer)

    await new Promise((resolve, reject) => {
      ffmpeg(tmpInput).frames(1).size('512x512').aspect('1:1').autopad()
        .outputOptions('-vcodec','libwebp','-lossless','0','-q:v','50','-preset','picture','-an','-vsync','0')
        .toFormat('webp').on('end',resolve).on('error',reject).save(tmpOutput)
    })

    let stickerBuffer = fs.readFileSync(tmpOutput)
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
    fs.unlinkSync(tmpInput); fs.unlinkSync(tmpOutput)
    await react('✨')
  } catch (e) {
    await react('💔')
    await conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Error al generar sticker coquette
${footer}`
    }, { quoted: m })
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i
export default handler