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

// See definitions here: https://gist.github.com/thebrandonlucas/fb4283bef3df51b88a85ae974488d81f
enum TxType {
  Standard = "Standard",
  Batch = "Batch",
  Payjoin = "Payjoin",
}

// Variables:
// b = base cost
// i = per input cost
// o = per output cost
// r = recipient count
// p = recipient input count (payjoin only)
// di = depositor input count (payjoin only)
// do = depositor output count (payjoin only)

// total tx cost without batching: r(b + i) + 2ro
// total tx cost with batching: b + i + ro + o
// total tx cost with payjoin: b + p(i) + di(i) + ro + do(o) + o
const totalCost = (b: number, i: number, o: number, r: number, type: TxType, p?: number, di?: number, _do?: number) => {
  switch (type) {
    case TxType.Standard:
      return r * (b +  i) + 2 * r * o;
    case TxType.Batch: 
      return b + i + r * o + o;
    case TxType.Payjoin: 
      if (!p || !di || !_do) {
        throw new Error("Payjoin requires recipient input count, depositor input count, and depositor output count");
      }
      return b + p * i + di * i + r * o + _do * o + o;
  }
}
 
 

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

function getVbytes(script: ScriptType, inputCount: number, outputCount: number, recipientCount: number, 
  type: TxType, payjoinRecipientInputCount?: number, depositorInputCount?: number, depositorOutputCount?: number) {
  const perInputCost = getPerInputCost(script) * inputCount;
  const perOutputCost = getPerOutputCost(script) * outputCount;
  const baseCost = getBaseCost(script);
  const vbytes = totalCost(baseCost, perInputCost, perOutputCost, recipientCount, type, payjoinRecipientInputCount, depositorInputCount, depositorOutputCount);
  console.log({ baseCost, perInputCost, perOutputCost, recipientCount, type, vbytes });

  return vbytes;
}

export function getVbytesForEachTxType(script: ScriptType, inputCount: number, outputCount: number, recipientCount: number, payjoinRecipientInputCount: number, depositorInputCount: number, depositorOutputCount: number) {
  const vbytesUnbatched = getVbytes(script, inputCount, outputCount, recipientCount, TxType.Standard);
  const vbytesBatched = getVbytes(script, inputCount, outputCount, recipientCount, TxType.Batch);
  const vbytesPayjoined = getVbytes(script, inputCount, outputCount, recipientCount, TxType.Payjoin, payjoinRecipientInputCount, depositorInputCount, depositorOutputCount);

  // console.log({vbytesBatched, vbytesUnbatched, vbytesPayjoined})
  return { vbytesBatched, vbytesUnbatched, vbytesPayjoined };
}