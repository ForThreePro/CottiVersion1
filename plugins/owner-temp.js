import fs from 'fs'
import moment from 'moment-timezone'
moment.locale('es')

const filePath = './temp_groups.json'
const OWNER_NUMBERS = ['51927174369', '56931300864']
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]')
global.tempGroups = JSON.parse(fs.readFileSync(filePath))
const save = () => fs.writeFileSync(filePath, JSON.stringify(global.tempGroups, null, 2))
const isOwner = (m) => OWNER_NUMBERS.includes(m.sender.replace('@s.whatsapp.net',''))
const react = async (conn,m,t) => { try{ await conn.sendMessage(m.chat,{react:{text:t,key:m.key}}) }catch{} }
const msToTime = (ms) => {
  let d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000)
  return `${d?d+'d ':''}${h?h+'h ':''}${m?m+'m':''}`.trim()||'0m'
}

setInterval(async () => {
  if (!global.conn) return
  const now = Date.now()
  let toRemove = []
  for (let i of global.tempGroups) {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐓𝐄𝐌𝐏 ﹒ 𝐀𝐕𝐈𝐒𝐎 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
    const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`
    if (i.exitTime - now <= 300000 && i.exitTime - now > 0 &&!i.warned) {
      try {
        await global.conn.sendMessage(i.id, {
          text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⏰ —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⏰ ➛ Cotti se irá en 5 minutos reina
💅 ➛ Última oportunidad pa' despedirse
${footer}`
        })
        i.warned = true; save()
      } catch {}
    }
    if (now >= i.exitTime) {
      try {
        await global.conn.sendMessage(i.id, {
          text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ADIOS\`\` 👋 —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
👋 ➛ Tiempo coquette terminado
🎀 ➛ Cotti desaparece... bye bye
${footer}`
        })
        await new Promise(r=>setTimeout(r,1200))
        await global.conn.groupLeave(i.id)
      } catch {}
      toRemove.push(i.id)
    }
  }
  if (toRemove.length) { global.tempGroups = global.tempGroups.filter(v=>!toRemove.includes(v.id)); save() }
}, 30000)

let handler = async (m, { conn, args, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐓𝐄𝐌𝐏 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━\n🎀 *COTTI BOT - HALLOWEEN* 🎃`

  if (!isOwner(m)) {
    await react(conn,m,"💔")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 🔒 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Solo dueñas coquette
👑 ➛ @51927174369 / @56931300864
${footer}`,
      mentions: ['51927174369@s.whatsapp.net','56931300864@s.whatsapp.net']
    }, { quoted: m })
  }
  if (command === 'templist') {
    if (!global.tempGroups.length) {
      await react(conn,m,"⚠️")
      return conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`LISTA\`\` 📋 —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⚠️ ➛ Sin grupos temporizados reina
${footer}`
      }, { quoted: m })
    }
    let list = global.tempGroups.map((v,i)=>`🎀 ${i+1}. *${v.name}* - ${msToTime(v.exitTime-Date.now())}`).join('\n')
    await react(conn,m,"📋")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`LISTA\`\` 📋 —˙𖦹.꒷

── *📊 GRUPOS* ╏ 🎀
${list}

✨ ➛ Cotti tiene el control
${footer}`
    }, { quoted: m })
  }
  if (command === 'tempcancel') {
    let idx = global.tempGroups.findIndex(v=>v.id===m.chat)
    if (idx===-1) {
      await react(conn,m,"⚠️")
      return conn.sendMessage(m.chat, {
        text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`AVISO\`\` ⚠️ —˙𖦹.꒷

── *📝 INFO* ╏ 🎀
⚠️ ➛ Sin temporizador coquette en este grupo
${footer}`
      }, { quoted: m })
    }
    global.tempGroups.splice(idx,1); save()
    await react(conn,m,"✨")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` ✨ —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎀 ➛ Hechizo coquette cancelado
💖 ➛ Cotti se queda
${footer}`
    }, { quoted: m })
  }
  // temporizador / temp
  if (!m.isGroup) {
    await react(conn,m,"💔")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Solo en grupos coquette
${footer}`
    }, { quoted: m })
  }
  if (!args[0]) {
    await react(conn,m,"💅")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`FORMATO\`\` ⏰ —˙𖦹.꒷

── *📖 USO* ╏ 🎀
⏰ ➛ Usa: *.temp 1h* / *.temp 30m* / *.temp 1d*
✨ ➛ Ejemplo: *.temp 2h30m*
${footer}`
    }, { quoted: m })
  }
  let ms=0, rx=/(\d+)([dhm])/g, mt
  while((mt=rx.exec(args[0].toLowerCase()))!==null){ let v=parseInt(mt[1]); if(mt[2]==='d')ms+=v*86400000; if(mt[2]==='h')ms+=v*3600000; if(mt[2]==='m')ms+=v*60000 }
  if (ms<60000) {
    await react(conn,m,"💔")
    return conn.sendMessage(m.chat, {
      text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💔 —˙𖦹.꒷

── *📝 AVISO* ╏ 🎀
❌ ➛ Mínimo 1m reina
${footer}`
    }, { quoted: m })
  }

  let idx = global.tempGroups.findIndex(v=>v.id===m.chat)
  if(idx!==-1) global.tempGroups.splice(idx,1)
  global.tempGroups.push({ id:m.chat, name: await conn.getName(m.chat), exitTime: Date.now()+ms, warned:false })
  save()
  await react(conn,m,"🎀")
  return conn.sendMessage(m.chat, {
    text: `${head}
.⃟𖥔 ݁. 𖦹˙— \`\`EXITO\`\` 🎀 —˙𖦹.꒷

── *📊 INFO* ╏ 🎀
🎀 ➛ Temporizador coquette activado
⏰ ➛ Duración: *${msToTime(ms)}*
💅 ➛ Cotti lo controla
${footer}`
  }, { quoted: m })
}

handler.help = ['temporizador 30d','tempcancel','templist']
handler.tags = ['grupos']
handler.command = ['temporizador','temp','tempcancel','templist']
export default handler