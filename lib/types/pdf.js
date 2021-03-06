'use strict';

var Promise         = require('bluebird');
var PopplerDocument = require('poppler-simple').PopplerDocument;
var utils           = require('../utils');

function isPDF (buffer) {
  return ('%PDF' === utils.ascii(buffer, 0, 4));
}

function measure (path, fd) {
  return new Promise(function (resolve, reject) {
    try {
      var doc = new PopplerDocument(path);

      if (doc.pageCount < 1) {
        return reject(new Error('Invalid PDF'));
      }

      var result = { type: 'pdf', pages: [] };

      for (var i = 1; i <= doc.pageCount; i++) {
        var page = doc.getPage(i);
        result.pages.push({
          width: page.width,
          height: page.height
        });
      }

      resolve(result);
    } catch(err) {
      reject(err);
    }
  });
}

module.exports = {
  detect: isPDF,
  measure: measure
};
