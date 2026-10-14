import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐌𝐀𝐈𝐍 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`
    const clockString = (ms) => {
        let d=Math.floor(ms/86400000), h=Math.floor(ms/3600000)%24, mi=Math.floor(ms/60000)%60, s=Math.floor(ms/1000)%60
        return `${d}d ${h}h ${mi}m ${s}s`
    }

    if (command==='owner'||command==='creator') {
        await react('👑')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`DUEÑA\`\` 👑 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
👑 ➛ Dueña coquette: +51 927 174 369
💖 ➛ wa.me/51927174369
✨ ➛ Cotti la adora
${footer}`,
            mentions:['51927174369@s.whatsapp.net']
        }, { quoted:m })
    }
    if (command==='ping'||command==='p') {
        let start=Date.now(); await react('⚡')
        let speed=Date.now()-start
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`PONG\`\` ⚡ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
⚡ ➛ Velocidad: ${speed}ms
✨ ➛ Cotti super rápida
${footer}`
        }, { quoted:m })
    }
    if (command==='cleartmp') {
        const p='./tmp'; if(fs.existsSync(p)) fs.readdirSync(p).forEach(f=>{ try{fs.unlinkSync(`${p}/${f}`)}catch{} })
        await react('✨')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🗑️ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🗑️ ➛ Cripta coquette limpiada
${footer}`
        }, { quoted:m })
    }
    if (command==='cpu') {
        await react('💻')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`CPU\`\` 💻 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
💻 ➛ CPU coquette: ${os.loadavg()[0].toFixed(2)}%
${footer}`
        }, { quoted:m })
    }
    if (command==='ram') {
        let ram=(process.memoryUsage().heapUsed/1024/1024).toFixed(2)
        await react('💾')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`RAM\`\` 💾 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
💾 ➛ RAM coquette: ${ram} MB
${footer}`
        }, { quoted:m })
    }
    if (command==='uptime') {
        await react('⏱️')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`UPTIME\`\` ⏱️ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
⏱️ ➛ Tiempo coquette: ${clockString(process.uptime()*1000)}
${footer}`
        }, { quoted:m })
    }
    if (command==='info') {
        let ram=(process.memoryUsage().heapUsed/1024/1024).toFixed(2)
        await react('🎀')
        return conn.sendMessage(m.chat, {
            text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`INFO\`\` 🎀 —˙𖦹.꒷

── *📊 CRIPTA* ╏ 🎀
⏱️ ➛ Uptime: ${clockString(process.uptime()*1000)}
💾 ➛ RAM: ${ram} MB
💻 ➛ CPU: ${os.loadavg()[0].toFixed(2)}%
✨ ➛ Bot: Cotti Bot Halloween
${footer}`
        }, { quoted:m })
    }
    if (['tts','gtts','ttss'].includes(command)) {
        let txt = text || m.quoted?.text || ''
        if(!txt){
            await react('💔')
            return conn.sendMessage(m.chat, {
                text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 🎙️ —˙𖦹.꒷

── *📖 USO* ╏ 🎀
🎙️ ➛ Usa: *${usedPrefix}tts Hola reina*
${footer}`
            }, { quoted:m })
        }
        try{
            await react('🎙️')
            let url = googleTTS.getAudioUrl(txt,{lang:'es',slow:false,host:'https://translate.google.com',timeout:10000})
            let tmp = path.join(tmpdir(), `tts-${Date.now()}.opus`)
            await new Promise((res,rej)=>{ ffmpeg(url).audioCodec('libopus').toFormat('opus').outputOptions(['-ac 1','-b:a 64k']).on('end',res).on('error',rej).save(tmp) })
            let buf = fs.readFileSync(tmp)
            await conn.sendMessage(m.chat,{audio:buf,mimetype:'audio/ogg; codecs=opus',ptt:true},{quoted:m})
            fs.unlinkSync(tmp); await react('✨')
        }catch{
            await react('💔')
            conn.sendMessage(m.chat, {
                text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Error TTS coquette
${footer}`
            }, { quoted:m })
        }
    }
}

handler.help = ['owner','ping','cleartmp','cpu','ram','uptime','info','tts <texto>']
handler.tags = ['main']
handler.command = /^(owner|creator|ping|p|cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
export default handler