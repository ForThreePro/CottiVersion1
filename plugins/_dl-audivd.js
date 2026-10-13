import { join } from 'path'
import { promises as fs } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
import moment from 'moment-timezone'
moment.locale('es')

const execFileAsync = promisify(execFile)

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = global.owner?.[0]?.[0] || '51927174369'
    const q = m.quoted? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!/video/.test(mime)) {
        let menuUso = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐇𝐄𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀 ﹒ AUDIVD ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.audivd ˚. ᵎᵎ
> *"Sacando el audio con brillo de reina"*

.⃟𖥔 ݁. 𖦹˙— \`\`HERRAMIENTA HALLOWEEN\`\` ⚙️ —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 💅
🎀 ➛ Extrae el audio de un video
✨ ➛ Convierte a MP3 192kbps
👑 ➛ Reina escuchando

── *📖 USO* ╏ 🎀
1️⃣ ➛ Responde a un video con:.audivd
2️⃣ ➛ O usa el alias:.audio

── *📦 FORMATO* ╏ 🕯️
⬇️ ➛ Salida: *MP3 44.1kHz Stereo*
🎀 ➛ Calidad coquette premium

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
*Owner*: @${ownerNum}
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    let tempVideo
    let tempAudio
    try {
        await react(conn, m, "🎀")
        await m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐏𝐑𝐎𝐂𝐄𝐒𝐀𝐍𝐃𝐎 ﹒ AUDIVD ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` ⚙️ —˙𖦹.꒷

── *📊 ESTADO* ╏ 💅
📥 ➛ Descargando video coquette...
🎵 ➛ Extrayendo alma del audio...
⚙️ ➛ Convirtiendo a MP3 con brillo...
✨ ➛ Reina espera con dulces...

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`)

        const videoBuffer = await q.download()
        if (!videoBuffer) throw new Error('No se pudo obtener el buffer del video.')

        const tempDir = join(process.cwd(), './tmp')
        await fs.stat(tempDir).catch(() => fs.mkdir(tempDir, { recursive: true }))

        tempVideo = join(tempDir, `${Date.now()}.mp4`)
        tempAudio = join(tempDir, `${Date.now()}.mp3`)

        await fs.writeFile(tempVideo, videoBuffer)

        await execFileAsync('ffmpeg', [
            '-y',
            '-i', tempVideo,
            '-vn',
            '-ar', '44100',
            '-ac', '2',
            '-b:a', '192k',
            tempAudio
        ], { timeout: 120000 })

        const audioBuffer = await fs.readFile(tempAudio)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: 'audio_extraido_cotti.mp3',
            ptt: false
        }, { quoted: m })

        await react(conn, m, "🎀")
        let menuOk = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐃𝐎 ﹒ AUDIVD ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🎀 —˙𖦹.꒷

── *📊 RESULTADO* ╏ 💅
✅ ➛ Audio exorcizado correctamente, reina
📌 ➛ Formato: *MP3 192kbps*
📌 ➛ Calidad: *44.1kHz Stereo*

── *📥 DESCARGA* ╏ 👑
⬇️ ➛ Archivo enviado arriba
✨ ➛ Listo para escuchar, reina

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuOk }, { quoted: m })

    } catch (e) {
        console.error(e)
        await react(conn, m, "💔")
        const fecha2 = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let menuErr = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ AUDIVD ：✿ 。
꒰ ◞⁺⊹ ．${fecha2}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 💅
❌ ➛ ${e.message}

── *💡 SOLUCIÓN* ╏ 🕯️
🔧 ➛ Usa un video válido, reina
🔧 ➛ Máx 2 minutos recomendado
🎀 ➛ Intenta con menos peso

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuErr }, { quoted: m })
    } finally {
        await fs.unlink(tempVideo).catch(() => {})
        await fs.unlink(tempAudio).catch(() => {})
    }
}

handler.help = ['audivd']
handler.tags = ['tools']
handler.command = ['audivd', 'audio']
handler.limit = true
export default handler