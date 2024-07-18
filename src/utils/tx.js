const P2PKH_IN_SIZE = 148;
const P2PKH_OUT_SIZE = 34;

const P2SH_OUT_SIZE = 32;
const P2SH_P2WPKH_OUT_SIZE = 32;
const P2SH_P2WSH_OUT_SIZE = 32;

// All segwit input sizes are reduced by 1 WU to account for the witness item counts being added for every input per the transaction header
const P2SH_P2WPKH_IN_SIZE = 90.75;

const P2WPKH_IN_SIZE = 67.75;
const P2WPKH_OUT_SIZE = 31;

const P2WSH_OUT_SIZE = 43
const P2TR_OUT_SIZE = 43;

const P2TR_IN_SIZE = 57.25;

const PUBKEY_SIZE = 33;
const SIGNATURE_SIZE = 72;

function getSizeOfScriptLengthElement(length) {
  if (length < 75) {
    return 1;
  } else if (length <= 255) {
    return 2;
  } else if (length <= 65535) {
    return 3;
  } else if (length <= 4294967295) {
    return 5;
  } else {
    alert('Size of redeem script is too large');
  }
}

function getSizeOfVarInt(length) {
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

function getWitnessVbytes(input_script, input_count) {
  if (input_script == "P2PKH" || input_script == "P2SH") {
    var witness_vbytes = 0;
  } else { // Transactions with segwit inputs have extra overhead
    var witness_vbytes = 0.25                 // segwit marker
                      + 0.25                  // segwit flag
                      + input_count / 4;      // witness element count per input
  }

  return witness_vbytes;
}

function getTxOverheadVBytes(input_script, input_count, output_count) {
  return 4 // nVersion
        + getSizeOfVarInt(input_count) // number of inputs
        + getSizeOfVarInt(output_count) // number of outputs
        + 4 // nLockTime
        + getWitnessVbytes(input_script, input_count);
}

function getTxOverheadExtraRawBytes(input_script, input_count) {
  // Returns the remaining 3/4 bytes per witness bytes
  return getWitnessVbytes(input_script, input_count) * 3;
}

function getRedeemScriptSize(input_n) {
  return  1 + // OP_M
          input_n*(1 + PUBKEY_SIZE) + // OP_PUSH33 <pubkey>
          1 + // OP_N
          1; // OP_CHECKMULTISIG
}

function getScriptSignatureSize(input_m, redeemScriptSize) {
  return  1 + // size(0)
          input_m * (1 + SIGNATURE_SIZE) + // size(SIGNATURE_SIZE) + signature
          getSizeOfScriptLengthElement(redeemScriptSize) + redeemScriptSize;
}

export function processForm() {
  // Validate transaction input attributes
  var input_count = parseInt(document.getElementById('input_count').value);
  if (!Number.isInteger(input_count) || input_count < 0) {
    alert('expecting positive input count, got: ' + input_count);
    return;
  }
  var input_script = document.getElementById('input_script').value;
  var input_m = parseInt(document.getElementById('input_m').value);
  if (!Number.isInteger(input_m) || input_m < 0) {
    alert('expecting positive signature count');
    return;
  }
  var input_n = parseInt(document.getElementById('input_n').value);
  if (!Number.isInteger(input_n) || input_n < 0) {
    alert('expecting positive pubkey count');
    return;
  }

  // Validate transaction output attributes
  var p2pkh_output_count = parseInt(document.getElementById('p2pkh_output_count').value);
  if (!Number.isInteger(p2pkh_output_count) || p2pkh_output_count < 0) {
    alert('expecting positive p2pkh output count');
    return;
  }
  var p2sh_output_count = parseInt(document.getElementById('p2sh_output_count').value);
  if (!Number.isInteger(p2sh_output_count) || p2sh_output_count < 0) {
    alert('expecting positive p2sh output count');
    return;
  }
  var p2sh_p2wpkh_output_count = parseInt(document.getElementById('p2sh_p2wpkh_output_count').value);
  if (!Number.isInteger(p2sh_p2wpkh_output_count) || p2sh_p2wpkh_output_count < 0) {
    alert('expecting positive p2sh-p2wpkh output count');
    return;
  }
  var p2sh_p2wsh_output_count = parseInt(document.getElementById('p2sh_p2wsh_output_count').value);
  if (!Number.isInteger(p2sh_p2wsh_output_count) || p2sh_p2wsh_output_count < 0) {
    alert('expecting positive p2sh-p2wsh output count');
    return;
  }
  var p2wpkh_output_count = parseInt(document.getElementById('p2wpkh_output_count').value);
  if (!Number.isInteger(p2wpkh_output_count) || p2wpkh_output_count < 0) {
    alert('expecting positive p2wpkh output count');
    return;
  }
  var p2wsh_output_count = parseInt(document.getElementById('p2wsh_output_count').value);
  if (!Number.isInteger(p2wsh_output_count) || p2wsh_output_count < 0) {
    alert('expecting positive p2wsh output count');
    return;
  }
  var p2tr_output_count = parseInt(document.getElementById('p2tr_output_count').value);
  if (!Number.isInteger(p2tr_output_count) || p2tr_output_count < 0) {
    alert('expecting positive p2tr output count');
    return;
  }

  const output_count = p2pkh_output_count + p2sh_output_count + p2sh_p2wpkh_output_count
                      + p2sh_p2wsh_output_count + p2wpkh_output_count + p2wsh_output_count + p2tr_output_count;

  // In most cases the input size is predictable. For multisig inputs we need to perform a detailed calculation
  var inputSize = 0; // in virtual bytes
  var inputWitnessSize = 0;
  switch (input_script) {
    case "P2PKH":
      inputSize = P2PKH_IN_SIZE;
      break;
    case "P2SH-P2WPKH":
      inputSize = P2SH_P2WPKH_IN_SIZE;
      inputWitnessSize = 107; // size(signature) + signature + size(pubkey) + pubkey
      break;
    case "P2WPKH":
      inputSize = P2WPKH_IN_SIZE;
      inputWitnessSize = 107; // size(signature) + signature + size(pubkey) + pubkey
      break;
    case "P2TR": // Only consider the cooperative taproot signing path; assume multisig is done via aggregate signatures
      inputSize = P2TR_IN_SIZE;
      inputWitnessSize = 65; // getSizeOfVarInt(schnorrSignature) + schnorrSignature;
      break;
    case "P2SH":
      var redeemScriptSize = getRedeemScriptSize(input_n);
      var scriptSigSize = getScriptSignatureSize(input_m, redeemScriptSize);
      inputSize = 32 + 4 + getSizeOfVarInt(scriptSigSize) + scriptSigSize + 4;
      break;
    case "P2SH-P2WSH":
    case "P2WSH":
      var redeemScriptSize = getRedeemScriptSize(input_n);
      inputWitnessSize = getScriptSignatureSize(input_m, redeemScriptSize);
      inputSize = 36 + // outpoint (spent UTXO ID)
                  inputWitnessSize / 4 + // witness program
                  4;  // nSequence
      if (input_script == "P2SH-P2WSH") {
        inputSize += 32 + 3; // P2SH wrapper (redeemscript hash) + overhead?
      }
  }

  var txVBytes = getTxOverheadVBytes(input_script, input_count, output_count) +
              inputSize * input_count +
              P2PKH_OUT_SIZE * p2pkh_output_count +
              P2SH_OUT_SIZE * p2sh_output_count +
              P2SH_P2WPKH_OUT_SIZE * p2sh_p2wpkh_output_count +
              P2SH_P2WSH_OUT_SIZE * p2sh_p2wsh_output_count +
              P2WPKH_OUT_SIZE * p2wpkh_output_count +
              P2WSH_OUT_SIZE * p2wsh_output_count +
              P2TR_OUT_SIZE * p2tr_output_count;
  txVBytes = Math.ceil(txVBytes);

  var txBytes = getTxOverheadExtraRawBytes(input_script, input_count) + txVBytes + (inputWitnessSize * input_count) * 3 / 4;
  var txWeight = txVBytes * 4;

  document.getElementById('txBytes').innerHTML = txBytes;
  document.getElementById('txVBytes').innerHTML = txVBytes;
  document.getElementById('txWeight').innerHTML = txWeight;
}