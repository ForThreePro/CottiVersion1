import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

async function myCloud(content) {
  const ft = await fileTypeFromBuffer(content)
  const form = new FormData()
  form.append("file", new Blob([content], { type: ft?.mime || 'image/jpeg' }), `${crypto.randomBytes(5).toString("hex")}.${ft?.ext || 'jpg'}`)
  const r = await fetch("https://evogb.win/api/upload", { method: "POST", body: form })
  const j = await r.json()
  const url = j.url || j.data?.url || j.result?.url
  if (!url) throw new Error('Evogb no devolvió url: ' + JSON.stringify(j).slice(0,150))
  return url
}

async function faaBuffer(apiUrl) {
  // Usa axios con arraybuffer primero para detectar si es imagen directa
  const res = await axios.get(apiUrl, {
    responseType: 'arraybuffer',
    timeout: 90000,
    headers: { 'User-Agent': 'Mozilla/5.0' },
    validateStatus: () => true
  })

  const ct = res.headers['content-type'] || ''

  // Si es imagen directa
  if (ct.includes('image') && res.data.length > 1000) {
    return Buffer.from(res.data)
  }

  // Si no, es JSON
  try {
    const text = Buffer.from(res.data).toString()
    // console.log('FAA removebg response:', text.slice(0,500))
    const j = JSON.parse(text)

    let resultData = j.result?.url || j.result?.image || j.result?.data || j.result || j.url || j.data || j.image
    if (typeof resultData === 'object') {
      resultData = resultData.url || resultData.image || resultData.data || resultData.result
    }

    if (!resultData) throw new Error('API vacía: ' + JSON.stringify(j).slice(0,200))

    const str = String(resultData).trim()

    if (str.startsWith('http')) {
      const { data } = await axios.get(str, { responseType: 'arraybuffer', timeout: 90000 })
      return Buffer.from(data)
    } else if (str.startsWith('data:image')) {
      return Buffer.from(str.split(',')[1], 'base64')
    } else if (str.length > 100) {
      // Es base64 puro
      return Buffer.from(str, 'base64')
    } else {
      throw new Error('Formato desconocido: ' + str.slice(0,100))
    }
  } catch (e) {
    if (e.message.includes('API vacía') || e.message.includes('Formato')) throw e
    // Si falla el JSON parse, intenta como imagen igual
    if (res.data.length > 1000) return Buffer.from(res.data)
    throw new Error('Respuesta no JSON ni imagen: ' + Buffer.from(res.data).toString().slice(0,200))
  }
}

let handler = async (m, { conn, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐑𝐄𝐌𝐎𝐕𝐄𝐁𝐆 ﹒ RESULT ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`

  let link = text?.trim()
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (/image/.test(mime) &&!link) {
    try {
      await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
      await conn.sendMessage(m.chat, { text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`CARGANDO\`\` ⏳ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ Subiendo al tocador coquette...
${`\n━━━━━━━━━━━\n🎀 *COTTI BOT* 🎃`}` }, { quoted: m })
      let media = await q.download()
      link = await myCloud(media)
    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
      return conn.sendMessage(m.chat, { text: `${head}
💔 ➛ Error al subir: ${e.message}` }, { quoted: m })
    }
  }

  if (!link) {
    return conn.sendMessage(m.chat, {
      text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀
⤷ ┇ 𝐑𝐄𝐌𝐎𝐕𝐄𝐁𝐆 ﹒ 𝐔𝐒𝐎 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
👑 ➛ Responde a una imagen
🎀 ➛ Ejemplo: *.removebg*

🔗 ➛ O manda link: *.removebg https://...*

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN* 🎃`
    }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })
    await conn.sendMessage(m.chat, { text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`CARGANDO\`\` ⏳ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
✨ ➛ Quitando fondo coquette...
${`\n━━━━━━━━━━━\n🎀 *COTTI BOT* 🎃`}` }, { quoted: m })

    const buffer = await faaBuffer(`https://api-faa.my.id/faa/removebg?url=${encodeURIComponent(link)}`)

    const apiText = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`INFO\`\` 🎀 —˙𖦹.꒷

── *📊 DATOS* ╏ 💅
🎀 ➛ Tipo: Removebg Coquette
✨ ➛ API: FAA-BOT
💖 ➛ Peso: ${(buffer.length / 1024).toFixed(0)} KB
👑 ➛ Estado: Fondo exorcizado

━━━━━━━━━━━
🎀 *Lista para brillar reina* ✨`

    await conn.sendMessage(m.chat, { image: buffer, caption: apiText }, { quoted: m })
    // Documento PNG sin fondo
    await conn.sendMessage(m.chat, { document: buffer, mimetype: 'image/png', fileName: `removebg-cotti-${Date.now()}.png` }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💔 ➛ Error: ${e.message.slice(0,400)} 🎀` }, { quoted: m })
  }
}

handler.command = ['removebg', 'nobg', 'quitarfondo']
handler.tags = ['tools']
handler.help = ['removebg']
handler.group = true
export default handler