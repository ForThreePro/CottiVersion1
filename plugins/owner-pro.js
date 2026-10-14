import { exec } from "child_process"
import moment from 'moment-timezone'
moment.locale('es')

const OWNER_NUMBERS = [
    "51927174369@s.whatsapp.net",
    "56931300864@s.whatsapp.net"
]

let handler = async (m, { conn, command }) => {
    if (!OWNER_NUMBERS.includes(m.sender)) return

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐎𝐖𝐍𝐄𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n.⃟𖥔 ݁. 𖦹˙— \`\`OWNER\`\` 👑 —˙𖦹.꒷\n\n${txt}` + footer }, { quoted: m })

    if (command === 'reset') {
        await react('🔄')
        await reply(`── *📊 INFO* ╏ 🎀\n🔄 ➛ Reiniciando la cripta coquette... 🎀\n✨ ➛ Vuelvo en segunditos reina`)
        try { process.send('reset') } catch { process.exit(0) }
    }

    if (command === 'autoadmin') {
        try {
            await react('👑')
            // promueve a las 2 dueñas si están en el grupo
            let groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
            let toPromote = []
            if (groupMetadata) {
                let participantIds = groupMetadata.participants.map(p => p.id)
                for (let num of OWNER_NUMBERS) {
                    if (participantIds.includes(num)) toPromote.push(num)
                }
            }
            if (toPromote.length === 0) toPromote = [m.sender] // al menos a quien ejecutó
            
            await conn.groupParticipantsUpdate(m.chat, toPromote, 'promote')
            await react('✨')
            await conn.sendMessage(m.chat, {
                text: head + `\n.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 👑 —˙𖦹.꒷\n\n── *📊 INFO* ╏ 🎀\n👑 ➛ Admins coquette asignadas:\n${toPromote.map(jid => `💖 ➛ @${jid.split('@')[0]}`).join('\n')}` + footer,
                mentions: toPromote
            }, { quoted: m })
        } catch {
            await react('💔')
            await reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ No se pudo dar admin reina\n🔒 ➛ Hazme admin primero 💅`)
        }
    }

    if (['update','actualizar','fix'].includes(command)) {
        await react('🌀')
        await reply(`── *📊 INFO* ╏ 🎀\n🌀 ➛ Invocando actualización coquette... 💖\n✨ ➛ Esperame tantito`)
        exec('git pull', async (err, stdout, stderr) => {
            if (err) { await react('💔'); return reply(`── *📝 AVISO* ╏ 🎀\n❌ ➛ Error en el hechizo coquette\n💔 ➛ ${err.message}`) }
            await react('✨')
            let out = (stdout || '').trim()
            if (out.includes('Already up to date')) {
                return reply(`── *📊 INFO* ╏ 🎀\n🎀 ➛ Ya está coquette al máximo reina\n✨ ➛ Todo actualizado`)
            }
            return reply(`── *📊 INFO* ╏ 🎀\n🎀 ➛ Actualizado reina:\n\`\`\`${out.slice(0, 800)}\`\`\`\n✨ ➛ Cotti brilla más`)
        })
    }
}

handler.help = ['reset','autoadmin','update']
handler.tags = ['owner']
handler.command = ['reset','autoadmin','update','actualizar','fix']
export default handler