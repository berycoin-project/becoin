/*!
 * network.js - bitcoin networks for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

/**
 * @module protocol/networks
 */

var BN = require('bn.js');

var network = exports;
var main, testnet, regtest, simnet, bery;

/**
 * Network type list.
 * @memberof module:protocol/networks
 * @const {String[]}
 * @default
 */

network.types = ['main', 'testnet', 'regtest', 'simnet'];

/**
 * Mainnet
 * @static
 * @lends module:protocol/networks
 * @type {Object}
 */

main = network.main = {};

/**
 * Symbolic network type.
 * @const {String}
 * @default
 */

main.type = 'main';

/**
 * Default DNS seeds.
 * @const {String[]}
 * @default
 */

main.seeds = [
  'dnsseed.berycoin.com',
  'seed1.berycoin.com',
  'seed2.berycoin.com'
];

/**
 * Packet magic number.
 * @const {Number}
 * @default
 */

main.magic = 0xfdd33eac;

/**
 * Default network port.
 * @const {Number}
 * @default
 */

main.port = 9947;

/**
 * Checkpoint block list.
 * @const {Object}
 */

main.checkpointMap = {
  0: '62d4ee455f9850e354f5c85d42fba5852581877e032826dc07c0eb21545fff66'
};

/**
 * Last checkpoint height.
 * @const {Number}
 * @default
 */

main.lastCheckpoint = 0;

/**
 * @const {Number}
 * @default
 */

main.halvingInterval = 52631579;

/**
 * Genesis block header.
 * @const {NakedBlock}
 */

main.genesis = {
  version: 1,
  hash: '66ff5f5421ebc007dc2628037e87812585a5fb425dc8f554e350985f45eed462',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: 'f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc44309',
  ts: 1231006505,
  bits: 486604799,
  nonce: 722266,
  height: 0
};

/**
 * The network's genesis block in a hex string.
 * @const {String}
 */

main.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '00f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc443090c8d'
  + '805a00fd0f1e5a050b0001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4f04ffff001d0104475472756d70e2809973'
  + '20746f7567682074616c6b206d61792068656c702050616b697374616e206b65657020'
  + '746f702074616c656e7420466562727561727920352c2032303138ffffffff0100f8f3'
  + 'b11100000043410482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e'
  + '6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe456'
  + '49b4ac00000000';

/**
 * POW-related constants.
 * @enum {Number}
 * @default
 */

main.pow = {
  /**
   * Default target.
   * @const {BN}
   */

  limit: new BN(
    '00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),

  /**
   * Compact pow limit.
   * @const {Number}
   * @default
   */

  bits: 504364288,

  /**
   * Minimum chainwork for best chain.
   * @const {BN}
   */

  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  ),

  /**
   * Desired retarget period in seconds.
   * @const {Number}
   * @default
   */

  targetTimespan: 1.5 * 24 * 60 * 60,

  /**
   * Average block time.
   * @const {Number}
   * @default
   */

  targetSpacing: 1 * 60,

  /**
   * Retarget interval in blocks.
   * @const {Number}
   * @default
   */

  retargetInterval: 2160,

  /**
   * Whether to reset target if a block
   * has not been mined recently.
   * @const {Boolean}
   * @default
   */

  targetReset: false,

  /**
   * Do not allow retargetting.
   * @const {Boolean}
   * @default
   */

  noRetargeting: false
};

/**
 * Block constants.
 * @enum {Number}
 * @default
 */

main.block = {
  /**
   * Height at which bip34 was activated.
   * Used for avoiding bip30 checks.
   */

  bip34height: 0,

  /**
   * Hash of the block that activated bip34.
   */

  bip34hash: '66ff5f5421ebc007dc2628037e87812585a5fb425dc8f554e350985f45eed462',

  /**
   * Height at which bip65 was activated.
   */

  bip65height: 0,

  /**
   * Hash of the block that activated bip65.
   */

  bip65hash: '66ff5f5421ebc007dc2628037e87812585a5fb425dc8f554e350985f45eed462',

  /**
   * Height at which bip66 was activated.
   */

  bip66height: 0,

  /**
   * Hash of the block that activated bip66.
   */

  bip66hash: '66ff5f5421ebc007dc2628037e87812585a5fb425dc8f554e350985f45eed462',

  /**
   * Safe height to start pruning.
   */

  pruneAfterHeight: 1000,

  /**
   * Safe number of blocks to keep.
   */

  keepBlocks: 288,

  /**
   * Age used for the time delta to
   * determine whether the chain is synced.
   */

  maxTipAge: 24 * 60 * 60,

  /**
   * Height at which block processing is
   * slow enough that we can output
   * logs without spamming.
   */

  slowHeight: 900000
};

/**
 * Map of historical blocks which create duplicate transactions hashes.
 * @see https://github.com/bitcoin/bips/blob/master/bip-0030.mediawiki
 * @const {Object}
 * @default
 */

main.bip30 = {};

/**
 * For versionbits.
 * @const {Number}
 * @default
 */

main.activationThreshold = 6480; // 95% of 2016

/**
 * Confirmation window for versionbits.
 * @const {Number}
 * @default
 */

main.minerWindow = 8640; // nPowTargetTimespan / nPowTargetSpacing

/**
 * Deployments for versionbits.
 * @const {Object}
 * @default
 */

main.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 0, // January 1, 2008
    timeout: 7258118400, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0, // January 28, 2017
    timeout: 7258118400, // January 31st, 2018
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0, // January 28, 2017
    timeout: 7258118400, // January 31st, 2018
    force: false
  }
};

/**
 * Deployments for versionbits (array form, sorted).
 * @const {Array}
 * @default
 */

main.deploys = [
  main.deployments.csv,
  main.deployments.segwit,
  main.deployments.testdummy
];

/**
 * Key prefixes.
 * @enum {Number}
 * @default
 */

main.keyPrefix = {
  privkey: 0xd8,
  xpubkey: 0x0586c22e,
  xprivkey: 0x0586dcf1,
  xprivkey58: 'xprv',
  xpubkey58: 'xpub',
  coinType: 0
};

/**
 * {@link Address} prefixes.
 * @enum {Number}
 */

main.addressPrefix = {
  pubkeyhash: 0x19,
  scripthash: 0x33,
  witnesspubkeyhash: 0x06,
  witnessscripthash: 0x0a,
  bech32: 'lc'
};

/**
 * Default value for whether the mempool
 * accepts non-standard transactions.
 * @const {Boolean}
 * @default
 */

main.requireStandard = true;

/**
 * Default http port.
 * @const {Number}
 * @default
 */

main.rpcPort = 9432;

/**
 * Default min relay rate.
 * @const {Rate}
 * @default
 */

main.minRelay = 1000;

/**
 * Default normal relay rate.
 * @const {Rate}
 * @default
 */

main.feeRate = 100000;

/**
 * Maximum normal relay rate.
 * @const {Rate}
 * @default
 */

main.maxFeeRate = 400000;

/**
 * Whether to allow self-connection.
 * @const {Boolean}
 */

main.selfConnect = false;

/**
 * Whether to request mempool on sync.
 * @const {Boolean}
 */

main.requestMempool = false;

/*
 * Testnet (v3)
 * https://en.bitcoin.it/wiki/Testnet
 */

testnet = network.testnet = {};

testnet.type = 'testnet';

testnet.seeds = [
  'testnet.berycoin.com',
  'testnet.berycoin.org'
];

testnet.magic = 0x2cd5b2ac;

testnet.port = 19947;

testnet.checkpointMap = {
  0: 'b555ecadb2ce0529b0fb2b26552b12c94e8763679da28c7d3f32f4c1d8aa62c3',
};

testnet.lastCheckpoint = 0;

testnet.halvingInterval = 52631579;

testnet.genesis = {
  version: 1,
  hash: 'b555ecadb2ce0529b0fb2b26552b12c94e8763679da28c7d3f32f4c1d8aa62c3',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: 'f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc44309',
  ts: 1486949366,
  bits: 504365040,
  nonce: 3738177,
  height: 0
};

testnet.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '00f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc443090d92'
  + '805a00ff0a1e410a390001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4f04ffff001d0104475472756d70e2809973'
  + '20746f7567682074616c6b206d61792068656c702050616b697374616e206b65657020'
  + '746f702074616c656e7420466562727561727920352c2032303138ffffffff0100f8f3'
  + 'b11100000043410482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e'
  + '6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe456'
  + '49b4ac00000000';

testnet.pow = {
  limit: new BN(
    '00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 504037120,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  ),
  targetTimespan: 3.5 * 24 * 60 * 60,
  targetSpacing: 2.5 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

testnet.block = {
  bip34height: 0xffffffff,
  bip34hash: null,
  bip65height: 0,
  bip65hash: 'b555ecadb2ce0529b0fb2b26552b12c94e8763679da28c7d3f32f4c1d8aa62c3',
  bip66height: 0,
  bip66hash: 'b555ecadb2ce0529b0fb2b26552b12c94e8763679da28c7d3f32f4c1d8aa62c3',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 24 * 60 * 60,
  slowHeight: 950000
};

testnet.bip30 = {};

testnet.activationThreshold = 1512; // 75% for testchains

testnet.minerWindow = 2016; // nPowTargetTimespan / nPowTargetSpacing

testnet.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 0, // January 1, 2008
    timeout: 7258118400, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0, // January 1, 2017
    timeout: 7258118400, // January 31st, 2018
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0, // January 1, 2017
    timeout: 7258118400, // January 31st, 2018
    force: false
  }
};

testnet.deploys = [
  testnet.deployments.csv,
  testnet.deployments.segwit,
  testnet.deployments.testdummy
];

testnet.keyPrefix = {
  privkey: 0xe5,
  xpubkey: 0x053782bf,
  xprivkey: 0x053784a4,
  xpubkey58: 'tpub',
  xprivkey58: 'tprv',
  coinType: 1
};

testnet.addressPrefix = {
  pubkeyhash: 0x0b,
  scripthash: 0x6a,
  witnesspubkeyhash: 0x03,
  witnessscripthash: 0x28,
  bech32: 'tb'
};

testnet.requireStandard = false;

testnet.rpcPort = 19336;

testnet.minRelay = 1000;

testnet.feeRate = 20000;

testnet.maxFeeRate = 60000;

testnet.selfConnect = false;

testnet.requestMempool = false;

/*
 * Regtest
 */

regtest = network.regtest = {};

regtest.type = 'regtest';

regtest.seeds = [
  '127.0.0.1'
];

regtest.magic = 0xd1afbdaa;

regtest.port = 19447;

regtest.checkpointMap = {};
regtest.lastCheckpoint = 0;

regtest.halvingInterval = 150;

regtest.genesis = {
  version: 1,
  hash: 'eb1b2b497e5ffb35f40045d99da22f6cfe5c9f36fc671455c3b8d42b4f44a922',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: 'f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc44309',
  ts: 1296688602,
  bits: 545259519,
  nonce: 328258,
  height: 0
};

regtest.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '00f955d2a24dd052d9b6c61da3350fa240dab4bd466ef1e0b8170f65ae3bc443093799'
  + '805a441f0a1e4202050001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4f04ffff001d0104475472756d70e2809973'
  + '20746f7567682074616c6b206d61792068656c702050616b697374616e206b65657020'
  + '746f702074616c656e7420466562727561727920352c2032303138ffffffff0100f8f3'
  + 'b11100000043410482fae82061c1400ca141ccb3831ee91bbb054495b75bd13a44c83e'
  + '6bdff949eb69c76cce3d8957328cec83513f3a1f40d15b4f8a0dcbdd14555bdd3fe456'
  + '49b4ac00000000';

regtest.pow = {
  limit: new BN(
    '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    'hex'
  ),
  bits: 503979844,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000002',
    'hex'
  ),
  targetTimespan: 3.5 * 24 * 60 * 60,
  targetSpacing: 2.5 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: true
};

regtest.block = {
  bip34height: 0xffffffff,
  bip34hash: null,
  bip65height: 1351,
  bip65hash: null,
  bip66height: 1251,
  bip66hash: null,
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 0xffffffff,
  slowHeight: 0
};

regtest.bip30 = {};

regtest.activationThreshold = 108; // 75% for testchains

regtest.minerWindow = 144; // Faster than normal for regtest (144 instead of 2016)

regtest.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 0,
    timeout: 0xffffffff,
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0,
    timeout: 0xffffffff,
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0,
    timeout: 0xffffffff,
    force: false
  }
};

regtest.deploys = [
  regtest.deployments.csv,
  regtest.deployments.segwit,
  regtest.deployments.testdummy
];

regtest.keyPrefix = {
  privkey: 0x5a,
  xpubkey: 0xeab4fa05,
  xprivkey: 0xeab404c7,
  xpubkey58: 'rpub',
  xprivkey58: 'rprv',
  coinType: 1
};

regtest.addressPrefix = {
  pubkeyhash: 0x3c,
  scripthash: 0x26,
  witnesspubkeyhash: 0x7a,
  witnessscripthash: 0x14,
  bech32: 'rb'
};

regtest.requireStandard = false;

regtest.rpcPort = 19445;

regtest.minRelay = 1000;

regtest.feeRate = 20000;

regtest.maxFeeRate = 60000;

regtest.selfConnect = true;

regtest.requestMempool = true;

/*
 * Simnet (btcd)
 */

simnet = network.simnet = {};

simnet.type = 'simnet';

simnet.seeds = [
  '127.0.0.1'
];

simnet.magic = 0x12141c16;

simnet.port = 18555;

simnet.checkpointMap = {};

simnet.lastCheckpoint = 0;

simnet.halvingInterval = 210000;

simnet.genesis = {
  version: 1,
  hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  prevBlock: '0000000000000000000000000000000000000000000000000000000000000000',
  merkleRoot: '3ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a',
  ts: 1401292357,
  bits: 545259519,
  nonce: 2,
  height: 0
};

simnet.genesisBlock =
  '0100000000000000000000000000000000000000000000000000000000000000000000'
  + '003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a4506'
  + '8653ffff7f200200000001010000000100000000000000000000000000000000000000'
  + '00000000000000000000000000ffffffff4d04ffff001d0104455468652054696d6573'
  + '2030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66'
  + '207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01'
  + '000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f'
  + '61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f'
  + 'ac00000000';

simnet.pow = {
  limit: new BN(
    // High target of 0x207fffff (545259519)
    '7fffff0000000000000000000000000000000000000000000000000000000000',
    'hex'
  ),
  bits: 545259519,
  chainwork: new BN(
    '0000000000000000000000000000000000000000000000000000000000000002',
    'hex'
  ),
  targetTimespan: 3.5 * 24 * 60 * 60,
  targetSpacing: 2.5 * 60,
  retargetInterval: 2016,
  targetReset: true,
  noRetargeting: false
};

simnet.block = {
  bip34height: 0,
  bip34hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  bip65height: 0,
  bip65hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  bip66height: 0,
  bip66hash: 'f67ad7695d9b662a72ff3d8edbbb2de0bfa67b13974bb9910d116d5cbd863e68',
  pruneAfterHeight: 1000,
  keepBlocks: 10000,
  maxTipAge: 0xffffffff,
  slowHeight: 0
};

simnet.bip30 = {};

simnet.activationThreshold = 75; // 75% for testchains

simnet.minerWindow = 100; // nPowTargetTimespan / nPowTargetSpacing

simnet.deployments = {
  testdummy: {
    name: 'testdummy',
    bit: 28,
    startTime: 1199145601, // January 1, 2008
    timeout: 1230767999, // December 31, 2008
    force: true
  },
  csv: {
    name: 'csv',
    bit: 0,
    startTime: 0, // March 1st, 2016
    timeout: 0xffffffff, // May 1st, 2017
    force: true
  },
  segwit: {
    name: 'segwit',
    bit: 1,
    startTime: 0, // May 1st 2016
    timeout: 0xffffffff, // May 1st 2017
    force: false
  },
  mast: {
    name: 'mast',
    bit: 2,
    startTime: 0xffffffff, // Far in the future
    timeout: 0xffffffff,
    force: false
  }
};

simnet.deploys = [
  simnet.deployments.csv,
  simnet.deployments.segwit,
  simnet.deployments.mast,
  simnet.deployments.testdummy
];

simnet.keyPrefix = {
  privkey: 0x64,
  xpubkey: 0x0420bd3a,
  xprivkey: 0x0420b900,
  xpubkey58: 'spub',
  xprivkey58: 'sprv',
  coinType: 115
};

simnet.addressPrefix = {
  pubkeyhash: 0x3f,
  scripthash: 0x7b,
  witnesspubkeyhash: 0x19,
  witnessscripthash: 0x28,
  bech32: 'sc'
};

simnet.requireStandard = false;

simnet.rpcPort = 18556;

simnet.minRelay = 1000;

simnet.feeRate = 20000;

simnet.maxFeeRate = 60000;

simnet.selfConnect = false;

simnet.requestMempool = false;
