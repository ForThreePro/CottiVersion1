import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { createCanvas } from 'canvas'
import ffmpeg from 'fluent-ffmpeg'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐒𝐓𝐈𝐂𝐊𝐄𝐑 ﹒ BRAT2 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  let txt = text || m.quoted?.text || m.quoted?.caption || ''
  if (!txt) {
    await react('💅')
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 💅 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
💅 ➛ Usa: *${usedPrefix}${command} Tu texto*
✨ ➛ Ejemplo: *${usedPrefix}brat2 coquette halloween*
${footer}`
    }, { quoted: m })
  }

  // ===== FUENTE =====
  // 1 = Brat Classic Blur
  // 2 = Bold Gruesa (Impact)
  // 3 = Cute Redonda
  // 4 = Typewriter
  let estilo = 4

  try {
    await react('⏳')
    txt = txt.toLowerCase().slice(0, 80).trim()

    const size = 1024
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    // fondo coquette halloween
    ctx.fillStyle = '#FFB6D9'
    ctx.fillRect(0, 0, size, size)

    // ruido suave
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    for (let i = 0; i < 6000; i++) {
      ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2)
    }

    let fontFamily = ''
    let blur = 6
    let fontSizeBase = 130
    let stretch = 1.15

    if (estilo === 1) {
      fontFamily = 'Arial Narrow, Arial, sans-serif'
      blur = 7
      fontSizeBase = 120
      stretch = 1.15
    } else if (estilo === 2) {
      fontFamily = 'Impact, Anton, Arial Black, sans-serif'
      blur = 4
      fontSizeBase = 145
      stretch = 1.05
    } else if (estilo === 3) {
      fontFamily = 'Verdana, "Comic Sans MS", sans-serif'
      blur = 2
      fontSizeBase = 115
      stretch = 1
    } else if (estilo === 4) {
      fontFamily = '"Courier New", monospace'
      blur = 1.5
      fontSizeBase = 105
      stretch = 1
    }

    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // wrap automático
    ctx.font = `bold ${fontSizeBase}px ${fontFamily}`
    let words = txt.split(' ')
    let lines = [], line = ''
    for (let w of words) {
      let test = line ? line + ' ' + w : w
      if (ctx.measureText(test).width * stretch > size - 120) {
        if (line) lines.push(line.trim())
        line = w
      } else {
        line = test
      }
    }
    if (line) lines.push(line.trim())
    if (lines.length > 4) lines = lines.slice(0,4)

    let fontSize = lines.length === 1 ? fontSizeBase : lines.length === 2 ? fontSizeBase - 15 : fontSizeBase - 30
    ctx.font = `bold ${fontSize}px ${fontFamily}`

    ctx.save()
    ctx.scale(stretch, 1)
    ctx.filter = `blur(${blur}px)`
    let startY = size/2 - ((lines.length-1)*(fontSize+12))/2
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], (size/2)/stretch, startY + i*(fontSize+18))
    }
    ctx.restore()

    let tmpPng = path.join(tmpdir(), `brat-${Date.now()}.png`)
    let tmpWebp = path.join(tmpdir(), `brat-${Date.now()}.webp`)
    fs.writeFileSync(tmpPng, canvas.toBuffer('image/png'))

    await new Promise((res, rej) => {
      ffmpeg(tmpPng)
        .inputOptions(['-y'])
        .size('512x512')
        .aspect('1:1')
        .autopad(true, '#FFB6D9')
        .outputOptions(['-vcodec','libwebp','-lossless','0','-q:v','90','-preset','picture','-an','-loop','0'])
        .toFormat('webp')
        .on('end', res)
        .on('error', rej)
        .save(tmpWebp)
    })

    await conn.sendMessage(m.chat, { sticker: fs.readFileSync(tmpWebp) }, { quoted: m })
    try { fs.unlinkSync(tmpPng); fs.unlinkSync(tmpWebp) } catch {}
    await react('✨')
  } catch (e) {
    console.error(e)
    await react('💔')
    await conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Error: ${e.message}
${footer}`
    }, { quoted: m })
 
handler.help = ['brat2 <texto>']
handler.tags = ['sticker']
handler.command = ['brat2']
export default handler