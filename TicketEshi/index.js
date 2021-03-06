console.log('sono pronto a tickettare')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.login(process.env.token)

client.on("message", message => {
    if (message.content == "!ciao") {
        var ticket = new Discord.MessageEmbed()
.setColor("red")
.setTitle("**TICKET SUPPORT**")
.setDescription("Clicca sulla reazione per aprire un ticket")
message.channel.send(ticket).then(msg => msg.react("📩")) //Personalizzare l'emoji della reaction
    }
})

client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return
    if (messageReaction.message.partial) await messageReaction.message.fetch();
    if (messageReaction._emoji.name == "📩") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "835837995939790880") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == `User ID: ${user.id}`)) {
                user.send(" > Hai già un ticket aperto").catch(() => { })
                return
            }
            server.channels.create(user.username, {
                type: "text"
            }).then(canale => {
                canale.setTopic(`User ID: ${user.id}`);
                canale.setParent("840268936012628008") //Settare la categoria
                canale.overwritePermissions([
                    {
                        id: server.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ])
                canale.send(" > Grazie per aver aperto il ticket")
            })
        }
    }
})
client.on("message", message => {
    if (message.content == "!close") {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send(" > Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send(" > Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("!add")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }
                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                if (haIlPermesso) {
                    message.channel.send(" > Questo utente ha già accesso al ticket")
                    return
                }
                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: true
                })
                message.channel.send(`${utente.toString()} è stato aggiunto al ticket`)
            }
        }
        else {
            message.channel.send(" > Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("!remove")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send(" > Non puoi utilizzare questo comando qui");
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }
                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                if (!haIlPermesso) {
                    message.channel.send(" > Questo utente non ha già accesso al ticket")
                    return
                }
                if (utente.hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send(" > Non puoi rimuovere questo utente")
                    return
                }
                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: false
                })
                message.channel.send(`${utente.toString()} è stato rimosso al ticket`)
            }
        }
        else {
            message.channel.send(" > Non puoi utilizzare questo comando qui")
        }
    }
})

client.on("ready", () => {
    client.user.setActivity('Sta creando ticket per Shinya', {
      type: 'PLAYING'
    });
});