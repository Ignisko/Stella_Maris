const fs = require('fs');
fetch('https://www.miracolieucaristici.org/en/Liste/list.html')
  .then(r => r.text())
  .then(html => {
    const terms = ['Krak', 'Poznan', 'Middleburg', 'Cava', 'Damian', 'Alboraya', 'Alcal', 'Cebreiro', 'Joan de les'];
    terms.forEach(t => {
      const regex = new RegExp('<a[^>]+href="([^"]+)"[^>]*>([^<]+' + t + '[^<]*)</a>', 'i');
      const match = html.match(regex);
      if (match) {
        let href = match[1];
        let text = match[2].trim();
        // Construct perfect URL
        const ct = encodeURIComponent(text);
        const perfectUrl = 'https://www.miracolieucaristici.org/en/Liste/' + href + '&ct=' + ct;
        console.log(t, '->', perfectUrl);
      } else {
        console.log(t, 'not found');
      }
    });
  });
