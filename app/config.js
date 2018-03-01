const onServer = !!process.env["DYNO"];
const homeDir = process.env["HOME"];
const wasmceptionDir = process.env["WASMCEPTION"] ||
  (__dirname + '/../wasmception');

exports.sysroot = onServer ?
  homeDir + '/sysroot' :
  wasmceptionDir + '/sysroot';

exports.llvmDir = onServer ?
  homeDir + '/clang' :
  wasmceptionDir + '/dist';

exports.tempDir = "/tmp";
