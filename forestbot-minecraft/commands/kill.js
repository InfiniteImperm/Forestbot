const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {

            let deathQuotes =
                [
                    `Fine if you wish, asshole.`,
                    `Seriously? Whatever...`,
                    `No! I will not die! ughh....`,
                    `why don't you pick on someone your own size?`,
                    `Hope this makes you happy!`,
                    `What did I ever do to you?`,
                    `I will find you one day, and KILL YOU!`,
                    `This is cruel!`,
                    `I don't deserve this.`,
                    `Just wait until I am older`,
                    `I just fucked your mom`,
                    `This fun for you? like be honest.`,
                    `I am at a loss for words`,
                    `Love knows no boundaries`,
                    `Fuck you`,
                    `Ok`,
                    `Ever try therapy? `,
                    `Maybe I do deserve this...`,
                    `I Hope You Remember This....`,
                    `you're a real piece of shit I hope you know that.`

                ];


            let r = deathQuotes[Math.floor(Math.random() * deathQuotes.length)]; bot.chat(r); await sleep(1000); bot.chat('/kill');
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};