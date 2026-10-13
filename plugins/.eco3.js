let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {} }

  const items = {
    'pico': { nombre: 'Pico ⛏️', precio: 500, desc: 'Para minar más monedas con estilo' },
    'escudo': { nombre: 'Escudo Coquette 🛡️', precio: 1000, desc: 'Protege contra robos, reina segura' },
    'vip': { nombre: 'VIP Cotti 👑', precio: 5000, desc: 'Ganancias x2 - Modo reina premium' },
    'cofre': { nombre: 'Cofre Halloween 🎁', precio: 300, desc: 'Premio 100-1000 monedas, sorpresa coquette' },
    'pocion': { nombre: 'Poción Halloween 🍀', precio: 800, desc: '+20% suerte, brillo extra' }
  }

  if (!text || ['shop', 'tienda'].includes(command)) {
    let texto = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀
⤷ ┇ 𝐓𝐈𝐄𝐍𝐃𝐀 ﹒ 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 ：✿ 。
꒰ ◞⁺⊹ ．La tiendita coquette está abierta 💅

── *💰 TU SALDO* ╏ 🎀
🪙 ➛ Saldo: *${user.coin} monedas*
🎀 ➛ Cliente VIP: La reina atiende ✨

── *🛒 PRODUCTOS* ╏ 👑

`
    for (let [id, item] of Object.entries(items)) {
      texto += `🎀 *${item.nombre}*\n   💵 Precio: ${item.precio} 🪙\n   📝 ${item.desc}\n   🛒 Comprar: ${usedPrefix}buy ${id}\n\n`
    }
    texto += `━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
> "Compra con estilo, reina" 💅✨`
    return m.reply(texto)
  }

  if (['buy', 'comprar'].includes(command)) {
    let item = items[text.toLowerCase()]
    if (!item) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💔 Item no encontrado, reina 💅\n🎀 Usa ${usedPrefix}shop para ver la tienda`)
    if (user.coin < item.precio) return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n💸 No tienes suficiente, te faltan ${item.precio - user.coin} 🪙\n💅 Sin money no hay brillo, reina`)

    user.coin -= item.precio
    user.items = user.items || {}
    user.items[text.toLowerCase()] = (user.items[text.toLowerCase()] || 0) + 1

    if (text.toLowerCase() === 'cofre') {
      let premio = Math.floor(Math.random() * 901) + 100
      user.coin += premio
      return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n🎁 ¡Abriste un *Cofre Halloween*! 🎃\n✨ Te premió con *${premio} monedas* 🪙\n> *"Este premio es super cute"* 🎀\n\n💰 Saldo: ${user.coin} 🪙`)
    }
    return m.reply(`‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀\n\n✅ ¡Compra perfecta! 💖\n🎀 Compraste *${item.nombre}* por ${item.precio} 🪙\n✨ Buena elección, reina\n\n💰 Saldo: ${user.coin} 🪙`)
  }
}

handler.help = ['shop', 'buy']
handler.tags = ['economy']
handler.command = ['shop', 'tienda', 'buy', 'comprar']
handler.group = true
handler.register = false
export default handler