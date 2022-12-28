const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { spawn } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("allcontainers")
        .setDescription("Lists all containers"),
    async execute(interaction) {
        outArray = [];
        await interaction.reply('Listing all containers...');
        const ls = spawn('docker', ['ps', '-a', '--format', '{{.Names}} - {{.Status}}']);
        ls.stdout.on('data', cont => {
            // parse cont to outArray by line
            outArray = cont.toString().split('\n');
            // remove last element (empty)
            outArray.pop();
            // split each element by ' - '
            outArray = outArray.map(e => {
                const [name, status] = e.split(' - ');
                return { name, status };
            });
            
        });

        ls.on('close', (code) => {
            embedCount = Math.ceiling(outArray.length / 25);
            for (let i = 0; i < embedCount; i++) {
                const embed = new EmbedBuilder()
                    .setTitle('Containers')
                    .addFields(outArray.slice(i * 25, (i + 1) * 25).map(e => {
                        return { name: e.name, value: e.status };
                    }))
                    .setColor(0x00AE86);
                interaction.channel.send({ embeds: [embed] });
            }
        });        
    },
};