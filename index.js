//Librairies
import axios from 'axios';
import { load } from 'cheerio';
import col from 'cli-color';
import box from 'boxen';
import { table } from 'table';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pack = require("./package.json");
const gradient = require('gradient-string');
const figlet = require('figlet');
import readline from 'readline';
const inp = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//Debut du programme
(async () => {
    console.clear();
    figlet.text('LoL Utils', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: undefined,
        whitespaceBreak: true
    }, function (err, data) {
        if (err) {
            console.log(col.red('Erreur au lancement...'));
            return;
        }
        console.log(gradient('orange', 'red')(data) + col.red('\n Simplifier la sélection des champions\n\tUn outil de @JeyyJeyy'));
    });
    await delay(2000);
    console.clear();
    console.log('-=-=-=-=-=[ Bienvenue sur ' + col.red('LoL-Utils') + ' ]=-=-=-=-=-=\nUn outil qui facilite la sélection des champions\nTapez ' + col.redBright('<help>') + ' pour toutes les commandes possibles\nN\'insérez pas d\'espaces ni de tirets dans le nom');
    redemarrer();
})();

//TYPES DE DEGATS DU CHAMPION
/*let list = [];
let nbb = 26;
let nbr = 19;
let nbg = 55;
let barb = parseFloat(nbb/100 * 40);
let barr = parseFloat(nbr/100 * 40);
let barg = parseFloat(nbg/100 * 40);
for(var i = 0; i <= barr; i++){
    list.push(col.red('█'));
}
for(var i = 0; i <= barb; i++){
    list.push(col.cyan('█'));
}
for(var i = 0; i <= barg; i++){
    list.push(col.blackBright('█'));
}
console.log(box('['+list.join('')+']\n\n'+col.red('█')+' = Physique '+col.cyan('█')+' = Magique '+col.blackBright('█')+' = Brut ', {title: 'Types de dégats'}))*/


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
                console.log(col.bold('-=-=-=-=-=[ Bienvenue sur ' + col.red('LoL-Utils') + ' ]=-=-=-=-=-=\nUn outil qui facilite la sélection des champions\nTapez ' + col.redBright('<help>') + ' pour toutes les commandes possibles\nN\'insérez pas d\'espaces ni de tirets dans le nom'));
                redemarrer();
                break;
            case 'skill':
                skill(arg, lane);
                break;
            case 'infos':
                infos();
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
            let nam2;
            let html = res.data;
            const $ = load(html);
            if (!$('.b')[0]) {
                console.log(col.red.bold('Champion non reconnu'))
            } else {
                let i = 0;
                let ruW = [];
                let wrW = [];
                let ptW = [];
                let ruL = [];
                let wrL = [];
                let ptL = [];
                $('img').each(function (i, element) {
                    if ($(element).attr('alt') == "Counter Stats for " && $(element).parent().parent().parent().parent().parent().parent().children().first().text().includes(ligne(lane))) {
                        if ($(element).parent().parent().parent().parent().parent().children().first().children().text().includes('Best Picks')) {
                            ruW.push($(element).attr('src'));
                            wrW.push($(element).parent().parent().next().next().children().text())
                            ptW.push($(element).parent().parent().next().children().next().find('label').text())
                        } else if ($(element).parent().parent().parent().parent().parent().children().first().children().text().includes('Worst Picks')) {
                            ruL.push($(element).attr('src'));
                            wrL.push($(element).parent().parent().next().next().children().text())
                            ptL.push($(element).parent().parent().next().children().next().find('label').text())
                        }
                    }
                })
                if (!ruW[i]) {
                    console.log(col.red.bold('Champion non reconnu'));
                    return;
                }
                data.push(['Meilleurs', 'WR', '/10', 'Pires', 'WR', '/10'])
                while (i <= 11) {
                    nam = ruW[i].slice(48, -8);
                    nam2 = ruL[i].slice(48, -8);
                    data.push([caps(nam), wrW[i], ptW[i].slice(0, -1), caps(nam2), wrL[i], ptL[i].slice(0, -1)])
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
        console.log(box(col.bold(col.redBright(' <help>') + ' :  renvois cette page\n ' + col.redBright('<clear>') + ': effacer la console\n ' + col.redBright('<infos>') + ': informations sur l\'app\n ' + col.redBright('<skill>') + ': renvois l\'ordre des spells à prendre\n ' + col.redBright('<count>') + ': renvois les counters du champion\n ' + col.redBright('<champ>') + ': renvois les infos du champion\n ' + col.redBright('<build>') + ': renvois le build de la game du champion\n ' + col.redBright('<match>') + ': renvois les stats du matchup\n ' + col.redBright('<runes>') + ': renvois les runes du champion\n\nhelp <commande>: aide sur la commande donnée\n- Selon les commandes vous aurez à supprimer \nles espaces ou à les remplacer par des tirets'), { title: col.bold('Commandes disponibles') }));
    } else {
        switch (arg) {
            case 'count':
                console.log(box(col.bold('Syntaxe: count <champion> <lane>\nRenvois les counters du champion\nLanes: top, jgl, mid, adc, sup'), { title: col.bold('Commande Counter') }));
                break;
            case 'help':
                console.log(box(col.bold('Syntaxe: help [commande]\nRenvois les différentes commandes'), { title: col.bold('Commande Help') }));
                break;
            case 'runes':
                console.log(box(col.bold('Syntaxe: runes <champion> <lane>\nRenvois les runes du champion\nLanes: top, jgl, mid, adc, sup'), { title: col.bold('Commande Runes') }));
                break;
            case 'match':
                console.log(box(col.bold('Syntaxe: match <champion> <opposant>\nRenvois les stats du matchup'), { title: col.bold('Commande MatchUp') })); //-----
                break;
            case 'build':
                console.log(box(col.bold('Syntaxe: build <champion> <lane>\nRenvois le build de la game du champion\nLanes: top, jgl, mid, adc, sup'), { title: col.bold('Commande Build') }));
                break;
            case 'champ':
                console.log(box(col.bold('Syntaxe: champ <champion>\nRenvois les infos du champion'), { title: col.bold('Commande Champions') })); //-----
                break;
            case 'clear':
                console.log(box(col.bold('Syntaxe: clear\nEfface la console'), { title: col.bold('Commande Clear') }));
                break;
            case 'skill':
                console.log(box(col.bold('Syntaxe: skill <champion> <lane>\nRenvois l\'ordre des spells à prendre\nLanes: top, jgl, mid, adc, sup'), { title: col.bold('Commande Skill') }));
                break;
            case 'infos':
                console.log(box(col.bold('Syntaxe: infos\nInformations sur l\'app'), { title: col.bold('Commande Informations') }));
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
            $('img').each(function (index, element) {
                if (!$(element).parent().parent().attr('class')) return;
                let clas;
                try {clas = $(element).attr('class').split(' ')[1]}catch{};
                if ($(element).parent().parent().attr('class').includes('e1o8f101') && !$(element).parent().parent().attr('class').includes('css-6l0g7v')) {
                    tu.push($(element).attr('alt'));
                }else if(clas == 'e1gtrici1' && !$(element).attr('src').includes('grayscale')){
                    if ($(element).attr('src').includes('5008')) {
                        adap.push("Force adaptative");
                    } else if ($(element).attr('src').includes('5005')) {
                        adap.push("Vitesse d\'attaque");
                    } else if ($(element).attr('src').includes('5007')) {
                        adap.push("Accélération");
                    } else if ($(element).attr('src').includes('5002')) {
                        adap.push("Armure");
                    } else if ($(element).attr('src').includes('5003')) {
                        adap.push("Résistance magique");
                    } else {
                        adap.push("Vie selon le niveau");
                    }
                }
            })
            $('h5').each(function (index, element) {
                if ($(element).attr('class').includes('e1o8f100')) {
                    ru.push($(element).text());
                }
            })
            if (!tu[0]) {
                console.log(col.red.bold('Champion non reconnu'));
                return;
            }
            const data = [
                [ru[0], ru[1], 'Runes Stats'],
                [tu[0], tu[4], adap[0]],
                [tu[1], tu[5], adap[1]],
                [tu[2], 'Rien', adap[2]],
                [tu[3], 'Rien', 'Rien']
            ];
            console.log(table(data));
        })
        .catch(err => {
            console.log(col.red.bold('Champion non reconnu'))
        })
    await delay(4000);
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
                ['Objets de départ:', 'Objets principaux:', 'Objets de fin:'],
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
async function skill(arg, lane) {
    var url = `https://www.op.gg/champions/${arg}/${ligneop(lane)}/build?hl=fr_FR`
    axios.get(url)
        .then(res => {
            let html = res.data;
            const $ = load(html);
            let prio = [];
            let list = [];
            $('img').each(function (index, element) {
                let clas;
                try {clas = $(element).parent().parent().parent().attr('class').split(' ')[1]}catch{};
                if (clas == 'e80y3m3') {
                    prio.push($(element).attr('alt') + ' (' + $(element).parent().children().last().text() + ')');
                }
            })
            $('strong').each(function (index, element) {
                if ($(element).parent().attr('class') == 'css-vegv5g e80y3m6') {
                    list.push($(element).text());
                }
            })
            /*if (!prio[0]) {
                console.log(col.red.bold('Champion non reconnu'));
                return;
            }*/
            const data = [
                ['Priorité des spells:', prio.join(' > ')],
                ['Ordre des spells:', list.join(', ')]
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
async function infos() {
    console.log(box('Nom: ' + pack.name + '\nVersion: v' + pack.version + '\nAuteur: ' + pack.author + '\nAperçu: ' + pack.description, { title: 'Informations' }));
    await delay(3000);
    redemarrer();
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