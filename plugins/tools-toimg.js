import { webp2mp4 } from '../lib/webp2mp4.js'
import { toAudio } from '../lib/converter.js'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐓𝐎𝐎𝐋𝐒 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  if (['tovid', 'tovideo'].includes(command)) {
    if (!m.quoted || !/webp/.test(m.quoted.mimetype || '')) {
      await react('💔')
      return conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Responde a un *sticker coquette* 💅
${footer}`
      }, { quoted: m })
    }
    try {
      await react('⏳')
      let media = await m.quoted.download()
      let out = await webp2mp4(media)
      await react('✨')
      await conn.sendFile(m.chat, out, 'video.mp4', `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🎀 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎀 ➛ Sticker a video coquette listo
${footer}`, m)
    } catch {
      await react('💔')
      await conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No se pudo convertir a video reina
${footer}`
      }, { quoted: m })
    }
  }

  if (['tomp3', 'toaudio'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) {
      await react('💔')
      return conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Responde a un *video o audio coquette*
${footer}`
      }, { quoted: m })
    }
    try {
      await react('⏳')
      let media = await q.download?.()
      let audio = await toAudio(media, 'mp4')
      await react('✨')
      await conn.sendFile(m.chat, audio.data, 'audio.mp3', `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🎀 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎧 ➛ Audio coquette extraído
${footer}`, m, null, { mimetype: 'audio/mp4' })
    } catch {
      await react('💔')
      await conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No se pudo convertir a audio
${footer}`
      }, { quoted: m })
    }
  }

  if (['toimg', 'simg'].includes(command)) {
    let q = m.quoted ? m.quoted : m
    if (!((q.mimetype || '').includes('webp'))) {
      await react('💔')
      return conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Responde a un *sticker coquette*
${footer}`
      }, { quoted: m })
    }
    try {
      await react('⏳')
      let media = await q.download()
      await react('✨')
      await conn.sendMessage(m.chat, {
        image: media,
        caption: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🎀 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎀 ➛ Sticker a imagen coquette listo
${footer}`
      }, { quoted: m })
    } catch {
      await react('💔')
      await conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ No se pudo convertir reina
${footer}`
      }, { quoted: m })
    }
  }
}

handler.help = ['tovid', 'tomp3', 'toimg']
handler.tags = ['tools']
handler.command = ['tovid', 'tovideo', 'tomp3', 'toaudio', 'toimg', 'stickerimg', 'simg']
export default handler