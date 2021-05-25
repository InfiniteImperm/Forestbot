const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()
            if (userFlag === '') { bot.whisper(username, "Usage !quote <username>"); return; }
            if (userFlag === bot.username) return; //checking if people are trying to !quote the bot.
            db.query(`SELECT name,message,date FROM messages WHERE name='${userFlag}' AND LENGTH(message) > 30 ORDER BY RAND() LIMIT 1`, async (error, results, fields) => {
                try {
                    if (error) throw error;
                    if (results[0].message.includes('!quote ')) return;
                    if (results[0].date === null) { results[0].date = ' ' };
                    await sleep(1500); bot.chat(`[${results[0].name}] ` + results[0].message + " | " + results[0].date)
                } catch { await sleep(1500); bot.whisper(username, "I have never seen that player or their message is too short.") };
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