var internetAvailable = require("internet-available");

async function getNetworkInfo() {
  var info = {};
  await internetAvailable({
    port: 53,
    host: '114.114.114.114'
  }).then(() => {
    info['netAvailable'] = true;
  }).catch((e) => {
    info['netAvailable'] = false;
  });

  return info;
};


module.exports = { getNetworkInfo };