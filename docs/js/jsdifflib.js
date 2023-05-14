class SequenceMatcher {
  constructor({ isjunk = null, a = '', b = '', autojunk = true } = {}) {
    this.isjunk = isjunk;
    this.a = null;
    this.b = null;
    this.autojunk = autojunk;
    this.set_seqs(a, b);
  }
  set_seqs(a, b) {
    this.set_seq1(a);
    this.set_seq2(b);
  }
  set_seq1(a) {
    if (Object.is(a, this.a)) {
      return;
    }
    this.a = a;
    this.matching_blocks = null;
    this.opcodes = null;
  }
  set_seq2(b) {
    if (Object.is(b, this.b)) {
      return;
    }
    this.b = b;
    this.matching_blocks = null;
    this.opcodes = null;
    this.fullbcount = null;
    this.__chain_b();
  }
  __chain_b() {
    const b = this.b;
    this.b2j = new Object();
    const b2j = new Object();

    for (let i = 0; i < b.length; i++) {
      const elt = b[i];
      const indices = b2j.hasOwnProperty(elt) ? b2j[elt] : [];
      indices.push(i);
    }

    this.bjunk = new Set();
    const junk = new Set();
    const isjunk = this.isjunk;
    if (isjunk) {
      for (const elt of Object.keys(bj2)) {
        if (isjunk(elt)) {
          junk.add(elt);
        }
      }
      for (const elt of junk) {
        delete b2j[elt];
      }
    }

    this.bpopular = new Set();
    const popular = new Set();
    const n = b.length;
    if (this.autojunk && n >= 200) {
      const ntest = n; // 100+1
      for (const [elt, idxs] of Object.entries(b2j)) {
        if (idxs.length > ntest) {
          popular.add(elt);
        }
      }
      for (const elt of popular) {
        delete bj2[elt];
      }
    }
  }
}

const sm = new SequenceMatcher({ a: 'hoge', b: 'fuga' });
