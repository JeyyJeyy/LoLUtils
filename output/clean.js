import { compile } from 'nexe';

compile({
    clean: true,
    target: { version: '16.14.0' }
}).then(() => {
    console.log('Compilation effectuée')
}).catch(e => {
    console.log(e);
});