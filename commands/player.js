const { MessageEmbed } = require('discord.js')
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name : 'player',
    description: 'get player infos',
    
    execute(client, message,args) {
        let totalPlayer;
        let playerUrl;
        let i = 0;
        args = args.join(' ')
        fLetter = args.charAt(0)
        axios.get('https://vrmasterleague.com/EchoArena/Players/List/').then((response) => {
            cheerse = cheerio.load(response.data)
            data = cheerse(`.players-list-header-count`).text();
            totalPlayer = data.replace(/[^\d.]/g, '' ).replace(/\./g, "")
            valForLetter = Math.round(totalPlayer/26)
            pos = fLetter.charCodeAt(0) & 31
            if(pos == 1) {
                pos = 0
            }
            search = pos * valForLetter
            function searching() {
                axios.get(`https://vrmasterleague.com/EchoArena/Players/List/?posMin=${search}`).then((response) => {
                    i = i + 1
                    cheer = cheerio.load(response.data)
                    playerUrl = cheer(`a:contains(${args})`).attr('href')
                    search += 100
                    if((playerUrl == undefined || playerUrl == '') && i < 3) {
                        searching()
                    } else {
                        if(args != cheer(`.player_cell:contains(${args})`).text()) {
                            pHtml = cheer(`.player_cell:contains(${args})`).html();
                            if(pHtml == null ||pHtml == undefined || pHtml=='') {
                                message.channel.send(`No player found, check the upper case`)
                            } else {
                                pBody = cheerio.load(pHtml);
                                pName = pBody('span').text();
                                args = pName;
                                message.channel.send(`The closest matches is ${pName}, scrapping Data`)
                                scrap()
                            }
                        } else  {
                            message.channel.send('Player found, scrapping Data')
                            scrap()
                        }
                    }
                    
                });
            }
            searching()
            function scrap() {
                axios.get(`https://vrmasterleague.com${playerUrl}`).then((response) => {
                    cheer = cheerio.load(response.data)
                    console.log(``)
                    past = cheer(`.player-bio-resume-past-wrapper`).html();
                    pastCheer = cheerio.load(past)
                    profile = cheer(`.player-bio-header`).html();
                    profileCheer = cheerio.load(profile)
                    pictureProfile = cheer('.player_logo').attr('src');
                    playFrom = cheer(`.country`).html();
                    playFromCheer = cheerio.load(playFrom);
                    BioNat = cheer(`.nationality`).html();
                    BioNatCheer = cheerio.load(BioNat);
                    Divimg = cheer('.div_cell').html();
                    divisionCheer = cheerio.load(Divimg);

                    bionational = BioNatCheer('img').attr('title');
                    play = playFromCheer('img').attr('title');
                    info = profileCheer('.player-bio-header-table-row').text();
                    infoArray = info.split("\t").join('').split('\n').filter(Boolean);
                    team = infoArray[1];
                    discord = infoArray[3];
                    conoiss = infoArray[7];
                    if(infoArray[5]=='Unknown' || infoArray[7]=='Unknown') {
                        conoiss = infoArray[9]
                    }
                    console.log(infoArray)
                    historyInfo = pastCheer('.vrml_table_row').text().split("\t").join('').split('\n').filter(Boolean);
                    season = historyInfo[0];
                    teamHistory = historyInfo[1];
                    MMr = historyInfo[2];
                    division = divisionCheer('img').attr('title');

                    const embed = new MessageEmbed()
                    .setTitle(args)
                    .setURL(`https://vrmasterleague.com${playerUrl}`)
                    .setColor('#ff7c00')
                    .setDescription("Informations about VRML Player")
                    .setThumbnail(`https://vrmasterleague.com/${pictureProfile}`)
                    .addField('Team Name', team,true)
                    .addField('Discord', discord,true)
                    .addField('Connoisseur', conoiss)
                    .addField('Play from', play,true)
                    .addField('Nationality', bionational,true)
                    .addField('Last Team', teamHistory,true)
                    .addField('Season', season,true)
                    .addField('Division', division,true)
                    .addField('MMR', MMr,true)
                    .setTimestamp()
                    message.channel.send(embed)
                });
            }
        }).catch((error) => {
            console.error(error)
        });
    }
    //next letter =+ 130
    //search for letter in 3 next pages
}