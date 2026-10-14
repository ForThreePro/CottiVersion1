import axios from 'axios'

let handler = async (m, { conn, text }) => {
  let txt = text || m.quoted?.text || m.quoted?.caption || ''
  if (!txt) {
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Usa: *.brat Tu texto*\n✨ Ejemplo: *.brat coquette*` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const apiUrl = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(txt.slice(0,100))}`

    const res = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 60000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    let buffer = Buffer.from(res.data)

    // Si FAA devuelve JSON con url
    if (res.headers['content-type']?.includes('application/json')) {
      const j = JSON.parse(buffer.toString())
      let url = j.result || j.url || j.data
      if (typeof url === 'object') url = url.url
      const img = await axios.get(String(url), { responseType: 'arraybuffer' })
      buffer = Buffer.from(img.data)
    }

    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '✨', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    await conn.sendMessage(m.chat, { text: `💔 Error: ${e.message}` }, { quoted: m })
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = ['brat']
export default handler