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
  while (p < s.length) {
    if (s[p] == '<') {
      if (s[p + 1] == '?') {
        p += _skip(s, p);
      }
      else if (s[p + 1] == '!') {
        p += _skip(s, p);
      }
      else if (s[p + 1] == '/') {
        p += _skip(s, p);
      }
      else {
        p += _tag(x, s, p);
      }
    }
    else {
      p += _txt(x, s, p);
    }
  }
  return p;
}

function _txt(x, s, p) {
  var n;
  var empty = true;
  for (n = p; n < s.length; n++) {
    if (s[n] == '<') break;
    if (empty && !_sp(s[n])) empty = false;
  }
  if (n > p) {
    x.a.push({ t: empty ? 'sp' : 'txt', b: p, e: n });
  }
  return n - p;
}

function _tag(x, s, p) {
  var tag = _name(s, p + 1);
  var n = p + tag.length;
  var t;
  while (true) {
    if (s[n] != '>') {
    //if (_sp(s[n])) {
      n++;
      continue;
    }
    else if (s[n] == '>') {
      n++;
      t = { t: 'tag', tag: tag, up: x, a: [] };
      x.a.push(t);
      _printtag(t);
    }
  }
  for (n = p; n < s.length; n++) {
    if (s[n] == '>') break;
  }
  console.log('TAG:', tag, s.substring(p, n + 1));
  return n - p + 1;
}

function _name(s, p) {
  var n = p;
  if (!_ns(s[n])) _bad(s, n);
  for (n++; _ns(s[n]) || _nc(s[n]); n++) ;
  if (!_sp(s[n]) && s[n] != '/' && s[n] != '>') _bad(s, n);
  return s.substring(p, n);
}

function _skip(s, p) {
  var n;
  for (n = p; n < s.length; n++) {
    if (s[n] == '>') break;
  }
  //console.log('SKIP:', s.substring(p, n + 1));
  return n - p + 1;
}

function _printtag(t) {
  var a = [];
  while (t.tag) {
    a.push(t.tag);
    t = t.up;
  }
  console.log(a.reverse().join(' > '));
}

function _bad(s, n) {
  throw ['unexpected character', n, s[n]];
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

function _ns(c) {
  c = c.charCodeAt(0);
  return c == 0x3a || c == 0x5f   // : _
    || c >= 0x41 && c <= 0x5a     // A-Z
    || c >= 0x61 && c <= 0x7a     // a-z
    || c >= 0xC0 && c <= 0xD6
    || c >= 0xD8 && c <= 0xF6
    || c >= 0xF8 && c <= 0x2FF
    || c >= 0x370 && c <= 0x37D
    || c >= 0x37F && c <= 0x1FFF
    || c >= 0x200C && c <= 0x200D
    || c >= 0x2070 && c <= 0x218F
    || c >= 0x2C00 && c <= 0x2FEF
    || c >= 0x3001 && c <= 0xD7FF
    || c >= 0xF900 && c <= 0xFDCF
    || c >= 0xFDF0 && c <= 0xFFFD
    || c >= 0x10000 && c <= 0xEFFFF;
}

function _nc(c) {
  c = c.charCodeAt(0);
  return c == 0x2d || c == 0x2e || c == 0xb7 // - . ·
    || c >= 0x30 && c <= 0x39       // 0-9
    || c >= 0x300 && c <= 0x36f     // Combining Diacritical Marks
    || c >= 0x203f && c <= 0x2040;  // ‿ ⁀
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
