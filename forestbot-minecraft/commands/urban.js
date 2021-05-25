const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
const ud = require('urban-dictionary');
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            let definition = flags.toString()
            ud.define(`${definition}`, async (error, results) => {
                if (error) {
                    await sleep(1000);
                    bot.whisper(username, `define (callback) error - ${error.message}`)
                    return
                }
                let def = results[0].definition;
                var length = 170;
                var trimmedString = def.length > length ?
                    def.substring(0, length - 3) + "..." :
                    def;

                await sleep(1000);
                bot.chat(trimmedString)
                return;
            })
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        }
    })
}