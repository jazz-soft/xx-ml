function XML(s) {
}

XML.normalize = function(s) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\r\u0085/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u2028/g, '\n')
    .replace(/\u0085/g, '\n')
    .normalize();
}

module.exports = XML;
