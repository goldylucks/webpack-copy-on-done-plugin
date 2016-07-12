
// http://nodejs.org/api.html#_child_processes
const exec = require('child_process').exec;

// toCopy -> array with { src, target }
const buildToSignerPlugin = function (toCopy) {
  this.toCopy = toCopy
};

buildToSignerPlugin.prototype.puts = function (err, stdout, stderr) {
  console.log('\n\n****************************');
  if (err) {
    console.log('[SIGNER PLUGIN] error ', err);
    return;
  }
  console.log(`[SIGNER PLUGIN] copied ${this.src} to ${this.target}`);
  if (stdout) {
    console.log('[SIGNER PLUGIN] ', stdout);
  }
  console.log('****************************\n');
};

buildToSignerPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', this.onDone.bind(this));
};

buildToSignerPlugin.prototype.onDone = function (/* params */) {
  console.log('\n\n****************************');
  console.log('[SIGNER PLUGIN] WEBPACK DONE');
  console.log('****************************\n');
  this.toCopy.forEach(function(tc) {
    const cpJs = `cp -r ${tc.src} ${tc.target}`;
    exec(cpJs, this.puts.bind(this));
  })
};

module.exports = buildToSignerPlugin;
