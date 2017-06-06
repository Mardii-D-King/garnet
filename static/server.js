const Infoset = require ('./utils/infoset.js');
const API = require ('./utils/api.js');
const config = require ('./utils/configuration.js');

const http = require ('http');
const express = require ('express');
const httpProxy = require ('http-proxy');
const path = require ('path');

const proxy = httpProxy.createProxyServer ({});

const app = express ();

app.use (require ('morgan') ('short'));

(function initWebpack () {
  const webpack = require ('webpack');
  const webpackConfig = require ('./webpack/common.config');

  const compiler = webpack (webpackConfig);

  app.use (
    require ('webpack-dev-middleware') (compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    })
  );

  app.use (
    require ('webpack-hot-middleware') (compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  );

  app.use (express.static (path.join (__dirname, '/')));
}) ();

app.get ('/initial', (req, res) => {
  var idx_device = Infoset.idx_device ();
  var idx_agent = Infoset.idx_agent ();

  var data;
  data = API.get ('agents/' + idx_agent);

  return {
    agent: '1',
    idx_agent: '1',
  };
});

app.get ('/garnet/settings', (req, res) => {
  var idx_device = Infoset.idx_device ();
  var idx_agent = Infoset.idx_agent ();

  res.send (JSON.stringify (config.getConfig ()));
});

app.get ('/', (req, res) => {
  res.sendFile (path.join (__dirname, '/index.html'));
});

app.all (/^\/graph\/(.*)/, (req, res) => {
  proxy.web (req, res, {target: 'http://localhost:5000'});
});

app.all (/^\/datapoint\/(.*)/, (req, res) => {
  proxy.web (req, res, {target: 'http://localhost:5000'});
});

const server = http.createServer (app);
server.listen (process.env.PORT || 3000, () => {
  const address = server.address ();
  console.log ('Listening on: %j', address);
  console.log (' -> that probably means: http://localhost:%d', address.port);
});
