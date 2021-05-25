const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()
            if (userFlag === '') { bot.whisper(username, " Usage !lastseen <username>"); return; }
            db.query(`SELECT username, lastseen FROM users WHERE username='${userFlag}'`, async (err, results) => {
                try { if (results[0].lastseen === null) return; if (err) throw err; await sleep(1500); bot.chat(results[0].username + " was last seen " + results[0].lastseen); }
                catch { bot.whisper(username, 'Sorry I have not seen that player it seems'); return; }
            });

            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};