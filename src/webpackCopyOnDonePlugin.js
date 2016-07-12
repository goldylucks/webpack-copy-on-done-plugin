
// http://nodejs.org/api.html#_child_processes
const exec = require('child_process').exec;

// toCopy -> array with { src, target }
const WebpackCopyOnDonePlugin = function (toCopy) {
  this.toCopy = toCopy
};

WebpackCopyOnDonePlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', this.onDone.bind(this));
};

WebpackCopyOnDonePlugin.prototype.onDone = function (/* params */) {
  var self = this;
  console.log('\n\n****************************');
  console.log('[SIGNER PLUGIN] WEBPACK DONE');
  console.log('****************************\n');
  this.toCopy.forEach(function(tc) {
    const cpJs = `cp -r ${tc.src} ${tc.target}`;
    exec(cpJs, self.onCopy(tc.src, tc.target));
  })
};

WebpackCopyOnDonePlugin.prototype.onCopy = function (src, target) {
  return function (err, stdout, stderr) {
    console.log('\n\n****************************');
    if (err) {
      console.log('[SIGNER PLUGIN] error ', err);
      return;
    }
    console.log(`[SIGNER PLUGIN] copied ${src} to ${target}`);
    if (stdout) {
      console.log('[SIGNER PLUGIN] ', stdout);
    }
    console.log('****************************\n');
  };
}

module.exports = WebpackCopyOnDonePlugin;
