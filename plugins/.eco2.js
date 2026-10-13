let cooldowns = { trivia: {}, work: {}, robar: {} }

let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // TRIVIA - COOLDOWN 30 SEG
  if (command === 'trivia') {
    if (cooldowns.trivia[m.sender] && Date.now() - cooldowns.trivia[m.sender] < 30000)
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Espera ${Math.ceil((30000 - (Date.now() - cooldowns.trivia[m.sender])) / 1000)}s, reina ✨`)
    const preguntas = [
      { q: '¿Cuántos días tiene una semana?', a: '7' },
      { q: '¿De qué color es el cielo despejado?', a: 'azul' },
      { q: '¿Cuánto es 5 + 5?', a: '10' },
      { q: '¿Qué animal dice miau?', a: 'gato' },
      { q: '¿Cuántas patas tiene un perro?', a: '4' },
      { q: '¿Cuánto es 3 x 3?', a: '9' },
      { q: '¿Qué sale de día y da luz?', a: 'sol' },
      { q: '¿Cuál es la primera letra?', a: 'a' }
    ]
    let trivia = preguntas[Math.floor(Math.random() * preguntas.length)]
    cooldowns.trivia[m.sender] = Date.now()
    await conn.reply(m.chat, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n⤷ ┇ 𝐓𝐑𝐈𝐕𝐈𝐀 ﹒ 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 ：✿ 。\n\n🎮 *TRIVIA HALLOWEEN* 🎀\n\n${trivia.q}\n\n⏳ Tienes 15 segundos 💅`, m)
    global.db.data.trivia = global.db.data.trivia || {}
    global.db.data.trivia[m.sender] = { answer: trivia.a.toLowerCase(), chat: m.chat, timeout: setTimeout(() => delete global.db.data.trivia[m.sender], 15000) }
    return
  }

  // RULETA
  if (['ruleta', 'rlt'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Uso: ${usedPrefix + command} <red/black> <monto> 🎀`)
    let color = args[0].toLowerCase()
    let monto = parseInt(args[1])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 Deuda de ${user.deuda} 🪙\n💅 No puedes apostar con deudas, reina\n\nUsa ${usedPrefix}pagardeuda <monto> o ${usedPrefix}work`)
    if (!['red', 'black', 'rojo', 'negro'].includes(color)) return m.reply('‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Usa: red/rojo o black/negro 🎀')
    if (isNaN(monto) || monto < 10) return m.reply('‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 Apuesta mínima: 10 monedas 🎀')
    if (user.coin < monto) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 No tienes suficiente. Saldo: ${user.coin} 🪙`)
    user.coin -= monto
    let resultado = Math.random() < 0.5? 'red' : 'black'
    let colorElegido = color === 'rojo'? 'red' : color === 'negro'? 'black' : color
    await m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎰 *RULETA HALLOWEEN* 🎀\n💅 Apostaste: ${monto} 🪙 a ${colorElegido === 'red'? '🔴 Rojo' : '⚫ Negro'}\n\n✨ Girando...`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (resultado === colorElegido) {
      let ganancia = monto * 2
      user.coin += ganancia
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎰 *¡GANASTE, REINA!* 🎀\n✨ Salió: ${resultado === 'red'? '🔴' : '⚫'}\n💖 Ganaste: ${ganancia} 🪙\n\nSaldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎰 *PERDISTE* 🎀\n💔 Salió: ${resultado === 'red'? '🔴' : '⚫'}\n💸 Perdiste: ${monto} 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // SLOTS
  if (['slots', 'slot'].includes(command)) {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 Deuda de ${user.deuda} 🪙\nUsa ${usedPrefix}pagardeuda o ${usedPrefix}work`)
    if (isNaN(monto) || monto < 10) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 Apuesta mínima: 10\n💅 Uso: ${usedPrefix + command} <monto>`)
    if (user.coin < monto) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 Saldo: ${user.coin} 🪙\n✨ No alcanza, reina`)
    user.coin -= monto
    const emojis = ['🍒', '🍋', '🍊', '🎀', '🎃', '💎', '👑', '⭐']
    let a = emojis[Math.floor(Math.random() * emojis.length)]
    let b = emojis[Math.floor(Math.random() * emojis.length)]
    let c = emojis[Math.floor(Math.random() * emojis.length)]
    let multiplicador = 0
    if (a === b && b === c) {
      if (a === '👑') multiplicador = 100
      else if (a === '💎') multiplicador = 75
      else if (a === '⭐') multiplicador = 50
      else if (a === '🎃') multiplicador = 25
      else if (a === '🎀') multiplicador = 15
      else if (a === '🍊') multiplicador = 10
      else if (a === '🍋') multiplicador = 5
      else multiplicador = 2
    } else if (a === b || b === c || a === c) multiplicador = 2
    if (multiplicador > 0) {
      let ganancia = monto * multiplicador
      user.coin += ganancia
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎰 *SLOTS HALLOWEEN* 🎀\n\n${a} | ${b} | ${c}\n\n🎉 *x${multiplicador}* - ¡JACKPOT! ✨\nGanaste: ${ganancia} 🪙\n\nSaldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎰 *SLOTS* 🎀\n\n${a} | ${b} | ${c}\n\n💔 *PERDISTE* 💅\nPerdiste: ${monto} 🪙\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // WORK - SI TIENES DEUDA, TODO SE VA A PAGARLA
  if (['work', 'trabajar'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000
    if (cooldowns.work[m.sender] && Date.now() - cooldowns.work[m.sender] < tiempoEspera)
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Ya trabajaste, descansa ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.work[m.sender])) / 60000)} min, reina 🎀`)

    cooldowns.work[m.sender] = Date.now()
    const trabajos = [
      { texto: '🎀 Vendiste moños coquette y ganaste', min: 80, max: 200 },
      { texto: '💅 Hiciste uñas aesthetic y ganaste', min: 50, max: 120 },
      { texto: '✨ Modelaste para Halloween y ganaste', min: 30, max: 150 },
      { texto: '🎃 Vendiste dulces de Halloween y ganaste', min: 40, max: 100 },
      { texto: '👑 Fuiste reina de la fiesta y ganaste', min: 60, max: 180 }
    ]
    let trabajo = trabajos[Math.floor(Math.random() * trabajos.length)]
    let ganancia = Math.floor(Math.random() * (trabajo.max - trabajo.min + 1)) + trabajo.min

    if (user.deuda > 0) {
      let pagoDeuda = Math.min(ganancia, user.deuda)
      user.deuda -= pagoDeuda
      let sobrante = ganancia - pagoDeuda
      if (sobrante > 0) {
        user.coin = (Number(user.coin) || 0) + sobrante
        return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💼 *TRABAJO HALLOWEEN* 🎀\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n\n💸 Pagaste ${pagoDeuda} a tu deuda\n💖 Te quedaron ${sobrante} monedas\n\n🚔 *DEUDA RESTANTE*: ${user.deuda} monedas\n\nSaldo: ${user.coin} 🪙`)
      } else {
        return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💼 *TRABAJO HALLOWEEN* 🎀\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n\n💸 *TODO SE FUE A PAGAR TU DEUDA*\n\n🚔 *DEUDA RESTANTE*: ${user.deuda} monedas\n\nSaldo: ${user.coin} 🪙`)
      }
    } else {
      user.coin = (Number(user.coin) || 0) + ganancia
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💼 *TRABAJO* 🎀\n\n${trabajo.texto} *${ganancia} monedas* 🪙\n✨ Excelente, reina\n\nSaldo: ${user.coin} 🪙`)
    }
  }

  // ROBAR - NO PUEDES CON DEUDA
  if (['robar', 'rob'].includes(command)) {
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 Deuda de ${user.deuda} 🪙\n💅 No puedes robar con deudas, reina\n\nUsa ${usedPrefix}pagardeuda o ${usedPrefix}work`)

    let tiempoEspera = Math.floor(Math.random() * 240000) + 60000
    if (cooldowns.robar[m.sender] && Date.now() - cooldowns.robar[m.sender] < tiempoEspera)
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Espera ${Math.ceil((tiempoEspera - (Date.now() - cooldowns.robar[m.sender])) / 60000)} min para robar, reina 🎀`)

    let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false
    if (!who) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 Menciona a quien quieres robarle, reina 🎀`)
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💅 No te robes a ti misma, reina')

    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    let target = global.db.data.users[who]
    target.coin = Number(target.coin) || 0
    if (target.coin < 1) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 @${who.split('@')[0]} no tiene nada, reina`, null, { mentions: [who] })

    cooldowns.robar[m.sender] = Date.now()
    let exito = Math.random() < 0.6

    if (exito) {
      let robado = target.coin <= 5? target.coin : Math.min(Math.floor(Math.random() * target.coin * 0.5) + 1, target.coin)
      target.coin -= robado
      user.coin = (Number(user.coin) || 0) + robado
      try {
        await conn.reply(who, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚨 *¡TE ROBARON!* 🚨 🎀\n💅 @${m.sender.split('@')[0]} te robó *${robado} monedas* 🪙\n\nTu saldo: ${target.coin} 🪙`, null, { mentions: [m.sender] })
      } catch {}
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🦹 *¡ROBO EXITOSO!* 🎀\n✨ Le robaste *${robado} monedas* a @${who.split('@')[0]}\n\nTu saldo: ${user.coin} 🪙`, null, { mentions: [who, m.sender] })
    } else {
      let multa = Math.floor(Math.random() * 50) + 20
      user.coin = Number(user.coin) || 0
      if (user.coin < multa) {
        let deudaNueva = multa - user.coin
        user.deuda = (Number(user.deuda) || 0) + deudaNueva
        user.coin = 0
        try {
          await conn.reply(who, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 *INTENTO DE ROBO* 🎀\n💅 @${m.sender.split('@')[0]} intentó robarte pero la atraparon y ahora debe ${deudaNueva} monedas`, null, { mentions: [m.sender] })
        } catch {}
        return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 *¡TE ATRAPARON!* 🎀\n💸 Multa: ${multa} monedas\n💀 *DEUDA*: ${user.deuda} monedas\n\nUsa ${usedPrefix}pagardeuda o ${usedPrefix}work\n\nSaldo: 0 🪙`)
      } else {
        user.coin -= multa
        try {
          await conn.reply(who, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 *INTENTO DE ROBO* 🎀\n💅 @${m.sender.split('@')[0]} intentó robarte pero falló y pagó ${multa} monedas`, null, { mentions: [m.sender] })
        } catch {}
        return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🚔 *¡TE ATRAPARON!* 🎀\n💔 Multa: *${multa} monedas* ✨\n\nTu saldo: ${user.coin} 🪙`)
      }
    }
  }

  // PAGAR DEUDA
  if (['pagardeuda', 'deuda'].includes(command)) {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda === 0) return m.reply('‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n✅ No tienes deudas, reina ✨💖')

    let monto = parseInt(text)
    if (isNaN(monto) || monto < 1) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 *DEUDA*: ${user.deuda} monedas\n💅 Uso: ${usedPrefix}pagardeuda <monto>\n✨ O usa ${usedPrefix}work, reina`)
    if (user.coin < monto) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 Saldo: ${user.coin} 🪙\n🚔 Deuda: ${user.deuda} 🪙\n\n✨ Usa ${usedPrefix}work para ganar`)

    let aPagar = Math.min(monto, user.deuda)
    user.coin -= aPagar
    user.deuda -= aPagar

    if (user.deuda === 0) {
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n✅ *¡DEUDA PAGADA!* ✅ 🎀\n💖 Pagaste ${aPagar} monedas\n✨ Libre de deudas, reina\n\nTu saldo: ${user.coin} 🪙`)
    } else {
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 Pagaste ${aPagar} monedas\n\n🚔 *RESTANTE*: ${user.deuda} monedas\n\nSaldo: ${user.coin} 🪙`)
    }
  }
}

handler.before = async (m, { conn }) => {
  if (!global.db.data.trivia ||!global.db.data.trivia[m.sender]) return
  let triviaData = global.db.data.trivia[m.sender]
  if (m.chat!== triviaData.chat) return
  if (m.text.toLowerCase().trim() === triviaData.answer) {
    clearTimeout(triviaData.timeout)
    let ganancia = Math.floor(Math.random() * 50) + 20
    if (!global.db.data.users[m.sender].deuda || global.db.data.users[m.sender].deuda === 0) {
      global.db.data.users[m.sender].coin = (Number(global.db.data.users[m.sender].coin) || 0) + ganancia
      await conn.reply(m.chat, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n✅ ¡Correcto, reina! Te premia con *${ganancia} monedas* 🪙✨\n\nSaldo: ${global.db.data.users[m.sender].coin} 🪙`, m)
    } else {
      await conn.reply(m.chat, `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n✨ ¡Correcto! Pero debes ${global.db.data.users[m.sender].deuda} 🪙\n💅 Usa.work para pagar, reina`, m)
    }
    delete global.db.data.trivia[m.sender]
  }
}

handler.help = ['trivia', 'ruleta', 'slots', 'work', 'robar', 'pagardeuda']
handler.tags = ['economy']
handler.command = ['trivia', 'ruleta', 'rlt', 'slots', 'slot', 'work', 'trabajar', 'robar', 'rob', 'pagardeuda', 'deuda']
handler.group = true
export default handler