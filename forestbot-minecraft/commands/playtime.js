const { cooldown, bot, sleep, db } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            function dhms(t) {
                d = Math.floor(t / (1000 * 60 * 60 * 24)),
                    h = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
                    s = Math.floor((t % (1000 * 60)) / 1000);
                return d + ' Day(s) ' + h + ' Hours ' + m + ' Minutes ' + s + ' Seconds'
            }
            let userFlag = flags.toString()
            if (userFlag === '') {
                try {
                    db.query(`SELECT username, playtime FROM users WHERE username='${username}'`, async (err, results) => {
                        let timetoformt = dhms(results[0].playtime)
                        bot.whisper(username, "Your playtime is: " + timetoformt)
                        return;
                    })
                } catch { return; }
            }
            else {
                db.query(`SELECT username, playtime FROM users WHERE username='${userFlag}'`, async (err, results) => {
                    try {
                        let userPlaytime = results[0].playtime,
                            timetoformat = dhms(userPlaytime);
                        if (results[0].lastseen === null) return;
                        if (err) throw err; await sleep(1500);
                        bot.whisper(username, results[0].username + "'s approx playtime:  " + timetoformat);
                    }
                    catch { bot.whisper(username, 'Sorry I have not seen that player it seems'); return; }
                });
            }
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};