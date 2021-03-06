'use strict';

var fs       = require('fs');
var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../../lib/index');
var jpeg     = require('../../lib/types/jpeg');

describe('jpeg', function () {

  describe('detect', function () {
    it('should return true for a JPEG', function () {
      var jpegPath = path.resolve(__dirname, '../fixtures/jpeg/123x456.jpg');
      var result = jpeg.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-JPEG', function () {
      var pdfPath = path.resolve(__dirname, '../fixtures/pdf/123x456.1.pdf');
      var result = jpeg.detect(fs.readFileSync(pdfPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var jpegPath = path.resolve(__dirname, '../fixtures/jpeg');
    var files = fs.readdirSync(jpegPath);

    files.forEach(function (file) {

      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'jpeg',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        return calipers.measure(path.resolve(jpegPath, file))
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        });
      });

    });

    it('should error with a corrupt JPEG', function () {
      var jpegPath = path.resolve(__dirname, '../fixtures/corrupt/corrupt.jpg');
      return expect(calipers.measure(jpegPath)).to.be.rejectedWith(Error);
    });

  });

});
