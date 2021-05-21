
const axios = require('axios');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'stats',
    description: 'stats',
    
    execute(client, message,args) {
        let totalPlayer;
        let totalSub;
        let totalCasters;
        let totalConnoisseurs;
        axios.get('https://vrmasterleague.com/EchoArena/Players/List/').then((response) => {
            cheerse = cheerio.load(response.data)
            data = cheerse(`.players-list-header-count`).text();
            totalPlayer = data.replace(/[^\d.]/g, '' ).replace(/\./g, "")
            
        }).catch((error) => {
            console.error(error)
        });
        axios.get('https://vrmasterleague.com/EchoArena/Players/Subs/').then((response) => {
            cheerse = cheerio.load(response.data)
            data = cheerse(`.players-list-header-count`).text();
            totalSub = data.replace(/[^\d.]/g, '' ).replace(/\./g, "")
            }).catch((error) => {
            console.error(error)
        });
        axios.get('https://vrmasterleague.com/EchoArena/Connoisseurs/').then((response) => {
            cheerse = cheerio.load(response.data)
            data = cheerse(`.players-list-header-count`).text();
            totalConnoisseurs = data.replace(/[^\d.]/g, '' ).replace(/\./g, "")
        }).catch((error) => {
            console.error(error)
        });
        axios.get('https://vrmasterleague.com/EchoArena/Casters/List/').then((response) => {
            cheerse = cheerio.load(response.data)
            data = cheerse(`.players-list-header-count`).text();
            totalCasters = data.replace(/[^\d.]/g, '' ).replace(/\./g, "")
        }).catch((error) => {
            console.error(error)
        });
        let time = 500
        let process = setInterval(() => {
            if(totalSub == undefined || totalPlayer == undefined || totalConnoisseurs == undefined || totalCasters == undefined) {
                time += 500
            } else {
                clearInterval(process)
                const embed = new MessageEmbed()
                .setTitle("Some Stats")
                .setURL("https://vrmasterleague.com/EchoArena/Stats/")
                .setColor('#046da5')
                .setDescription("Some Stats about totalPlayer, sub etc")
                .addField('Total Player (Active)', totalPlayer)
                .addField('Total Sub', totalSub)
                .addField('Total Connoisseurs', totalConnoisseurs,true)
                .addField('Total Casters', totalCasters,true)
                .setTimestamp()
                message.channel.send(embed)
            }
        }, time);
        message.channel.send('Processing ...')
    }

}