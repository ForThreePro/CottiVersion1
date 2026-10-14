import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) {
    await react('💔')
    return conn.sendMessage(m.chat, {
      text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 ﹒ USO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
💅 ➛ Responde a una *imagen, video, audio o documento* para subirlo reina

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN* 🎃`
    }, { quoted: m })
  }

  try {
    await react('⏳')
    let media = await q.download()
    let link = await myCloud(media)
    if (!link.url) throw new Error('Sin URL')

    let txt = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 ﹒ COMPLETADO ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🎀 —˙𖦹.꒷

── *📊 DATOS* ╏ 🎀
🔗 ➛ ${link.url}
📦 ➛ ${formatBytes(media.length)}
🖥️ ➛ evogb.win
✨ ➛ Subido coquette con éxito

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN* 🎃
━━━━━━━━━━━`

    await react('✨')
    await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
  } catch (e) {
    await react('💔')
    await conn.sendMessage(m.chat, {
      text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Error al subir el archivo coquette 💔
${`\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`}`
    }, { quoted: m })
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function myCloud(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType? fileType.ext : 'bin'
  const mime = fileType? fileType.mime : 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  if (!response.ok) throw new Error('Error en el servidor coquette')
  return await response.json()
}

handler.help = ['upp', 'tourl'];
handler.tags = ['tools'];
handler.command = ['upp', 'tourl'];
export default handler