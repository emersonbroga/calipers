'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read);
var types   = require('./types');

var DETECT_LENGTH = 16;

// Detects the type of file based on the buffer, and returns a handler
// capable of measuring the file type.
module.exports = function (fd) {
  return pread(fd, new Buffer(DETECT_LENGTH), 0, DETECT_LENGTH, 0)
  .spread(function (bytesRead, buffer) {
    for (var type in types) {
      var handler = types[type];
      if (handler.detect(buffer)) {
        return handler;
      }
    }
    throw new Error('File type not supported');
  });
};
