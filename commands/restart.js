const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { spawn } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restartacontainer")
    .setDescription("Restarts a Docker container")
    .addStringOption(option => 
      option.setName('container')
        .setDescription('The container to restart')
        .setRequired(true)
        .setAutocomplete(true)),
  async autocomplete(interaction) {
    try {
      // Get list of running containers
      const ls = spawn('docker', ['ps', '-f', 'status=running', '--format', '{{.Names}}']);
      runningContainers = [];
      ls.stdout.on('data', data => {
        // Parse data to runningContainers by line
        runningContainers = data.toString().split('\n');
     
        // Remove last element (empty)
        runningContainers.pop();
        });
    ls.on('close', async (code) =>{      
        // Filter list of containers by focused value
        const focusedValue = interaction.options.getFocused(true);
        const filteredContainers = runningContainers.filter(container => container.startsWith(focusedValue.value));
        
        // Respond with filtered list of containers
        await interaction.respond(filteredContainers.map(container => ({ name: container, value: container })));
        });
    } catch (error) {
      // Handle error
      console.error(error);
      await interaction.reply('An error occurred while getting the list of running containers.');
    }
  },
  async execute(interaction) {
    try {
      // Get container name from options
      const container = interaction.options.getString('container');
      
      // Restart container
      await interaction.reply(`Restarting container "${container}"...`);
      await spawn('docker', ['restart', container]);
      
      // Confirm that container was restarted
      await interaction.followUp(`Container "${container}" was successfully restarted.`);
    } catch (error) {
      // Handle error
      console.error(error);
      await interaction.followUp(`An error occurred while trying to restart the container "${container}".`);
    }
  }
};
