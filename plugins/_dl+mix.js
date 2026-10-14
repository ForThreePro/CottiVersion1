import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import fetch from 'node-fetch'
import axios from 'axios'

async function myCloud(content) {
  const ft = await fileTypeFromBuffer(content)
  const form = new FormData()
  form.append("file", new Blob([content], { type: ft?.mime || 'image/jpeg' }), `${crypto.randomBytes(5).toString("hex")}.${ft?.ext || 'jpg'}`)
  const r = await fetch("https://evogb.win/api/upload", { method: "POST", body: form })
  const j = await r.json()
  return j.url || j.data?.url
}

let handler = async (m, { conn, text }) => {
  let link = text?.trim()
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (/image/.test(mime) &&!link) {
    try {
      await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
      let media = await q.download()
      link = await myCloud(media)
    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
      return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💔 Error al subir: ${e.message}` }, { quoted: m })
    }
  }

  if (!link) {
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n⤷ 𝐑𝐄𝐌𝐎𝐕𝐄𝐁𝐆 USO\n\n👑 Responde a una imagen\n🎀 Ejemplo:.removebg\n🔗 Ejemplo:.removebg https://link.jpg` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

    // ENDPOINT FINAL - SOLO ESTE
    const apiUrl = `https://api-faa.my.id/faa/removebg?url=${encodeURIComponent(link)}`

    const res = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 60000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      validateStatus: () => true
    })

    const contentType = res.headers['content-type'] || ''
    let buffer = null

    if (contentType.includes('image')) {
      buffer = Buffer.from(res.data)
    } else {
      const text = Buffer.from(res.data).toString()
      const j = JSON.parse(text)

      if (j.status === false) throw new Error(j.error || 'FAA falló')

      let result = j.result?.url || j.result?.image || j.result || j.url || j.data
      if (typeof result === 'object') result = result.url || result.image

      const str = String(result).trim()
      if (str.startsWith('http')) {
        const img = await axios.get(str, { responseType: 'arraybuffer' })
        buffer = Buffer.from(img.data)
      } else if (str.startsWith('data:image')) {
        buffer = Buffer.from(str.split(',')[1], 'base64')
      } else {
        buffer = Buffer.from(str, 'base64')
      }
    }

    if (!buffer) throw new Error('No se obtuvo imagen')

    await conn.sendMessage(m.chat, { image: buffer, caption: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎀 Removebg listo\n💖 Peso: ${(buffer.length/1024).toFixed(0)} KB` }, { quoted: m })
    await conn.sendMessage(m.chat, { document: buffer, mimetype: 'image/png', fileName: `removebg-cotti.png` }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💔 Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['removebg', 'nobg', 'quitarfondo']
handler.tags = ['tools']
handler.help = ['removebg']
handler.group = true
export default handler