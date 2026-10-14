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

  // evogb es el que Stellar acepta mejor
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const res = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  const j = await res.json()
  console.log('Evogb response:', j)
  return j.url || j.data?.url || j.result?.url
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
    return conn.sendMessage(m.chat, { text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
🎀 ➛ Responde a una imagen
${footer}` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    if (!link?.startsWith('http')) {
      let media = await q.download()
      link = await uploadFile(media)
    }

    if (!link) throw new Error('No se pudo subir imagen a Evogb')

    console.log('URL para Stellar:', link)

    // FIX: Stellar con 400 - usa sin encode doble y method correcto
    // Prueba 1: method=url que es el que funciona con links externos
    let apiUrl = `https://api.stellarwa.xyz/tools/upscale?url=${encodeURIComponent(link)}&scale=4&method=local&key=proyectsV2`

    let response
    try {
      response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        timeout: 90000,
        validateStatus: () => true // para ver el error real
      })

      // Si da 400, prueba sin method=local
      if (response.status === 400) {
        console.log('400 con method=local, probando sin method:', Buffer.from(response.data).toString().slice(0,500))
        apiUrl = `https://api.stellarwa.xyz/tools/upscale?url=${encodeURIComponent(link)}&scale=4&key=proyectsV2`
        response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 90000, validateStatus: () => true })
      }

      if (response.status === 400 || response.status === 500) {
        let errText = Buffer.from(response.data).toString().slice(0,800)
        console.log('Stellar error body:', errText)
        throw new Error(`Stellar ${response.status}: ${errText}`)
      }

    } catch (axiosErr) {
      if (axiosErr.message.includes('Stellar')) throw axiosErr
      throw axiosErr
    }

    let buffer = Buffer.from(response.data)
    let ctype = response.headers['content-type'] || ''

    // Si devuelve JSON, extrae la URL
    if (ctype.includes('application/json') || buffer.toString().slice(0,20).includes('{')) {
      try {
        let json = JSON.parse(buffer.toString())
        console.log('Stellar JSON:', json)
        let imgUrl = json.result || json.url || json.data?.url || json.data
        if (typeof imgUrl === 'object') imgUrl = imgUrl.url
        if (!imgUrl?.startsWith('http')) throw new Error('JSON sin url: ' + JSON.stringify(json).slice(0,300))
        const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 90000 })
        buffer = Buffer.from(imgRes.data)
      } catch (e) {
        if (e.message.includes('JSON sin url')) throw e
        // si no es JSON, sigue como imagen
      }
    }

    if (buffer.length < 1000) throw new Error('Imagen vacía')

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`HD EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ API: Stellar Upscale x4
💾 ➛ Peso: ${(buffer.length/1024/1024).toFixed(2)} MB
${footer}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  } catch (e) {
    console.error('HD FINAL ERROR:', e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ ${e.message.slice(0,400)}
${footer}`
    }, { quoted: m })
  }
}

handler.command = ['hd']
handler.tags = ['tools']
handler.help = ['hd']
export default handler