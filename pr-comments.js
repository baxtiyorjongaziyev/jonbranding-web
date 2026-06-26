const https = require('https');
https.get('https://api.github.com/repos/baxtiyorjongaziyev/jonbranding-web/pulls?state=open', { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      console.log('PRs: ', JSON.parse(data).map(pr => pr.number));
    } catch(e) { console.error('Error parsing PRs', e); }
  });
});
