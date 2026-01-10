const http = require('http');

// Test a route from the new seeded list: Warakapola -> Colombo (Route 001/2)
const url = 'http://localhost:3002/routes/search?start=Warakapola&end=Colombo';

console.log('Testing URL:', url);

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log('Routes Found:', json.length);
            if (json.length > 0) {
                console.log('First Route:', json[0].routeNumber, 'Path:', json[0].routePath);
            } else {
                console.log('No routes found.');
            }
        } catch (e) {
            console.error('Invalid JSON:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
