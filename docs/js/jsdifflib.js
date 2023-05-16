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
    this.matching_blocks = this.opcodes = null;
    // this.opcodes = null;
    this.fullbcount = null;
    this.__chain_b();
  }

  __chain_b() {
    const b = this.b;
    let b2j;
    this.b2j = b2j = {};
    // this.b2j = b2j = new Object();
    // this.b2j = new Object();
    // const b2j = new Object();

    for (let i = 0; i < b.length; i++) {
      const elt = b[i];
      if (!b2j.hasOwnProperty(elt)) {
        b2j[elt] = [];
      }
      b2j[elt].push(i);

      // const indices = b2j.hasOwnProperty(elt) ? b2j[elt] : [];
      // indices.push(i);
    }
    // Purge junk elements
    let junk;
    this.bjunk = junk = new Set();
    // this.bjunk = new Set();
    // const junk = new Set();
    const isjunk = this.isjunk;
    if (isjunk) {
      for (const elt of Object.keys(b2j)) {
        if (isjunk(elt)) {
          junk.add(elt);
        }
      }
      for (const elt of junk) {
        // separate loop avoids separate list of keys
        delete b2j[elt];
      }
    }
    // Purge popular elements that are not junk
    let popular;
    this.bpopular = popular = new Set();
    // this.bpopular = new Set();
    // const popular = new Set();
    const n = b.length;
    if (this.autojunk && n >= 200) {
      const ntest = ((n / 100) | 0) + 1; // 切り捨て
      for (const [elt, idxs] of Object.entries(b2j)) {
        if (idxs.length > ntest) {
          popular.add(elt);
        }
      }
      for (const elt of popular) {
        // ditto; as fast for 1% deletion
        delete bj2[elt];
      }
    }
  }

  find_longest_match(alo = 0, ahi = null, blo = 0, bhi = null) {
    const [a, b, b2j, isbjunk] = [
      this.a,
      this.b,
      this.b2j,
      this.bjunk.hasOwnProperty,
    ];
    ahi = ahi === null ? a.length : ahi;
    bhi = bhi === null ? b.length : bhi;
    let [besti, bestj, bestsize] = [alo, blo, 0];
    const j2len = {};
    const nothing = [];

    for (let i = alo; i < ahi; i++) {
      // const j2lenget = j2len.hasOwnProperty
      const j2lenget = (s, d) => (j2len.hasOwnProperty(s) ? j2len[s] : d);
      const newj2len = {};
      for (const j of b2j.hasOwnProperty(a[i]) ? b2j[a[i]] : nothing) {
        if (j < blo) {
          continue;
        }
        if (j >= bhi) {
          break;
        }
        let k;
        k = newj2len[j] = j2lenget(j - 1, 0) + 1;
        if (k > bestsize) {
          [besti, bestj, bestsize] = [i - k + 1, j - k + 1, k];
        }
      }
      j2len = newj2len;
    }

    while (
      besti > alo &&
      bestj > blo &&
      !isbjunk(b[bestj - 1]) &&
      a[besti - 1] === b[bestj - 1]
    ) {
      [besti, bestj, bestsize] = [besti - 1, bestj - 1, bestsize + 1];
    }

    while (
      besti + bestsize < ahi &&
      bestj + bestsize < bhi &&
      !isbjunk(b[bestj + bestsize]) &&
      a[besti + bestsize] === b[bestj + bestsize]
    ) {
      bestsize += 1;
    }

    while (besti > alo && bestj > blo && isbjunk(b[bestj - 1])) {
      [besti, bestj, bestsize] = [besti - 1, bestj - 1, bestsize + 1];
    }
    while (
      besti + bestsize < ahi &&
      bestj + bestsize < bhi &&
      isbjunk(b[bestj + bestsize]) &&
      a[besti + bestsize] === b[bestj + bestsize]
    ) {
      bestsize = bestsize + 1;
    }
  }

  get_matching_blocks() {
    if (this.matching_blocks !== null) {
      return this.matching_blocks;
    }
    const la = this.a.length;
    const lb = this.b.length;
    const queue = [(0, la, 0, lb)];
    const matching_blocks = [];
    while (queue) {
      const [alo, ahi, blo, bhi] = queue.pop();
    }
  }

  get_opcodes() {
    if (this.opcodes !== null) {
      return this.opcodes;
    }
    let i, j, answer;
    i = j = 0;
    this.opcodes = answer = [];
  }
}

const sm = new SequenceMatcher({
  isjunk: (x) => x.includes(' '),
  a: 'hoge',
  b: 'fufg a',
});
console.log(sm);
