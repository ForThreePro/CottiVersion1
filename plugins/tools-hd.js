import fetch from 'node-fetch'
import axios from 'axios'
import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import moment from 'moment-timezone'
moment.locale('es')

async function uploadEvogb(content) {
  const fileType = await fileTypeFromBuffer(content)
  const ext = fileType?.ext || 'bin'
  const mime = fileType?.mime || 'application/octet-stream'
  const formData = new FormData()
  formData.append("file", new Blob([content], { type: mime }), `${crypto.randomBytes(5).toString("hex")}.${ext}`)
  const response = await fetch("https://evogb.win/api/upload", { method: "POST", body: formData })
  const j = await response.json()
  return j.url || j.data?.url
}

let handler = async (m, { conn, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐇𝐃 ﹒ MEJORA ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let link = text?.trim()

  if (!/image/.test(mime) &&!link) {
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
🎀 ➛ Responde a una imagen para mejorar en HD
💅 ➛ Ejemplo: *.hd* (respondiendo a imagen)
${footer}`
    }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    if (!link) {
      let media = await q.download()
      link = await uploadEvogb(media)
    }

    if (!link) throw new Error('No se pudo subir imagen a Evogb')

    await conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`CARGANDO\`\` ⏳ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
⏳ ➛ Mejorando en HD coquette...
✨ ➛ Probando 2 hechizos HD
${footer}`
    }, { quoted: m })

    let buffer = null
    let metodoUsado = ''
    let pesoMB = ''

    // ===== API 1: FAA HDv2 =====
    try {
      const apiUrl1 = `https://api-faa.my.id/faa/hdv2?url=${encodeURIComponent(link)}`
      const j1 = await fetch(apiUrl1).then(r => r.json())
      let resultUrl1 = j1.result?.url || j1.result?.image || j1.result || j1.url || j1.data
      if (typeof resultUrl1 === 'object') resultUrl1 = resultUrl1.url || resultUrl1.image

      if (resultUrl1?.startsWith('http')) {
        const res1 = await axios.get(resultUrl1, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } })
        buffer = Buffer.from(res1.data)
        metodoUsado = 'HDv2 FAA-BOT'
      }
    } catch (e) {
      console.log('API FAA falló, probando Stellar:', e.message)
    }

    // ===== API 2: StellarWA Upscale (fallback) =====
    if (!buffer) {
      try {
        const apiUrl2 = `https://api.stellarwa.xyz/tools/upscale?method=local&url=${encodeURIComponent(link)}&scale=4&key=proyectsV2`
        const res2 = await axios.get(apiUrl2, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } })
        // Si la API devuelve JSON con url, si devuelve imagen directo cae aquí
        if (res2.headers['content-type']?.includes('application/json')) {
          let j2 = JSON.parse(Buffer.from(res2.data).toString())
          let resultUrl2 = j2.result?.url || j2.result || j2.url || j2.data?.url
          if (resultUrl2?.startsWith('http')) {
            const imgRes = await axios.get(resultUrl2, { responseType: 'arraybuffer' })
            buffer = Buffer.from(imgRes.data)
          }
        } else {
          buffer = Buffer.from(res2.data)
        }
        metodoUsado = 'Upscale Stellar x4'
      } catch (e) {
        console.log('API Stellar falló:', e.message)
      }
    }

    if (!buffer) throw new Error('Las 2 APIs coquette fallaron 💔')

    pesoMB = (buffer.length / 1024 / 1024).toFixed(2)

    const captionFinal = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`HD EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ Tipo: ${metodoUsado}
💖 ➛ API: Dual (FAA + Stellar)
💾 ➛ Peso: ${pesoMB} MB
🎀 ➛ Estado: Coquette HD

꒰💅꒱ Imagen mejorada coquette
${footer}`

    await conn.sendMessage(m.chat, { image: buffer, caption: captionFinal }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Error: ${e.message}
${footer}`
    }, { quoted: m })
  }
}

handler.command = ['hd']
handler.tags = ['tools']
handler.help = ['hd']
handler.group = true
export default handler