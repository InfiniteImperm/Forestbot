const { bot, sleep, afk, Activity, ad, playtime, saveUserToDatabase, options, embed, green } = require('./index.js');
const config = require('./config.json');
async function l() {
    console.log('\x1b[32m%s\x1b[0m', options.username + " has joined " + options.host + " successfuly.")
    setInterval(Activity, 10000); setInterval(ad, 1900000); setInterval(afk, config.afkTimer);
    bot.chatAddPattern(/(.*) was slain by (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) drowned whilst trying to escape (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) experienced kinetic energy whilst trying to escape (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) was shot by (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) was blown up by (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) hit the ground too hard whilst trying to escape (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) was burnt to a crisp whilst fighting (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) was killed by magic whilst trying to escape (\w+)/, 'pk')
    bot.chatAddPattern(/(.*) tried to swim in lava/, 'pkN')
    bot.chatAddPattern(/(.*) was pricked to death/, 'pkN')
    bot.chatAddPattern(/(.*) Was killed by nature/, 'pkN')
    bot.chatAddPattern(/(.*) drowned/, 'pkN')
    bot.chatAddPattern(/(.*) blew up/, 'pkN')
    bot.chatAddPattern(/(.*) was killed by/, 'pkN')
    bot.chatAddPattern(/(.*) hit the ground too hard/, 'pkN')
    bot.chatAddPattern(/(.*) experienced kinetic energy/, 'pkN')
    bot.chatAddPattern(/(.*) fell from a high place/, 'pkN')
    bot.chatAddPattern(/(.*) fell off a ladder/, 'pkN')
    bot.chatAddPattern(/(.*) fell while climbing/, 'pkN')
    bot.chatAddPattern(/(.*) went up in flames/, 'pkN')
    bot.chatAddPattern(/(.*) burned to death/, 'pkN')
    bot.chatAddPattern(/(.*) was struck by lightning/, 'pkN')
    bot.chatAddPattern(/(.*) was killed by magic/, 'pkN')
    bot.chatAddPattern(/(.*) was stung to death/, 'pkN')
    bot.chatAddPattern(/(.*) starved to death/, 'pkN')
    bot.chatAddPattern(/(.*) suffocated in a wall/, 'pkN')
    bot.chatAddPattern(/(.*) withered away/, 'pkN')
    bot.chatAddPattern(/(.*) died/, 'pkN')
    bot.chatAddPattern(/(.*) froze to death/, 'pkN')
    bot.chatAddPattern(/(.*) went off with a bang/, 'pkN')
    bot.chatAddPattern(/(\w+) > (.*)/, 'chat')
    bot.chatAddPattern(/\[MOD]\] (\w+) ✪ > (.*)/, 'chat')
    bot.chatAddPattern(/\[Jr MOD\] (\w+) ✪ > (.*)/, 'chat')
    bot.chatAddPattern(/\[Sr MOD\] (\w+) ✪ > (.*)/, 'chat')
    bot.chatAddPattern(/\[Discord \| Donator\] (\w+) ✪ » (.*)/, 'chat')
    bot.chatAddPattern(/\[Discord \| Nitro Booster\] (\w+) » (.*)/, 'chat')
    await sleep(5000);
    setInterval(playtime, 60000);
    bot.on('playerJoined', async (p) => {
        embed(green, `${p.username} joined the server`)
        if (p.username === bot.username) return;
        saveUserToDatabase(p);
    });
}
exports.l = l;