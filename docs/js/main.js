import { SequenceMatcher } from './jsdifflib.js';

const sm = new SequenceMatcher({
  isjunk: (x) => x.includes(' '),
  a: 'hoge hoge',
  b: 'fu ga hoge',
});
const o = sm.get_opcodes();

const x = 1;
console.log(o);

