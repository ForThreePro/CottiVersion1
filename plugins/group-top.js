import moment from 'moment-timezone'
moment.locale('es')

let user = a => '@' + a.split('@')[0]
const pickRandom = (l) => l[Math.floor(Math.random()*l.length)]
Array.prototype.getRandom = function(){ return this[Math.floor(Math.random()*this.length)] }

let handler = async (m, { groupMetadata, command, conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐓𝐎𝐏 ﹒ 10 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`

    if (!groupMetadata) {
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Solo en grupos coquette

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
    if (!text) {
        await react('💅')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` 👑 —˙𖦹.꒷

── *📖 USO* ╏ 🎀
💅 ➛ Usa: *.top <motivo>*
✨ ➛ Ejemplo: *.top Más lindas*

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    let ps = groupMetadata.participants.map(v=>v.id)
    if (ps.length < 10) {
        await react('⚠️')
        let txt = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⚠️ —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⚠️ ➛ Mínimo 10 reinas

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    let picks = Array.from({length:10},()=>ps.getRandom())
    let x = pickRandom(['🎀','💖','✨','👑','💅','🌸','🎃','🍬','💄','💋'])

    let top = `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`TOP 10\`\` ${x} —˙𖦹.꒷

── *🏆 ${text.toUpperCase()}* ╏ 🎀
${picks.map((p,i)=>`${x} *${i+1}.* ${user(p)}`).join('\n')}

── *📝 NOTA* ╏ ✨
🎲 ➛ Aleatorio de la cripta coquette
💅 ➛ Cotti eligió

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
━━━━━━━━━━━`

    await react(x)
    return conn.sendMessage(m.chat, { text: top, mentions: picks }, { quoted: m })
}

handler.help = ['top <texto>']
handler.tags = ['fun']
handler.command = /^(top)$/i
handler.group = true
export default handler