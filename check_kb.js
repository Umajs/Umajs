const kb = require('koa-body');
console.log('Keys:', Object.keys(kb));
console.log('Type of kb:', typeof kb);
try {
    const fn = kb();
    console.log('kb() returns:', typeof fn);
} catch(e) {
    console.log('kb() error:', e.message);
}

if (kb.koaBody) {
    console.log('kb.koaBody type:', typeof kb.koaBody);
}
