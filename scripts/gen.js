'use strict';

var BN = require('bn.js');
var util = require('../lib/utils/util');
var consensus = require('../lib/protocol/consensus');
var encoding = require('../lib/utils/encoding');
var TX = require('../lib/primitives/tx');
var Block = require('../lib/primitives/block');
var Script = require('../lib/script/script');
var Opcode = require('../lib/script/opcode');
var opcodes = Script.opcodes;
var main, testnet, regtest;

function createGenesisBlock(options) {
  var flags = options.flags;
  var script = options.script;
  var reward = options.reward;
  var tx, block;

  if (!flags) {
    flags = Buffer.from(
      'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks',
      'ascii');
  }

  if (!script) {
    script = Script.fromArray([
      Buffer.from('04678afdb0fe5548271967f1a67130b7105cd6a828e039'
        + '09a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c3'
        + '84df7ba0b8d578a4c702b6bf11d5f', 'hex'),
      opcodes.OP_CHECKSIG
    ]);
  }

  if (!reward)
    reward = 50 * consensus.COIN;

  tx = new TX({
    version: 1,
    flag: 1,
    inputs: [{
      prevout: {
        hash: encoding.NULL_HASH,
        index: 0xffffffff
      },
      script: [
        Opcode.fromNumber(new BN(486604799)),
        Opcode.fromPush(Buffer.from([4])),
        Opcode.fromData(flags)
      ],
      sequence: 0xffffffff
    }],
    outputs: [{
      value: reward,
      script: script
    }],
    locktime: 0
  });

  tx.inputs[0].script = Script.fromRaw(Buffer.from(
    '04ffff001d0104475472756d70e280997320746f7567682074616c6b206d61792068656'
    + 'c702050616b697374616e206b65657020746f702074616c656e742046656272756172'
    + '7920352c2032303138', 'hex'));

  block = new Block({
    version: options.version,
    prevBlock: encoding.NULL_HASH,
    merkleRoot: tx.hash('hex'),
    ts: options.ts,
    bits: options.bits,
    nonce: options.nonce,
    height: 0
  });

  block.addTX(tx);

  return block;
}

main = createGenesisBlock({
  version: 1,
  ts: 1518374156,
  bits: 504364288,
  nonce: 722266,
  flags: new Buffer(
    'Trump’s tough talk may help Pakistan keep top talent February 5, 2018',
    'ascii'),
  script: Script.fromArray([
    new Buffer('0482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe45649b4', 'hex'),
    opcodes.OP_CHECKSIG
  ])
});

testnet = createGenesisBlock({
  ts: 1518375437,
  nonce: 3738177,
  bits: 0x1e0aff00,
  version: 1,
  flags: new Buffer(
    'Trump’s tough talk may help Pakistan keep top talent February 5, 2018',
    'ascii'),
  script: Script.fromArray([
    new Buffer('0482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe45649b4', 'hex'),
    opcodes.OP_CHECKSIG
  ])
});

regtest = createGenesisBlock({
  ts: 1518377271,
  nonce: 328258,
  bits: 0x1e0a1f44,
  version: 1,
  flags: new Buffer(
    'Trump’s tough talk may help Pakistan keep top talent February 5, 2018',
    'ascii'),
  script: Script.fromArray([
    new Buffer('0482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe45649b4', 'hex'),
    opcodes.OP_CHECKSIG
  ])
});

util.log(main);
util.log('');
util.log(testnet);
util.log('');
util.log(regtest);
util.log('');
util.log('main hash: %s', main.hash('hex'));
util.log('main raw: %s', main.toRaw().toString('hex'));
util.log('');
util.log('testnet hash: %s', testnet.hash('hex'));
util.log('testnet raw: %s', testnet.toRaw().toString('hex'));
util.log('');
util.log('regtest hash: %s', regtest.hash('hex'));
util.log('regtest raw: %s', regtest.toRaw().toString('hex'));
util.log('');
