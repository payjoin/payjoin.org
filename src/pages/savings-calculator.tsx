import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { getVbytesForEachTxType, ScriptType, } from "../utils/tx";
import { useEffect, useState } from "react";
import BatchBar from "../components/Charts/BatchBar/bar";

export default function SavingsCalculator(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [inputScript, setInputScript] = useState<ScriptType>(ScriptType.P2WPKH); // we assume both inputs and outputs are of same script type
  const [inputCount, setInputCount] = useState<number>(1);
  const [outputCount, setOutputCount] = useState<number>(1);
  const [recipientCount, setRecipientCount] = useState<number>(1);
  const [payjoinRecipientInputCount, setPayjoinRecipientInputCount] = useState<number>(1);
  const [depositorInputCount, setDepositorInputCount] = useState<number>(1);
  const [depositorOutputCount, setDepositorOutputCount] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [unbatchedVbytes, setUnbatchedVbytes] = useState<number>(0);
  const [batchedVbytes, setBatchedVbytes] = useState<number>(0);
  const [payjoinVbytes, setPayjoinVbytes] = useState<number>(0);

  const scriptTypes = [
    { value: ScriptType.P2PKH, label: "P2PKH" },
    { value: ScriptType.P2WPKH, label: "P2WPKH" },
    { value: ScriptType.P2TR, label: "P2TR"}
  ]

  function isInvalid() {
    return [inputCount, outputCount, recipientCount].some((value) => isNaN(value) || value < 1);
  }

  function handleSubmit() {
    if (isInvalid()) {
      alert("Please enter a valid number greater than 0.");
      return;
    }
    const { vbytesUnbatched, vbytesBatched, vbytesPayjoined } = getVbytesForEachTxType(inputScript, inputCount, outputCount, recipientCount, payjoinRecipientInputCount, depositorInputCount, depositorOutputCount);
    setUnbatchedVbytes(vbytesUnbatched);
    setBatchedVbytes(vbytesBatched);
    setPayjoinVbytes(vbytesPayjoined);
  }

  useEffect(() => {
    setIsDisabled(isInvalid());
  }, [inputScript, inputCount, outputCount, recipientCount]);

  return (
    <Layout
      title={siteConfig.title}
      description="Payjoin Savings Calculator"
    >
      <div className="flex flex-col justify-center mx-24 items-center bg-red">
        <span>Payjoin provides a unique opportunity for receiver-side savings.</span>
        <div className="flex gap-12">
          <form role="form" action="javascript:void(0);">
            <div>
              <div>
                <div>
                  <label htmlFor="input_script">Input script type</label>
                  <div >
                    <select id="input_script" onChange={(e) => setInputScript(e.target.value as ScriptType)} value={inputScript}>
                      {scriptTypes.map((scriptType) => (
                        <option key={scriptType.value} value={scriptType.value}>{scriptType.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div >
                  <label>Number of inputs</label>
                  <div>
                    <input type="number" min={1} value={inputCount} onChange={(e) => setInputCount(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label>Number of outputs</label>
                  <div>
                    <input type="number" min={1} value={outputCount} onChange={(e) => setOutputCount(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label>Number of recipients</label>
                  <div>
                    <input type="number" min={1} value={recipientCount} onChange={(e) => setRecipientCount(parseInt(e.target.value))}  />
                  </div>
                </div>
                <div>
                  <label>Number of payjoin recipient inputs</label>
                  <div>
                    <input type="number" min={1} value={payjoinRecipientInputCount} onChange={(e) => setPayjoinRecipientInputCount(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label>Number of depositor inputs</label>
                  <div>
                    <input type="number" min={1} value={depositorInputCount} onChange={(e) => setDepositorInputCount(parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <label>Number of depositor outputs</label>
                  <div>
                    <input type="number" min={1} value={depositorOutputCount} onChange={(e) => setDepositorOutputCount(parseInt(e.target.value))} />
                  </div>
                </div>
                <button type="submit" disabled={isDisabled} onClick={handleSubmit}>Calculate</button><br/><br/><br/>
                {/* Transaction size in raw bytes: <span id="txBytes"></span><br/> */}
                Transaction size in virtual bytes without batching: <span>{unbatchedVbytes}</span><br/>
                Transaction size in virtual bytes with batching: <span>{batchedVbytes}</span><br/>
                Transaction size in virtual bytes with payjoin: <span>{payjoinVbytes}</span><br/>
                {/* Transaction size in weight units: <span id="txWeight"></span><br/><br/> */}
                {/* <p>Which size should you use for calculating fee estimates?<br/>
                  Estimates should be in <a href="https://medium.com/@murchandamus/psa-wrong-fee-rates-on-block-explorers-48390cbfcc74">satoshis per virtual byte.</a></p> */}
              </div>
            </div>
          </form>
          <div className="w-full h-full bg-red">
            <BatchBar unbatchedVbytes={unbatchedVbytes} batchedVbytes={batchedVbytes} payjoinVbytes={payjoinVbytes} />
          </div>
        </div>
     </div>
    </Layout>
  );
}
