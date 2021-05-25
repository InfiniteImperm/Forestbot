const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            await sleep(600);
            var word1 = ["Rabid", "Radiant", "Radical", "Radioactive", "Rakish", "Rambunctious", "Rampant", "Raspy", "Ratty", "Raucous",
                         "Ravenous", "Rebellious", "Recalcitrant", "Recondite", "Reliable", "Repulsive", "Resilient", "Restless",
                         "Rhetorical", "Ruthless", "Registered"];
            var word2 = ["Raiders", "Retards", "Rebels", "Revolutionaries", "Reapers", "Rickrollers", "Rammsteins"];
            var r1 = Math.floor(Math.random() * word1.length);
            var r2 = Math.floor(Math.random() * word2.length);
            bot.chat("RR = " + word1[r1] + " " + word2[r2])
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};
