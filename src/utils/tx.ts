const P2PKH_IN_SIZE = 148;
const P2PKH_OUT_SIZE = 34;
const P2WPKH_IN_SIZE = 67.75;
const P2WPKH_OUT_SIZE = 31;
const P2TR_OUT_SIZE = 43;
const P2TR_IN_SIZE = 57.25;

export enum ScriptType {
  P2PKH = "P2PKH",
  P2WPKH = "P2WPKH",
  P2TR = "P2TR",
}

function getSizeOfVarInt(length: number) {
  if (length < 253) {
    return 1;
  } else if (length < 65535) {
    return 3;
  } else if (length < 4294967295) {
    return 5;
  } else if (length < 18446744073709551615) {
    return 9;
  } else {
    alert("Invalid var int");
  }
}

function getWitnessVbytes(inputScript: ScriptType, inputCount: number) {
  let witnessVBytes = 0;
  if (inputScript !== ScriptType.P2PKH) {
     // Transactions with segwit inputs have extra overhead
    witnessVBytes = 0.25                 // segwit marker
                      + 0.25                  // segwit flag
                      + inputCount / 4;      // witness element count per input
  }
  return witnessVBytes;
}

function getTxOverheadVBytes(inputScript: ScriptType, inputCount: number, outputCount: number, recipientCount: number) {
  return 4 // nVersion
        + getSizeOfVarInt(inputCount) // number of inputs
        + getSizeOfVarInt(outputCount) // number of outputs
        + 4 // nLockTime
        + getWitnessVbytes(inputScript, inputCount);
}

// function getTxOverheadExtraRawBytes(inputScript, inputCount) {
//   // Returns the remaining 3/4 bytes per witness bytes
//   return getWitnessVbytes(inputScript, inputCount) * 3;
// }

function calculateTxVBytesNoBatching(inputScript: ScriptType, inputCount: number, outputCount: number, recipientCount: number, inputSize: number, inputWitnessSize: number) {
   // per tx cost without batching: r𝑏 + r𝑖 + 2r𝑜 + 1
  const b = getTxOverheadVBytes(inputScript, inputCount, outputCount, recipientCount);
  const i = inputCount * getTxOverheadVBytes(inputScript, 1, 0, 1);
  const o = outputCount * getTxOverheadVBytes(inputScript, 0, 1, 1);
  const r = recipientCount;
  const txVBytes = r * b + r * i + 2 * r * o + 1;
  return Math.ceil(txVBytes);
}

function calculateTxVBytesBatching(inputScript: ScriptType, inputCount: number, outputCount: number, recipientCount: number, inputSize: number, inputWitnessSize: number) {
    // total tx cost with batching: 𝑏 + 𝑖 + r𝑜 + 1
  const b = getTxOverheadVBytes(inputScript, inputCount, outputCount, recipientCount);
  const i = inputCount * getTxOverheadVBytes(inputScript, inputCount, 0, 1) + inputSize + inputWitnessSize;
  const o = outputCount * getTxOverheadVBytes(inputScript, 0, 1, 1);
  const r = recipientCount;
  const txVBytes = b + i + r * o + 1;
  return Math.ceil(txVBytes);
}

export function processForm() {
  const scriptType = (document.getElementById('input_script') as HTMLInputElement).value as ScriptType; // assuming both inputs and outputs are of same script type
  const inputCount = parseInt((document.getElementById('input_count') as HTMLInputElement).value);
  const outputCount = parseInt((document.getElementById('output_count') as HTMLInputElement).value);
  const recipientCount = parseInt((document.getElementById('recipient_count') as HTMLInputElement).value);

  // In most cases the input size is predictable. For multisig inputs we need to perform a detailed calculation
  let inputSize = 0; // in virtual bytes
  let inputWitnessSize = 0;
  switch (scriptType) {
    case ScriptType.P2PKH:
      inputSize = P2PKH_IN_SIZE;
      break;
    case ScriptType.P2WPKH:
      inputSize = P2WPKH_IN_SIZE;
      inputWitnessSize = 107; // size(signature) + signature + size(pubkey) + pubkey
      break;
    case ScriptType.P2TR: // Only consider the cooperative taproot signing path; assume multisig is done via aggregate signatures
      inputSize = P2TR_IN_SIZE;
      inputWitnessSize = 65; // getSizeOfVarInt(schnorrSignature) + schnorrSignature;
      break;
  }

  const txVBytes = calculateTxVBytesNoBatching(scriptType, inputCount, outputCount, recipientCount, inputSize, inputWitnessSize);

  // const txBytes = getTxOverheadExtraRawBytes(inputScript, inputCount) + txVBytes + (inputWitnessSize * inputCount) * 3 / 4;
  // const txWeight = txVBytes * 4;
  // document.getElementById('txBytes').innerHTML = txBytes;
  document.getElementById('txVBytes').innerHTML = String(txVBytes);
  // document.getElementById('txWeight').innerHTML = txWeight;
}