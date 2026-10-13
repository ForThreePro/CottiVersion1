let handler = async (m, { conn }) => {
    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let botNumber = conn.user.jid

    let candidates = participants.filter(p => !p.admin && p.id !== botNumber)
    if (!candidates.length) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n👻 ➛ No hay víctimas, todas son admin, reinas se salvaron del exorcismo ✨`)

    let victim = candidates[Math.floor(Math.random() * candidates.length)]

    await conn.sendMessage(m.chat, { 
        text: 
`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀
⤷ ┇ 𝐑𝐔𝐋𝐄𝐓𝐀 𝐁𝐀𝐍 ﹒ 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 ：✿ 。

.⃟𖥔 ݁. 𖦹˙— \`\`GIRANDO\`\` 🎰 —˙𖦹.꒷

── *📊 RULETA* ╏ 💅
🕸️ ➛ Invocando espíritus...
👻 ➛ Participantes: *${candidates.length}*

── *🎀 RESULTADO* ╏ 🕯️
🦇 ➛ La ouija eligió a @${victim.id.split('@')[0]} 💥

💀 *¡EL FANTASMA SE LA LLEVÓ, REINA!* 🎀

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃`,
        mentions: [victim.id]
    })

    await new Promise(r => setTimeout(r, 1500))

    try {
        await conn.groupParticipantsUpdate(m.chat, [victim.id], 'remove')
        await conn.sendMessage(m.chat, { text: `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💀 ➛ @${victim.id.split('@')[0]} fue exorcizada del grupo, reina\n🕯️ ➛ Trick or... ¡BAN! 🎀`, mentions: [victim.id] })
        await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    } catch (e) {
        m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n😿 ➛ No pude exorcizar a @${victim.id.split('@')[0]} - tiene protección fantasmal 💅`, null, { mentions: [victim.id] })
    }
}

handler.help = ['ruletaban']
handler.tags = ['group', 'halloween']
handler.command = /^(ruletaban|ruletab|ruletaban-halloween)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler