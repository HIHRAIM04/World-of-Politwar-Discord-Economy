const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'buy',
	description: 'Команда покупки предмета из магазина. Используйте: `wop!buy "Номер предмета магазина"`.',
    category: 'economy',
	execute(message, args) {
    var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        var shop = JSON.parse(fs.readFileSync("./shop.json", "utf8"))["array"];
        if(!args[0] || typeof parseInt(args[0]) != 'number' || parseInt(args[0] - 1) < 0 || (parseInt(args[0]) - 1) > (shop.length - 1)) return message.channel.send("Укажите верный ID товара!")
        buy(parseInt(args[0]) - 1)
        function buy(id) {
            if(!users[message.author.id]) {
                users[message.author.id] = {}
            }
            if(!users[message.author.id].inv) {
                users[message.author.id].inv = []
            }
            if(users[message.author.id].dollars >= shop[id].cost) {
                var searchElement = users[message.author.id].inv.find(i => i.id == id)
                if(!searchElement) {
                    users[message.author.id].inv.push(item(id))
                } else {
                    var index = users[message.author.id].inv.indexOf(searchElement, [fromIndex = 0])
                    users[message.author.id].inv[index].number++
                }
                users[message.author.id].dollars -= shop[id].cost
            } else return message.channel.send('Недостаточно денег для совершения операции!')
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
            let buyMess = new Discord.MessageEmbed()
                .setTitle('Товар успешно куплен!')
                .setDescription(`Вы купили \`${shop[id].name}\` за \`${shop[id].cost}\`:dollar:`)
                .setColor('RANDOM')
            message.channel.send({embeds: [buyMess]})
        }
        function item(id) {
            return({
                id: id,
                number: 1
            })
        }
	},
};
