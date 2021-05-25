const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()
            if (userFlag === '') { bot.whisper(username, "Usage: !msgcount <username> "); return; }
            db.query(`SELECT name, COUNT(name) AS cnt FROM messages WHERE NAME='${userFlag}' HAVING cnt > 1`, async (error, results, fields) => {
                try { if (error) throw error; await sleep(1500); bot.chat(results[0].name + ' has sent ' + results[0].cnt + ' messages!'); } catch { return bot.whisper(username, 'No messages from this player') };
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