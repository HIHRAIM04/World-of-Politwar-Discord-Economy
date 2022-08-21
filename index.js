const fs = require('fs');

const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

let guildsSize

require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000)

client.on('ready', () => {
  console.log('Bot is ready!');
  guildsSize = client.guilds.cache.map(guilds => guilds.id).length
  let status = {
    type: ['LISTENING', 'WATCHING'],
    text: ['wop!help', 'https://world-of-politwar.fandom.com/ru/wiki/']
  }
  const updateDelay = 15; // in seconds
  let currentIndex = 0;
  const updateStatus = status => {
    setInterval(() => {
      status.text[status.text.length - 1] = checkGuilds()
      if (!status.type[currentIndex]) {
        return
      }
      const activity = {
        text: status.text[currentIndex],
        actype: status.type[currentIndex]
      }
      client.user.setActivity(activity.text, { type: activity.actype });
      currentIndex = currentIndex >= status.type.length - 1
        ? 0
        : currentIndex + 1;
    }, updateDelay * 1000);
  }
  function checkGuilds() {
    let word = "сервер"
    let servers = guildsSize + ""
    let s = servers.length - 1
    if (servers[s] > 1 && servers[s] < 5) {
      word += "а"
    } else if (servers[s] != 1) {
      word += "ов"
    }
    let string = `${servers[s]} ${word}`
    return string
  }
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const MOD = message.member;

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply({ content: 'Я не могу обработать эту команду в личных сообщениях' });
  }

  let per
  let IDs
  if (command.permissions) {
    let a = command.permissions;
    let b = message.member.permissions.toArray();
    for (let c in a) {
      if (!b.includes(a[c])) {
        per = false;
      } else per = true;
    };
  }
  if (command.IDs) {
    if (!command.IDs.includes(message.author.id)) {
      IDs = false;
    } else IDs = true;
  }
  if ((per == false && IDs == false) || (per == undefined && IDs == false) || (per == false && IDs == undefined)) return message.reply({ content: "У вас нет прав для использования данной команды" });

  if (command.args && !args.length) {
    let reply = `Вы не указали ни единого аргумента, ${message.author}!`;

    if (command.usage) {
      reply += `\nПравльное использование данной команды: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send({ content: reply });
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply({ content: `Пожалуйста, подождите ${timeLeft.toFixed(1)} секунд перед использованием команды \`${command.name}\`` });
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send({ content: 'Произошла ошибка при обработке команды' });
  }
});

client.login(token);
