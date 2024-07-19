// From: https://bitcoinops.org/en/tools/calc-size/
const P2PKH_IN_SIZE = 148;
const P2PKH_OUT_SIZE = 34;
const P2PKH_OVERHEAD = 10;
const P2WPKH_IN_SIZE = 68;
const P2WPKH_OUT_SIZE = 31;
const P2WPKH_OVERHEAD = 10.5;
const P2TR_IN_SIZE = 57.5;
const P2TR_OUT_SIZE = 43;
const P2TR_OVERHEAD = 10.5;

export enum ScriptType {
  P2PKH = "P2PKH",
  P2WPKH = "P2WPKH",
  P2TR = "P2TR",
}

// total tx cost without batching: r𝑏 + r𝑖 + r𝑜
// total tx cost with batching: 𝑏 + 𝑖 + r𝑜
const totalCost = (b: number, i: number, o: number, r: number, isBatching = false) => 
  isBatching 
    ? b + i + r * o
    : r * b + r * i + r * o;

// TODO: payjoin recipient/cut-through formula

function getBaseCost(inputScript: ScriptType) {
  switch (inputScript) {
    case ScriptType.P2PKH:
      return P2PKH_OVERHEAD;
    case ScriptType.P2WPKH:
      return P2WPKH_OVERHEAD;
    case ScriptType.P2TR:
      return P2TR_OVERHEAD;
  }
}

function getPerInputCost(inputScript: ScriptType) {
  switch (inputScript) {
    case ScriptType.P2PKH:
      return P2PKH_IN_SIZE;
    case ScriptType.P2WPKH:
      return P2WPKH_IN_SIZE;
    case ScriptType.P2TR:
      return P2TR_IN_SIZE;
  }
}

function getPerOutputCost(inputScript: ScriptType) {
  switch (inputScript) {
    case ScriptType.P2PKH:
      return P2PKH_OUT_SIZE;
    case ScriptType.P2WPKH:
      return P2WPKH_OUT_SIZE;
    case ScriptType.P2TR:
      return P2TR_OUT_SIZE;
  }
}

function getVbytes(script: ScriptType, inputCount: number, outputCount: number, recipientCount: number, isBatching: boolean) {
  const perInputCost = getPerInputCost(script) * inputCount;
  const perOutputCost = getPerOutputCost(script) * outputCount;
  const baseCost = getBaseCost(script);
  const vbytes = totalCost(baseCost, perInputCost, perOutputCost, recipientCount, isBatching);
  console.log({ baseCost, perInputCost, perOutputCost, recipientCount, isBatching, vbytes });

  return vbytes;
}

export function getUnbatchedAndBatchedVbytes(script: ScriptType, inputCount: number, outputCount: number, recipientCount: number) {
  const vbytesUnbatched = getVbytes(script, inputCount, outputCount, recipientCount, false);
  const vbytesBatched = getVbytes(script, inputCount, outputCount, recipientCount, true);

  console.log({vbytesBatched, vbytesUnbatched})
  return { vbytesBatched, vbytesUnbatched };
}