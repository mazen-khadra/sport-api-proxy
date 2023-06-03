const http      = require('http');
const httpProxy = require('http-proxy');
const proxy     = httpProxy.createProxyServer({});
const fs = require('fs');

proxy.on('proxyRes', require('./score-api-handler'));

http.createServer(function(req, res) {

  let url = req.url;
  let selfHandleResponse = false;
  let target = 'http://77577.live';
  let bbsIndx = url.indexOf('/bbs')
  let localFIndx = url.indexOf('/ffapi')
  let app8Index = url.indexOf('/app8');
  let xnIndex = url.indexOf('/xn');
  let challengSportIndex = url.indexOf('/challenges-sport');
  let sportScoreIndx = url.indexOf('/api/v1/sportscore');

  
  if(url == '/') {
    res.writeHead(404).end();
    return;
  }

  else if(url == '/api/sc/player/details') {   
    req.on("data", data => {
      data = data.toString();
      try {data = JSON.parse(data);} catch(er) {};
      if(!data || !data.slug) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(fs.readFileSync(`${__dirname}/resources/data/player-details.json`));
    });    
    return;
  }
  
  else if(url == '/api/sc/players') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(fs.readFileSync(`${__dirname}/resources/data/players.json`));
    return;
  }

  else if(bbsIndx > -1) {
    url = url.substring(0, bbsIndx) + url.substring(bbsIndx + 4);
    target = 'http://bbs.77577.live';
    req.url = url;
  }

  else if(localFIndx > -1) {
    target = 'http://199.241.1.88'
    req.url += '.php';
  }

  else if(app8Index > -1) {
    url = url.substring(0, app8Index) + url.substring(app8Index + 5) + '.php';
    target = 'http://app.8com.cloud';
    req.url = url;
  }

  else if(xnIndex > -1) {
    url = url.substring(0, xnIndex) + url.substring(xnIndex + 3);
    target = 'https://xn--8868-3m6f282x.com';
    req.url = url;
  }

  else if(challengSportIndex > -1) {
    url = url.substring(0, challengSportIndex) + url.substring(challengSportIndex + 17);
    target = 'http://localhost:5053';
    req.url = url + '.php';
  }

  else if(url && url.substring(url.length - 2) === 'ph') {
    req.url += 'p';
    target = 'http://app.8com.cloud';
  }

  else if(url && url.substring(url.length - 3) === '.tj') {
    req.url = req.url.replace('.tj', '.php');
    target = 'https://tj.77577.com';
  }

  else if(url && url.substring(url.length - 3) === '.c8') {
    req.url = req.url.replace('.c8', '.php');
    target = 'https://c.886811.fun';
  }

  console.log(target + req.url);
  
  if(sportScoreIndx > -1) {
    selfHandleResponse = true;
    req.body = [];
    req.on("data", data => {req.body.push(data);});
  }
  
  proxy.web(req, res, { 
    target,
    changeOrigin: true,
    followRedirects: true,
    selfHandleResponse
  });
}).listen(5051, () => {
  console.log("Waiting for requests...");
});