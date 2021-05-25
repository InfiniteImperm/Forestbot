const { cooldown, bot, sleep } = require('../index.js');
const { coolDownTime, spam } = require('../config.json')
const mcData = require('minecraft-data')(bot.version);
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow
bot.loadPlugin(pathfinder);
module.exports = function p(username, sender, flags, args) {
    return new Promise(async (resolve, reject) => {
        if (cooldown.has(bot.username)) {
            await sleep(1000);
            bot.whisper(username, spam);
        } else {
            //let userFlag = flags.toString()
            const player = bot.players[username];

            if(!player || !player.entity) { bot.whisper(username, " You need to be near me for this command to work."); return;}


            bot.chat("Alright, after you.  Where are we going master?")
            const movements = new Movements(bot, mcData)
            bot.pathfinder.setMovements(movements)
            let goal = new GoalFollow(player.entity, 2)
            bot.pathfinder.setGoal(goal, true)
            movements.canDig = false;
            bot.on('death', () => {
                bot.pathfinder.setGoal(null)
                return;
            })
            resolve()
            cooldown.add(bot.username);
            setTimeout(() => {
                // Removes the user from the set after a minute
                cooldown.delete(bot.username);
            }, coolDownTime);
        };
    });
};