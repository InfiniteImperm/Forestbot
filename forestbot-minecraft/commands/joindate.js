const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json');
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString();
            if (userFlag === '') {
                db.query(`SELECT username, joindate FROM users WHERE username='${username}'`, async (err, results) => {
                    bot.whisper(username, "Your joindate is " + results[0].joindate);
                    return;
                });
                return;
            }
            db.query(`SELECT username, kills, deaths, joindate FROM users WHERE username='${userFlag}'`, async (err, results) => {
                try {
                    if (results[0].joindate === null) { bot.whisper(username, "I do not have this players joindate recorded!"); return; };
                    await sleep(1500); bot.chat(results[0].username + " Joined " + results[0].joindate);
                } catch { bot.whisper(username, 'Sorry, but I do not have this player\'s join date recorded.'); return; };
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