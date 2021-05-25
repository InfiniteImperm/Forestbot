const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()

            if (userFlag) {
                try {
                    bot.chat(`${userFlag}'s ping is: ${bot.players[userFlag].ping}`)
                } catch { bot.whisper(username, " This player is not online at the moment.") }
            }
            else {
                bot.whisper(username, "Your ping is " + bot.players[username].ping)
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