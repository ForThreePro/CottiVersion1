import { existsSync, promises as fs } from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

var handler = async (m, { conn }) => {
    if (global.conn.user.jid!== conn.user.jid) {
        return conn.reply(m.chat, '⚠️ *Usa esto en el número principal, preciosa* 💅', m)
    }

    let rutas = [`./Sesiones/Principal/`, `./sesiones/Principal/`, `./sessions/Principal/`]
    let sessionPath = rutas.find(r => existsSync(r))

    if (!sessionPath) return m.reply('🧐 *No encontré la carpeta de sesión, reina*')

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    await m.reply(`‧˚꒰🎀୭ *_𝐂𝐎𝐓𝐓𝐈 𝐁𝐎𝐓 - 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍_*\n\n꒰👻꒱ Limpiando la cripta con mucho brillo... 🕸️✨`)

    let files = await fs.readdir(sessionPath)
    let filesDeleted = 0

    for (const file of files) {
        if (
            file.startsWith('pre-key-') ||
            file.startsWith('sender-key') ||
            file.startsWith('session-')
        ) {
            if (!file.startsWith('creds') &&!file.startsWith('app-state')) {
                await fs.unlink(path.join(sessionPath, file))
                filesDeleted++;
            }
        }
    }

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = global.owner?.[0]?.[0] || '51927174369'

    let menu = `‧˚꒰🎃୭ 𓆩 𝗖𝗢𝗧𝗧𝗜 𝗕𝗢𝗧 𓆪 🎀

⤷ ┇ 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 ﹒ 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.dsowner ˚. ᵎᵎ
> *"Limpiando con estilo, hasta los fantasmas se enamoran"*

.⃟𖥔 ݁. 𖦹˙— \`\`FIX HALLOWEEN\`\` [${filesDeleted}] 🎀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 💅
🧹 ➛ Elimina archivos basura, dejando todo aesthetic ✨
🔒 ➛ No borra \`creds\` ni \`app-state\` para no desconectarte, reina
🎀 ➛ Limpieza profunda pero make it cute

── *📖 USO* ╏ 👑
💄 ➛ Solo para el número principal, preciosa
🔌 ➛ Sin reinicio, sigue intacta tu sesión

── *📊 RESULTADO* ╏ 🕯️
✅ ➛ Archivos eliminados: *${filesDeleted}*
💖 ➛ Estado: *${filesDeleted === 0? 'Todo limpio y aesthetic ✨💅' : 'Exorcismo completado 🎀🎃'}*

━━━━━━━━━━━
🎀 *COTTI BOT - HALLOWEEN EDITION* 🎃
*Owner*: @${ownerNum}
*Version*: 2.6 HALLOWEEN PRO 💅
━━━━━━━━━━━`

    await conn.sendMessage(m.chat, {
        text: menu,
        mentions: [m.sender, ownerNum + '@s.whatsapp.net']
    }, { quoted: m })
}
handler.help = ['dsowner']
handler.tags = ['fix']
handler.command = ['dsowner','delai','clearcache']
handler.rowner = true
export default handler