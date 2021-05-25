const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()

            if (userFlag) {
                db.query(`SELECT username, kills, deaths FROM users WHERE username='${userFlag}'`, async (err, results) => {
                    try { if (err) throw err; await sleep(1500); bot.chat(results[0].username + " Has " + results[0].kills + " Kills and " + results[0].deaths + " Deaths!") } catch { bot.whisper(username, "I have never seen this player before."); return; }
                });
            }
            else {
                db.query(`SELECT username, kills, deaths FROM users WHERE username='${username}'`, async (err, results) => {
                    if (err) throw err; await sleep(1000);
                    bot.whisper(username, " you have " + results[0].kills + " Kills and " + results[0].deaths + " Deaths!"); return;
                });

                resolve()
                cooldown.add(bot.username);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    cooldown.delete(bot.username);
                }, coolDownTime);
            };
        };
    });
};