const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let userFlag = flags.toString()
            if (userFlag === "") return;
            if (!bot.players[userFlag]) { bot.whisper(username, 'That player is not online.'); return; };
            function randomX(minx, maxx) { return Math.floor(Math.random() * (maxx + Math.abs(minx) * 2 + 1) + minx); };
            let RandomXX = randomX(-150000, 150000); let RandomZZ = randomX(-150000, 150000); let RandomYY = randomX(10, 64);
            await sleep(1500); bot.chat(`${userFlag}'s coords are X: ${RandomXX} , Y: ${RandomYY} , Z: ${RandomZZ} Go Find Them!`);
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};