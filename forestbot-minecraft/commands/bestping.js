const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            //let userFlag = flags.toString()
            await sleep(600);
            let highestPing = Object.entries(bot.players).sort((a, b) => a[1].ping - b[1].ping);
            bot.chat(highestPing[0][0] + " Has the best ping which is " + bot.players[highestPing[0][0]].ping)
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};