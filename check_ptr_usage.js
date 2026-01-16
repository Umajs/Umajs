const { pathToRegexp } = require('path-to-regexp');
try {
    const keys = [];
    const result = pathToRegexp('/user/:id', keys);
    console.log('Result type:', typeof result);
    console.log('Result:', result);
    console.log('Keys:', keys);
} catch (e) {
    console.error('Error:', e.message);
}

try {
    const result2 = pathToRegexp('/user/:id');
    console.log('Result2:', result2);
} catch (e) {
    console.error('Error2:', e.message);
}
