let handler = async (m, { conn, command }) => {

    let who = m.mentionedJid[0] || m.quoted?.sender || null
    if (!who) return m.reply(`💔 *Error coquette* 💔\nUsa: *.${command} @persona* 🎀\nO responde a un mensaje con *.${command}* ✨`)

    let user = `@${m.sender.split('@')[0]}`
    let target = `@${who.split('@')[0]}`

    let pp
    try {
        pp = await conn.profilePictureUrl(who, 'image')
    } catch {
        pp = 'https://i.imgur.com/2yW7L1m.jpg'
    }

    let caption = ''
    let react = '🎀'

    if (command === 'infiel') {
        const esInfiel = Math.random() < 0.6
        const infiel = [
            `💔 ${user} ATRAPÓ A UNA SIN BRILLO: ${target} sin gloss`,
            `🚨 ${user} pilló a ${target} siendo INFIEL. Tiene 2 gloss 🎀`,
            `😱 ${user}: ${target} es INFIEL. "Es mi prima coquette"`
        ]
        const fiel = [
            `💖 ${user} ESCANEÓ A ${target} Y SALIÓ: 100% FIEL Y COQUETTE`,
            `✨ ${user} verificó a ${target}: Es de las buenas, full brillo`,
            `👑 ${user}: ${target} PASÓ EL DETECTOR. FIEL Y REINA`
        ]
        caption = esInfiel? infiel[Math.floor(Math.random() * infiel.length)] : fiel[Math.floor(Math.random() * fiel.length)]
        react = esInfiel? '💔' : '💖'

    } else if (command === 'cachoso') {
        const nivel = Math.floor(Math.random() * 101)
        caption = `📊🎀 ${user} escaneó a ${target}\n\nNivel de Coqueto: *${nivel}%*\n${nivel > 70? '🚨 PELIGRO: Mucho brillo' : nivel > 40? '💅 Ojito, es coqueto' : '😇 Es sano y coquette'}`
        react = '💅'

    } else if (command === 'ex') {
        const exs = Math.floor(Math.random() * 10) + 1
        caption = `💔 ${user} investigó a ${target}\n\nTiene *${exs} exs* 🎀\n${exs > 5? '👑 Experta en dejar sin brillo' : exs > 2? '💅 Tiene experiencia coquette' : '🎀 Inocente y brillosa'}`
        react = '💔'

    } else if (command === 'segunda') {
        const esSegunda = Math.random() < 0.5
        caption = esSegunda? `💔 ${user} descubrió que ${target} es LA SEGUNDA sin gloss 😱` : `💖 ${user}: ${target} es la PRIMERA y ÚNICA reina 👑`
        react = esSegunda? '💔' : '💖'

    } else if (command === 'toxico') {
        const nivel = Math.floor(Math.random() * 101)
        caption = `💔 ${user} analizó la toxicidad de ${target}\n\nNivel Tóxico: *${nivel}%*\n${nivel > 80? '💔 Revisa su gloss a cada rato' : nivel > 50? '😒 Celoso nivel sin brillo' : '💖 Tranquila y coquette'}`
        react = '💔'

    } else if (command === 'redflag') {
        const flags = ['Tiene "mejor amiga sin brillo"','Oculta el cel con funda fea','Responde cada 5 horas sin emoji','Le da like a todas sin ser coquette','Dice "confía en mí" sin gloss','Tiene 2 Instagram sin fotos coquette']
        const flag = flags[Math.floor(Math.random() * flags.length)]
        caption = `🚩🎀 ${user} encontró RED FLAG en ${target}\n\n> ${flag}\nCorre reina 💅`
        react = '🚩'

    } else if (command === 'amante') {
        const num = Math.floor(Math.random() * 5)
        caption = `👀💅 ${user} stalkeó a ${target}\n\nTiene *${num} crushes* detectados 🎀\n${num > 2? '👑 Reina del brillo' : num > 0? '💅 Algo es algo coquette' : '😇 Santa y brillosa'}`
        react = '💖'

    } else if (command === 'compatibilidad') {
        const compa = Math.floor(Math.random() * 101)
        caption = `💖 ${user} + ${target}\n\nCompatibilidad coquette: *${compa}%* 🎀\n${compa > 80? '💍 Boda coquette a la vista' : compa > 50? '💖 Sí hay futuro brilloso' : '💔 Mejor amigas coquette nomás'}`
        react = '💖'
    }

    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: caption,
        mentions: [who, m.sender]
    })
    await conn.sendMessage(m.chat, { react: { text: react, key: m.key } })
}

handler.help = ['infiel @', 'cachoso @', 'ex @', 'segunda @', 'toxico @', 'redflag @', 'amante @', 'compatibilidad @']
handler.tags = ['fun']
handler.command = ['infiel', 'cachoso', 'ex', 'segunda', 'toxico', 'redflag', 'amante', 'compatibilidad']
handler.group = true

export default handler