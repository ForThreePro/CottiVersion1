let handler = async (m, { conn, command, text, participants }) => {

    let who = m.mentionedJid[0] || m.quoted?.sender || (conn.parseMention(text)[0]) || (text.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    if (who === '@s.whatsapp.net' ||!who) who = null

    let necesitaPersona = ['pelea','cachetear','curar','robar','mata','insultar'].includes(command)
    if (necesitaPersona &&!who) return m.reply(`💔 *Error 404 coquette* 💔\nTienes que:\n1. *Tocar @* 🎀\n2. *Responder* +.comando ✨\n3..comando 519123456 💅`)

    let user = `@${m.sender.split('@')[0]}`
    let target = who? `@${who.split('@')[0]}` : user

    const juegos = {
        pelea: [
            `🎀 *${user} reta a duelo a ${target}* 🎀\nResultado: ${target} perdió 100 de brillo 💔`,
            `👑 *${user} vs ${target}*\nGanadora: ${user} por slay ✨`,
            `💅 ${user} le mete una paliza coquette a ${target}\n${target} quedó sin gloss`,
            `💖 ${user} hace fatality rosa a ${target}\nFINISH HER!`,
            `🏆 ${user} gana la pelea contra ${target}\nFlawless slay`,
            `💢 ${user} destroza a ${target} en 3 segundos 💅`,
            `✨ ${user} usa ultimate coquette y borra a ${target} del mapa`
        ],
        cachetear: [
            `💅 *${user} ZAS! cachetea a ${target}* 💖\n${target} quedó sin brillo`,
            `💔 ${user} le mete tremenda cachetada a ${target} por no ser coquette`,
            `😡 *SLAP* ${user} → ${target}\nDaño crítico x2 💅`,
            `🤚 ${user} cachetea 5 veces a ${target}\nCombo coquette x5`,
            `🥴 ${target} recibió cachetada de ${user}\nPerdió 50 de slay`,
            `💥 *BOFETADA LEGENDARIA ROSA* ${user} → ${target}`,
            `👏 ${user} aplaudió la cara de ${target} 💅`
        ],
        curar: [
            `💖 *${user} cura a ${target}* 💖\n+100 de brillo recuperado ✨`,
            `✨ ${user} usa gloss mágico en ${target}\n${target} está full slay`,
            `🎀 ${user} maquilla a ${target}\nYa no está opaca reina`,
            `🏥 ${user} llevó a ${target} al spa coquette\nFactura: $0 porque es reina`,
            `🌸 ${user} usa brillo mágico en ${target}\nCuración coquette`,
            `✨ ${user} revivió a ${target} con un labial rosa`,
            `😇 ${user} reza por ${target} y se vuelve coquette`
        ],
        robar: [
            `👜 *${user} le robó el brillo a ${target}* 💅\n${target} se quedó sin gloss`,
            `💖 ${user} asaltó a ${target}\nBotín: 999 labiales rosas`,
            `💅 ${user} le sacó la cartera coquette a ${target}\nCorre reina`,
            `🏃‍♀️ ${user} robó y corrió. ${target} se quedó sin brillo`,
            `🎀 ${user} le vació la bolsa de maquillaje a ${target}`,
            `💳 ${user} clonó la tarjeta rosa de ${target}`,
            `🕵️‍♀️ ${user} en modo coquette ladrona: ${target} no se dio ni cuenta`
        ],
        mata: [
            `💔 *${user} ELIMINÓ a ${target}* 💅\nF por ${target} sin brillo`,
            `💅 ${user} hizo 1 tiro de gloss a ${target}\nHS - HeadSlay`,
            `💔 ${user} *te bajó* ${target}\nRespawn coquette en 3...2...1`,
            `🎀 *${user} acuchilló con tacón a ${target}*\nMisión coquette cumplida`,
            `💄 ${user} le metió 3 labiales a ${target}\nNo sobrevivió al slay`,
            `💣 ${user} tiró una bomba de brillo y se llevó a ${target}`,
            `👑 ${target} fue eliminada por ${user}\nGG coquette`
        ],
        insultar: [
            `🎀 ${user} a ${target}: Eres más básica que gloss transparente sin brillo`,
            `💔 ${user} a ${target}: Tu slay es negativo, reina`,
            `💅 ${user} a ${target}: Pareces filtro sin coquette`,
            `👑 ${user} a ${target}: Te falta brillo y te sobra drama sin estilo`,
            `📉 ${user} a ${target}: Eres el error 404 del coquette`,
            `🤦‍♀️ ${user} a ${target}: Si lo básico doliera, estarías en spa de urgencia`,
            `💔 ${user} a ${target}: Tienes menos brillo que labial vencido`,
            `💅 ${user} a ${target}: Eres más lenta que secado de uñas sin lámpara`,
            `🎀 ${user} a ${target}: Tienes cara de no usar blush`,
            `💖 ${user} a ${target}: Tu brillo tiene 1% de batería, recarga reina`
        ]
    }

    if (!juegos[command]) return

    let res = juegos[command][Math.floor(Math.random() * juegos[command].length)]
    await conn.reply(m.chat, res, m, { mentions: [who, m.sender] })
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
}

handler.help = [
'pelea @usuario',
'cachetear @usuario',
'curar @usuario',
'robar @usuario',
'mata @usuario',
'insultar @usuario'
]
handler.tags = ['diversión']
handler.command = ['pelea','cachetear','curar','robar','mata','insultar']
handler.group = true

export default handler