//Librairies
const axios = require('axios');
const { load } = require('cheerio');
const col = require('cli-color');
const { table } = require('table');
const inp = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//Debut du programme
console.clear();
console.log(col.bold('-=-=-=-=-=[ Bienvenue sur ' + col.red('LoL-Utils') + ' ]=-=-=-=-=-=\nUn outil qui facilite la sélection des champions\nTapez <help> pour toutes les commandes possibles\nN\'insérez pas d\'espaces ni de tirets dans le nom'));
redemarrer();

//Fonction principale
function redemarrer() {
    inp.question('>> ', name => {
        let args = name.toLowerCase().split(' ');
        let cmd = args[0];
        let arg = args[1];
        let lane = args[2];
        switch (cmd) {
            case 'count':
                contre(arg, lane);
                break;
            case 'help':
                help(arg);
                break;
            case 'runes':
                runes(arg, lane);
                break;
            case 'match':
                matchup(arg, lane);
                break;
            case 'build':
                build(arg, lane);
                break;
            case 'champ':
                champion(arg);
                break;
            case 'clear':
                console.clear();
                console.log(col.bold('-=-=-=-=-=[ Bienvenue sur ' + col.red('LoL-Utils') + ' ]=-=-=-=-=-=\nUn outil qui facilite la sélection des champions\nTapez <help> pour toutes les commandes possibles\nN\'insérez pas d\'espaces ni de tirets dans le nom'));
                redemarrer();
                break;
        }
    });
}

//Commandes disponibles
async function contre(arg, lane) {
    axios.get(`https://www.counterstats.net/league-of-legends/${arg}`)
        .then(res => {
            const data = [];
            let nam;
            let tabb;
            let html = res.data;
            const $ = load(html);
            if (!$('.b')[0]) {
                console.log(col.red.bold('Champion non reconnu'))
            } else {
                let i = 0;
                let ru = [];
                let wr = [];
                let pt = [];
                $('img').each(function (i, element) {
                    if ($(element).attr('alt') == "Counter Stats for " && $(element).parent().parent().parent().parent().parent().parent().children().first().text().includes(ligne(lane))) {
                        ru.push($(element).attr('src'));
                        wr.push($(element).parent().parent().next().next().children().text())
                        pt.push($(element).parent().parent().next().children().next().find('label').text())
                    }
                })
                if (!ru[i]) {
                    console.log(col.red.bold('Champion non reconnu'));
                    return;
                }
                data.push(['Counter', 'WR', 'Score /10'])
                while (i <= 11) {
                    nam = ru[i].slice(48, -8);
                    data.push([caps(nam), wr[i], pt[i].slice(0, -1)])
                    i++
                }
                console.log(table(data));
            }
        })
    await delay(1500);
    redemarrer();
}
async function help(arg) {
    if (!arg) {
        console.log(col.bold(col.underline.bold('Commandes disponibles:') + '\n<help>:  renvois cette page\n<clear>: effacer la console\n<count>: renvois les counters du champion\n<champ>: renvois les infos du champion\n<build>: renvois le build de la game du champion\n<match>: renvois les stats du matchup\n<runes>: renvois les runes du champion\nhelp <commande>: aide sur la commande donnée'));
    } else {
        switch (arg) {
            case 'count':
                console.log(col.bold(col.underline('Commande Counter:') + '\nSyntaxe: count <champion> <lane>\nRenvois les counters du champion\nLanes: top, jgl, mid, adc, sup'));
                break;
            case 'help':
                console.log(col.bold(col.underline('Commande Help:') + '\nSyntaxe: help [commande]\nRenvois les différentes commandes'));
                break;
            case 'runes':
                console.log(col.bold(col.underline('Commande Runes:') + '\nSyntaxe: runes <champion> <lane>\nRenvois les runes du champion\nLanes: top, jgl, mid, adc, sup'));  //---------------
                break;
            case 'match':
                console.log(col.bold(col.underline('Commande Match:') + '\nSyntaxe: match <champion> <opposant>\nRenvois les stats du matchup'));                               //-----------
                break;
            case 'build':
                console.log(col.bold(col.underline('Commande Build:') + '\nSyntaxe: build <champion> <lane>\nRenvois le build de la game du champion\nLanes: top, jgl, mid, adc, sup'));  //----------
                break;
            case 'champ':
                console.log(col.bold(col.underline('Commande Champ:') + '\nSyntaxe: champ <champion>\nRenvois les infos du champion'));                                         //-------------
                break;
            case 'clear':
                console.log(col.bold(col.underline('Commande Clear:') + '\nSyntaxe: clear\nEfface la console'));                                         //-------------
                break;
        }
    }
    await delay(1000);
    redemarrer();
}
async function runes(arg, lane) {
    var url = `https://www.op.gg/champions/${arg}/${ligneop(lane)}/build?hl=fr_FR`
    axios.get(url)
        .then(res => {
            let html = res.data;
            const $ = load(html);
            let ru = [];
            let tu = [];
            let adap = [];
            let runes1 = $('.css-1a27uut.e1jxk9el2').children().next();
            let runes2 = runes1.next().next();
            let runes3 = runes1.last().children().next();
            $('img').each(function (index, element) {
                if (!$(element).parent().parent().attr('class')) return;
                if ($(element).parent().parent().attr('class').includes('e1o8f101') && !$(element).parent().parent().attr('class').includes('css-6l0g7v')) {
                    tu.push($(element).attr('alt'));
                }
            })
            runes3.find('img').each(function (index, element) {
                if ($(element).attr('class').includes('css-anaetp')) {
                    if ($(element).attr('src').includes('5008')) {
                        adap.push("Force adaptative");
                    } else if ($(element).attr('src').includes('5005')) {
                        adap.push("Vitesse d\'attaque");
                    } else if ($(element).attr('src').includes('5007')) {
                        adap.push("Accélération de compétences");
                    } else if ($(element).attr('src').includes('5002')) {
                        adap.push("Armure");
                    } else if ($(element).attr('src').includes('5003')) {
                        adap.push("Résistance magique");
                    } else {
                        adap.push("Vie selon le niveau");
                    }
                }
            })
            ru[0] = runes1.children().next().next().children().children().children().attr('alt');
            ru[5] = runes2.children().next().children().children().children().attr('alt');
            if (!ru[0]) {
                console.log(col.red.bold('Champion non reconnu'));
                return;
            }
            const data = [
                [ru[0], ru[5], adap[0]],
                [tu[0], tu[3], adap[1]],
                [tu[1], tu[4], adap[2]],
                [tu[2], 'Rien', 'Rien']
            ];
            console.log(table(data));
        })
        .catch(err => {
            console.log(col.red.bold('Champion non reconnu'))
        })
    await delay(3000);
    redemarrer();
}
async function build(arg, lane) {
    var url = `https://www.leagueofgraphs.com/fr/champions/builds/${arg}/${lignelog(lane)}`
    axios.get(url)
        .then(res => {
            let html = res.data;
            const $ = load(html);
            let start = [];
            let princ = [];
            let fin = [];
            let i;
            $('img').each(function (index, element) {
                if ($(element).parent().parent().parent().children().first().text().includes('Objects de départs')) {
                    start.push(' ' + $(element).attr('alt'));
                } else if ($(element).parent().parent().parent().children().first().text().includes('Bottes')) {
                    i = $(element).attr('alt');
                } else if ($(element).parent().parent().parent().children().first().text().includes('Objets principaux')) {
                    princ.push(' ' + $(element).attr('alt'));
                } else if ($(element).parent().parent().parent().children().first().text().includes('Objects de fin')) {
                    fin.push(' ' + $(element).attr('alt'));
                }
            })
            if (!start[0]) {
                console.log(col.red.bold('Champion non reconnu'));
                return;
            }
            const data = [
                ['Objets de départ:', 'Objets principaux:','Objets de fin:'],
                [start.join('\n'), princ.join('\n') + '\n' + i, fin.join('\n')]
            ];
            console.log(table(data));
        })
        .catch(err => {
            console.log(col.red.bold('Champion non reconnu'))
        })
    await delay(3000);
    redemarrer();
}
async function matchup(arg, oppos) {
    console.log('help')
}
async function champion(arg) {
    console.log('help')
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function caps(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function ligne(lane) {
    switch (lane) {
        case 'sup':
            return 'Support'
            break;
        case 'top':
            return 'Top'
            break;
        case 'adc':
            return 'Bottom'
            break;
        case 'mid':
            return 'Middle'
            break;
        case 'jgl':
            return 'Jungle'
            break;
    }
}

function ligneop(lane) {
    switch (lane) {
        case 'sup':
            return 'support'
            break;
        case 'top':
            return 'top'
            break;
        case 'adc':
            return 'adc'
            break;
        case 'mid':
            return 'mid'
            break;
        case 'jgl':
            return 'jungle'
            break;
    }
}

function lignelog(lane) {
    switch (lane) {
        case 'sup':
            return 'support'
            break;
        case 'top':
            return 'top'
            break;
        case 'adc':
            return 'adc'
            break;
        case 'mid':
            return 'middle'
            break;
        case 'jgl':
            return 'jungle'
            break;
    }
}