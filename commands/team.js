
const axios = require('axios');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name : 'team',
    description: 'envoie info du leaderboard de la team choisis',
    
    execute(client, message,args) {
        let a = 0;
        let b =0;
        let total = 0;
        let cheerse;
        axios.get('https://vrmasterleague.com/EchoArena/Standings/bMvm-nOAdg-ofBzJfEr3ag2?rankMin=1').then((response) => {
            cheerse = cheerio.load(response.data)
            if (args.length >=2) {
                args = args.join(' ')
            }
            let img = [];
            data = cheerse(`.vrml_table_row:contains(${args})`).text();
            cheerse(`.team_logo`).each(function () {
                images = cheerse(this).attr('src')
                if(images !='/images/team_logo_40.png') {
                    img.push(images)
                }
            });
            cheerse(`.not_effective`).each(() => {
                a=a+1
            });
            cheerse(`.vrml_table_row`).each(() => {
                b=b+1
            });
            axios.get('https://vrmasterleague.com/EchoArena/Standings/bMvm-nOAdg-ofBzJfEr3ag2?rankMin=100').then((response) => {
                cheer = cheerio.load(response.data)
                cheer(`.not_effective`).each(() => {
                    a=a+1
                });
                cheer(`.vrml_table_row`).each(() => {
                    b=b+1
                });
                total = b-a
                cleanup = data.split("\t").join('').split('\n').filter(Boolean)
                team = cleanup.slice(0,7)
                //normal embed
                const embed = new MessageEmbed()
                .setTitle("Team Info")
                .setURL("https://vrmasterleague.com/EchoArena/Standings/bMvm-nOAdg-ofBzJfEr3ag2?rankMin=1")
                .setColor('#ff7c00')
                .setDescription("Informations about VRML Team like win, loss, MMR, rank")
                .setThumbnail(`https://vrmasterleague.com/${img[team[0]-1]}`)
                .addField('Team Name', team[1])
                .addField('Position (Active Team)', `${team[0]}/${total}`,true)
                .addField('GamePlayed', team[2],true)
                .addField('Win', team[3],true)
                .addField('Loss', team[4],true)
                .addField('Points', team[5],true)
                .addField('MMR', team[6],true)
                .setTimestamp()

                //master embed
                const Masterembed = new MessageEmbed()
                .setTitle("Team Info")
                .setURL("https://vrmasterleague.com/EchoArena/Standings/bMvm-nOAdg-ofBzJfEr3ag2?rankMin=1")
                .setColor('#ff7c00')
                .setDescription("Informations about VRML Team like win, loss, MMR, rank")
                .setThumbnail(`https://vrmasterleague.com/${img[team[0]-1]}`)
                .addField('Team Name', team[1])
                .addField('Position (Active Team)', `${team[0]}/${total}`,true)
                .addField('GamePlayed', team[2],true)
                .addField('Win', team[3],true)
                .addField('Loss', team[4],true)
                .addField('+/-', team[5],true)
                .addField('Points', team[6],true)
                .setTimestamp()
                
                if(args != cheerse(`.team_name:contains(${args})`).text()) {
                    if(cheerse(`.team_name:contains(${args})`).text() == undefined || cheerse(`.team_name:contains(${args})`).text() == '') {
                        message.channel.send("Can't find any matches for this team")
                    } else {
                        message.channel.send(`No team matches, did you mean ${team[1]}?`)
                        message.channel.send(embed)
                    }

                } else if(team[0] <=10) {
                    message.channel.send(Masterembed)
                } else {
                    message.channel.send(embed)
                }
            });
        }).catch((error) => {
            console.error(error)
        });
        
    }
}