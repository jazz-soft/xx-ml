function XML(s) {
  this.txt = s;
  this.eol = linebreaks(s);
  this.frg = [];
}

XML.prototype.rc = function(n) { return rc(this.eol, n); };

function linebreaks(s) {
  var a = [0];
  for (var n = 0; n < s.length; n++) if (s[n] == '\n') a.push(n + 1);
  return a;
}

function rc(a, n) {
  var r, c;
  for (r = 0; r < a.length; r++) if (a[r] > n) break;
  r--;
  return [r, n - a[r]];
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
