const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = ''; // 🔹 ضع توكن البوت هنا
const CHANNEL_ID = ''; // 🔹 ضع معرف القناة هنا
const ROLE_ID = ''; // 🔹 ضع معرف الرول هنا

let embedMessage; // لحفظ الرسالة حتى نتمكن من تحديثها

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log("code by usopp2324")
    console.log("https://github.com/usopp2324")

    const guild = client.guilds.cache.first();
    if (!guild) return console.log("❌ لا يمكن العثور على السيرفر!");

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("❌ القناة غير موجودة! تأكد من الـ ID.");  

    const sentMessage = await channel.send({ embeds: [generateEmbed(guild)] });
    embedMessage = sentMessage;

    // تحديث الـ Embed كل 10 ثوانٍ
    setInterval(async () => {
        if (embedMessage) {
            embedMessage.edit({ embeds: [generateEmbed(guild)] });
        }
    }, 10000); // 10 ثوانٍ
});

// توليد Embed بناءً على حالة الأعضاء
function generateEmbed(guild) {
    const role = guild.roles.cache.get(ROLE_ID);
    if (!role) return new EmbedBuilder().setTitle("⚠️ Error: The roll does not exist!");

    const membersWithRole = guild.members.cache.filter(member => member.roles.cache.has(ROLE_ID));

    const onlineMembers = [];
    const offlineMembers = [];

    membersWithRole.forEach(member => {
        if (member.presence && member.presence.status !== 'offline') {
            onlineMembers.push(member);
        } else {
            offlineMembers.push(member);
        }
    });

    return new EmbedBuilder()
        .setColor('#0099ff')

        .setTitle(`**${guild.name}**`)
        .setDescription(`**Staff duty for **: ${guild.name}<a:FIRE:1320741969156116511>`)
        .setAuthor({name : `Staff ${guild.name} is the best`, iconURL : client.user.avatarURL()})
        .setImage("#####")
        .addFields(
            { name: ' on duty ', value: onlineMembers.length > 0 ? onlineMembers.map(m => m.toString()).join('\n') : 'No one is online', inline: true },
            { name: ' Off duty ', value: offlineMembers.length > 0 ? offlineMembers.map(m => m.toString()).join('\n') : 'No one is Offline. ', inline: true }
        )
        .setFooter({ text: `*by* usopp` , iconURL: guild.iconURL()})
        .setTimestamp();
}

client.login(TOKEN);
