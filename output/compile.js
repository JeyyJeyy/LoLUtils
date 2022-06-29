import { compile } from 'nexe';

compile({
    input: '../index.js',
    output: 'LoL-Utils.exe',
    ico: 'icon.ico',
    loglevel: 'verbose',
    target: { version: '14.15.3' },
    rc: {
        CompanyName: "JeyJey",
        PRODUCTVERSION: "1,2,4",
        FILEVERSION: "1,2,4",
        FILEDESCRIPTION: "Un utilitaire pour LoL"
    },
}).then(() => {
    console.log('Compilation effectuée')
}).catch(e => {
    console.log(e);
});