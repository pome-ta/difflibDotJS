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
    let b2j;
    this.b2j = b2j = {};
    // this.b2j = b2j = new Object();
    // this.b2j = new Object();
    // const b2j = new Object();
    
    const b = this.b;
    Array.prototype.forEach(b, (elt) => {
      if (!b2j.hasOwnProperty(elt)) {
        b2j[elt] = [];
      }
      b2j[elt].push(i);
    })


    /*
    for (let i = 0; i < b.length; i++) {
      const elt = b[i];
      if (!b2j.hasOwnProperty(elt)) {
        b2j[elt] = [];
      }
      b2j[elt].push(i);

      // const indices = b2j.hasOwnProperty(elt) ? b2j[elt] : [];
      // indices.push(i);
    }
    */
    // Purge junk elements
    let junk;
    this.bjunk = junk = new Set();
    // this.bjunk = new Set();
    // const junk = new Set();
    const isjunk = this.isjunk;
    isjunk ? Object.keys(b2j).forEach((elt) => {
      isjunk(elt) ? junk.add(elt): null;
      for (const elt of junk) {
        // separate loop avoids separate list of keys
        delete b2j[elt];
      }
    }) : null;
    
    /*
    if (isjunk) {
      for (const elt of Object.keys(b2j)) {
        //isjunk(elt) ? junk.add(elt): null;
        if (isjunk(elt)) {
          junk.add(elt);
        }
      }
      for (const elt of junk) {
        // separate loop avoids separate list of keys
        delete b2j[elt];
      }
    }
    */
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
      (_junk) => this.bjunk.hasOwnProperty(_junk),
    ];
    ahi = ahi === null ? a.length : ahi;
    bhi = bhi === null ? b.length : bhi;
    let [besti, bestj, bestsize] = [alo, blo, 0];
    
    let j2len = {};
    const nothing = [];

    for (let i = alo; i < ahi; i++) {
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

    return [besti, bestj, bestsize];
  }

  get_matching_blocks() {
    if (this.matching_blocks !== null) {
      return this.matching_blocks;
    }
    const la = this.a.length;
    const lb = this.b.length;
    
    const queue = new Array([0, la, 0, lb]);
    const matching_blocks = [];
    
    while (queue?.length) {
      const [alo, ahi, blo, bhi] = queue.pop();
      const x = this.find_longest_match(alo, ahi, blo, bhi);
      const [i, j, k] = x;
      if (k) {
        matching_blocks.push(x);
        if (alo < i && blo < j) {
          queue.push([alo, i, blo, j]);
        }
        if (i + k < ahi && j + k < bhi) {
          queue.push([i + k, ahi, j + k, bhi]);
        }
      }
    }
    matching_blocks.sort();

    let [i1, j1, k1] = [0, 0, 0];
    const non_adjacent = [];
    
    for (const [i2, j2, k2] of matching_blocks) {
      if (i1 + k1 === i2 && j1 + k1 === j2) {
        k1 += k2;
      } else {
        if (k1) {
          non_adjacent.push([i1, j1, k1]);
        }
        [i1, j1, k1] = [i2, j2, k2];
      }
    }
    if (k1) {
      non_adjacent.push([i1, j1, k1]);
    }

    non_adjacent.push([la, lb, 0]);
    this.matching_blocks = non_adjacent;
    return this.matching_blocks;
  }

  get_opcodes() {
    if (this.opcodes !== null) {
      return this.opcodes;
    }
    let i, j, answer;
    i = j = 0;
    this.opcodes = answer = [];
    for (const [ai, bj, size] of this.get_matching_blocks()) {
      let tag = '';
      if (i < ai && j < bj) {
        tag = 'replace';
      } else if (i < ai) {
        tag = 'delete';
      } else if (j < bj) {
        tag = 'insert';
      }
      if (tag !== '') {
        answer.push([tag, i, ai, j, bj]);
      }
      [i, j] = [ai + size, bj + size];
      if (size) {
        answer.push(['equal', ai, i, bj, j]);
      }
    }
    return answer;
  }
}

const sm = new SequenceMatcher({
  isjunk: (x) => x.includes(' '),
  a: 'hoge hoge',
  b: 'fu ga hoge',
});
const o = sm.get_opcodes();

const x = 1;
console.log(o);

