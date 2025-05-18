function XML(s) {
  this.txt = s;
  this.eol = _eol(s);
  this.frg = [];
  this.doc = { t: 'doc', a: [] };
  _parse(this.doc, this.txt);
}

XML.prototype.rc = function(n) { return rc(this.eol, n); };

function _parse(x, s, p) {
  p = p || 0;
  var n;
  var empty = true;
  for (n = p; n < s.length; n++) {
    if (s[n] == '<') break;
    if (empty && !_sp(s[n])) empty = false;
  }
  if (n > p) {
    x.a.push({ t: empty ? 'space' : 'txt', p: p, len: n - p });
  }
  p = n;
}

function _sp(c) { return c == ' ' || c == '\t' || c == '\n'; }

function _eol(s) {
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
