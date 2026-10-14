import fetch from 'node-fetch'
import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

async function uploadFile(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType?.ext || 'jpg'
  const mime = fileType?.mime || 'image/jpeg'

  try {
    const formData = new FormData()
    formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
    const res = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
    const j = await res.json()
    if (j.url) return j.url
    if (j.data?.url) return j.data.url
  } catch {}

  // Fallback Catbox
  const formData2 = new FormData()
  formData2.append("reqtype", "fileupload")
  formData2.append("fileToUpload", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const res2 = await fetch("https://catbox.moe/user/api.php", { method: "POST", body: formData2 })
  const txt = await res2.text()
  if (txt.startsWith('https://')) return txt.trim()

  throw new Error('No se pudo subir imagen')
}

let handler = async (m, { conn, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐇𝐃 ﹒ STELLAR ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let link = text?.trim()

  if (!/image/.test(mime) &&!link?.startsWith('http')) {
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
🎀 ➛ Responde a una imagen
💅 ➛ Ejemplo: *.hd*
${footer}`
    }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    if (!link?.startsWith('http')) {
      let media = await q.download()
      link = await uploadFile(media)
    }

    await conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`CARGANDO\`\` ⏳ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ Mejorando con Stellar x4
${footer}`
    }, { quoted: m })

    // ===== SOLO STELLAR =====
    const apiUrl = `https://api.stellarwa.xyz/tools/upscale?method=local&url=${encodeURIComponent(link)}&scale=4&key=proyectsV2`

    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 90000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    // Si devuelve JSON con url
    let buffer = null
    const contentType = response.headers['content-type'] || ''

    if (contentType.includes('application/json')) {
      let json = JSON.parse(Buffer.from(response.data).toString())
      let imgUrl = json.result?.url || json.result || json.url || json.data?.url
      if (typeof imgUrl === 'object') imgUrl = imgUrl.url
      if (!imgUrl?.startsWith('http')) throw new Error('Stellar no devolvió URL: ' + JSON.stringify(json).slice(0,200))

      const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 90000 })
      buffer = Buffer.from(imgRes.data)
    } else {
      // Devuelve imagen directa
      buffer = Buffer.from(response.data)
    }

    if (!buffer || buffer.length < 1000) throw new Error('Imagen vacía de Stellar')

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`HD EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ API: Stellar Upscale x4
💾 ➛ Peso: ${(buffer.length/1024/1024).toFixed(2)} MB
🎀 ➛ Estado: Coquette HD
${footer}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ ${e.message}
${footer}`
    }, { quoted: m })
  }
}

handler.command = ['hd']
handler.tags = ['tools']
handler.help = ['hd']
export default handler