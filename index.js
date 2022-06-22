const axios = require('axios');
const { load } = require('cheerio');
const col = require('cli-color');
const { table } = require('table');
const inp = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(col.bold('-=-=-=-=-=[ Bienvenue sur ' + col.red('LoL-Utils') + ' ]=-=-=-=-=-=\nUn outil qui facilite la sélection des champions\nTapez <help> pour toutes les commandes possibles'));
redemarrer();


function redemarrer() {
    inp.question('>> ', name => {
        let content = name.split(' ');
        let cmd = content[0];
        let arg = name.slice(6).toLowerCase().replace(' ', '-');
        switch (cmd) {
            case 'count':
                contre(arg);
                break;
            case 'help':
                help();
                break;
            case 'runes':
                runes(arg);
                break;
            case 'match':
                matchup(arg);
                break;
            case 'start':
                start(arg);
                break;
            case 'champ':
                champion(arg);
                break;
        }
    });
}


async function contre(arg) {
    axios.get(`https://www.counterstats.net/league-of-legends/${arg}`)
        .then(res => {
            let imag;
            let nam;
            let wr;
            let stre;
            let tabb;
            let html = res.data;
            const $ = load(html);
            if (!$('.b')[0]) {
                console.log(col.red.bold('Champion non reconnu'))
            } else {
                console.log(col.underline.bold(`Counter de ${caps(arg)} | WR | Force`))
                let i = 14;
                let x = 0;
                while (i <= 24) {
                    imag = $('img')[i].attribs.src;
                    nam = imag.slice(48, -8)
                    wr = $('.b')[x].children[0].data;
                    stre = $('.rating-bar').find('label')[x].children[0].data.slice(0, -1);
                    if (nam.length >= 7) {
                        tabb = ' \t';
                    } else {
                        tabb = ' \t\t';
                    }
                    console.log(col.bold(caps(nam) + tabb + wr + ' \t' + stre + '/10'))
                    i++
                    x++
                }
            }
        })
    await delay(1500);
    redemarrer();
}
async function help() {
    console.log(col.bold(col.underline.bold('Commandes disponibles:') + '\n<help>: renvois cette page\n<count>: renvois les counters du champion\n<champ>: renvois les infos du champion\n<start>: renvois le build de début du champion\n<match>: renvois les stats du matchup\n<runes>: renvois les runes du champion'));
    await delay(1000);
    redemarrer();
}
async function runes(arg) {
    var url = `https://rankedboost.com/league-of-legends/build/${arg}/`
    axios.get(url)
        .then(res => {
            let html = res.data;
            const $ = load(html);
            let ru = [];
            $('.rb-build-rune-text').each(function (index, element) {
                ru.push($(element).text());
            })
            const data = [
                [ru[0], ru[5], ru[8]],
                [ru[1], ru[6], ru[9]],
                [ru[2], ru[7], ru[10]],
                [ru[3], 'Nothing', 'Nothing'],
                [ru[4], 'Nothing', 'Nothing']
            ];
            console.log(col.bold.underline(`Runes pour ${caps(arg)}`))
            console.log(table(data));
        })
        .catch(err => {
            console.log(col.red.bold('Champion non reconnu'))  
        })
    await delay(1500);
    redemarrer();
}
async function matchup() {
    console.log('help')
}
async function start() {
    console.log('help')
}
async function champion() {
    console.log('help')
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function caps(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}