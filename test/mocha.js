const assert = require('assert');
const xml = require('..');

describe('string', function() {
  it('normalize', function() {
    const s = '1\n2\r3\r\n4\u00855\u20286\r\u00857\nặ';
    assert.equal(xml.normalize(s), '1\n2\n3\n4\n5\n6\n7\nặ');
  });
  it('row/column', function() {
    const x = new xml('\nabc\ndef');
    assert.equal(x.rc(1)[0], 1);
    assert.equal(x.rc(1)[1], 0);
  });
});
