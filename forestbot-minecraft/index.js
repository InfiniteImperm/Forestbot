const mineflayer = require('mineflayer'),
    config = require('./config.json'),
    date = require('date-and-time'),
    cmd = require('mineflayer-cmd').plugin,
    Discord = require('discord.js'),
    client = new Discord.Client(),
    mysql = require('mysql');
require('dotenv').config();
const db = mysql.createPool({ host: process.env.DBHOST, user: process.env.DBUSER, password: process.env.DBPASS, database: process.env.DBBASE, multipleStatements: true }); //Creating connection options for MARIADB
const options = { host: process.env.HOST, port: 25565, username: process.env.MCUSER, password: process.env.MCPASS, version: false, auth: 'microsoft' }; console.log('\x1b[33m%s\x1b[0m', `Initializing Bot with credentials: <${options.username}> , <${options.password}> | Attempting to join: <${options.host}>`) //Creating connection options for minecraft bot
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }; //sleep function.
async function Clock() { let now = new Date(); let pattern = date.compile('MMM DD/YY'); let time = date.format(now, 'hh:mmA [CDT]'); currentDate = date.format(now, pattern); timeAndCurrentDate = currentDate + " at " + time; }; Clock(); setInterval(Clock, 10000) //Keeping the timer updated!
db.getConnection((e) => { if (e) { console.log(e); }; console.log('\x1b[32m%s\x1b[0m', 'MySql Connected...'); }); //creating mysql connection

const bot = mineflayer.createBot(options); //creating minecraft bot
bot.loadPlugin(cmd);
const cooldown = new Set();
const red = 15859801,
    green = 42752,
    purple = 10551521,
    grey = 2303786,
    pink = 16724383,
    orange = 16743936;

const tryDatabase = async (u, m) => { try { db.query(`INSERT INTO messages (name,message,date) VALUES ('${u}', '${mysql.escapeId(m)}', '${currentDate}')`); } catch (e) { console.log(e); return; } }; //Saving messaged to database
const playtime = async () => { Object.keys(bot.players).forEach(player => { db.query(`UPDATE users SET playtime = playtime + 60000 WHERE username='${player}'`) }); } //Saving users playtime
const saveUserToDatabase = async (user) => { //checking if player exists in the database and if not making a new row for them.
    db.query(`SELECT * FROM users WHERE username = '${user.username}'`, async (a, result) => {
        try {
            db.query(`UPDATE users SET lastseen = '${timeAndCurrentDate}' WHERE username = '${user.username}'`)
            if (result[0].username === user.username) return;  //checking if user already exists in the database
        } catch {
            db.query(`INSERT INTO users (username,kills,deaths,joindate) VALUES ('${user.username}', '0','0', '${timeAndCurrentDate}') ; UPDATE users SET uuid = '${user.uuid}' WHERE username = '${user.username}'`)
            bot.chat(user.username + " just joined for the first time!");
        };
    });
};

const afk = async () => { bot.setControlState('jump', true); await sleep(2000); bot.setControlState('jump', false); bot.lookAt(bot.entity.position.offset(0, -1, Math.floor(Math.random() * (-180 - 180 + 1)) + 180)); };
const Activity = () => { client.user.setActivity(`Online: ${Object.keys(bot.players).length} | !help | forestbot.io`, { type: 'WATCHING' }); }; //Status for the discord bot
function ad() {
    let a = ["I'm a bot. Beep Boop. Try some !commands", "Visit my website at https://forestbot.io", "bc1q895glkrrhaqns72ygkz2qwjpw9nqz3tz645wnx <-- Send BITCOIN here!", "I am the best bot in the world.", "No one can stop me.", "Im a bot."],
        r = a[Math.floor(Math.random() * a.length)]; bot.chat(r);
}
let embed = async (c, m) => { // Live chat bridge between minecraft server -> discord
    client.channels.cache.get(config.mainDiscChannel).send({ embed: { color: c, description: m } });
    try { client.channels.cache.get(config.secondchannel).send({ embed: { color: c, description: m } }); } //if a user wishes to add a live chat to their discord server.
    catch { return; }
    return;
}

module.exports = { cooldown, bot, sleep, currentDate, timeAndCurrentDate, db, mysql, afk, Activity, ad, playtime, saveUserToDatabase, options, embed, green }; //Things we need in other files

bot.on('login', () => { const k = require('./login_event.js'); k.l() }); //When the bot logs in.
bot.on('whisper', async (u, m, c) => { embed(pink, `**${u} -> ${m}** » ${c}`) }) //when the bot sends or recieves a whisper.

bot.on('playerLeft', async (p) => {
    embed(red, `${p.username} left the server`)
    if (p.username === bot.username) return;
    try { db.query(`UPDATE users SET lastseen='${timeAndCurrentDate}' WHERE username='${p.username}'`) } //updating 'lastseen' row in database
    catch (e) { console.log(e); return; }
});

bot.on('chat', async (u, m) => {
    if (m.includes("'")) { m.replace(/:/g, "'", " ") }; //Using this to avoid mysql injections.
    embed(grey, `**<${u}>** ${m}`)
    tryDatabase(u, m)
    if (m.startsWith(`${config.prefix}`)) {
        const c = m.substring(1)
        bot.cmd.run(u, c)
    };
});

client.on('message', m => { if (m.channel.id != config.mainDiscChannel) return; if (m.author.id === client.user.id) return; bot.chat(`${m.member.user.tag} » ${m.content}`); }); //messages from discord sent to game chat.

bot.on('pk', async (l, k, a, b) => { //when player dies alone
    db.query(`UPDATE users SET deaths = deaths + 1 WHERE username='${l}'`);
    db.query(`UPDATE users SET kills = kills + 1 WHERE username='${k}'`);
    return embed(purple, b.toString());
});

bot.on('pkN', async (l, a, b, c) => { //when player dies from another player
    db.query(`UPDATE users SET deaths = deaths + 1 WHERE username='${l}'`);
    let m = b.toString();
    var f = m.indexOf(" ");
    var n = m.slice(f);
    return embed(purple, `${l} ${n}`);
});

bot.once('cmd_ready', () => { //initializing /commands directory
    bot.cmd.registerCommand('urban', require('./commands/urban.js'));
    bot.cmd.registerCommand('quote', require('./commands/quote.js'));
    bot.cmd.registerCommand('kd', require('./commands/kd.js'));
    bot.cmd.registerCommand('joindate', require('./commands/joindate.js'));
    bot.cmd.registerCommand('jd', require('./commands/joindate.js'));
    bot.cmd.registerCommand('lastseen', require('./commands/lastseen.js'));
    bot.cmd.registerCommand('seen', require('./commands/lastseen.js'));
    bot.cmd.registerCommand('msgcount', require('./commands/msgcount.js'));
    bot.cmd.registerCommand('wp', require('./commands/worstping.js'));
    bot.cmd.registerCommand('bp', require('./commands/bestping.js'));
    bot.cmd.registerCommand('coords', require('./commands/coords.js'));
    bot.cmd.registerCommand('help', require('./commands/help.js'));
    bot.cmd.registerCommand('kill', require('./commands/kill.js'));
    bot.cmd.registerCommand('ping', require('./commands/pings.js'));
    bot.cmd.registerCommand('come', require('./commands/come.js'));
    bot.cmd.registerCommand('stop', require('./commands/fuckoff.js'));
    bot.cmd.registerCommand('playtime', require('./commands/playtime.js'));
    bot.cmd.registerCommand('pt', require('./commands/playtime.js'));
    bot.cmd.registerCommand('commands', require('./commands/commandsCommand.js'));
    //bot.cmd.registerCommand('locate', require('./commands/locate.js'));
});

bot.on('kicked', (r) => embed(orange, r))
bot.on('error', (r) => embed(orange, r))
bot.once('end', async () => { embed(green, 'Attempting to rejoin in 20 seconds...'); await sleep(19000); process.exit(); }); //Reconnect bot (will only work if you use pm2)

client.login(process.env.TOKEN); //To login discord bot.
