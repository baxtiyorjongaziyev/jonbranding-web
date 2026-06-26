const https = require('https');
https.get('https://api.github.com/repos/baxtiyorjongaziyev/jonbranding-web/commits/bd9c929/check-runs', { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      console.log('Checks: ', JSON.parse(data));
    } catch(e) { console.error('Error parsing Checks', e); }
  });
});
