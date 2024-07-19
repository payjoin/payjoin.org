import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { processForm, ScriptType, } from "../utils/tx";
import { useEffect, useState } from "react";

export default function SavingsCalculator(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [inputScript, setInputScript] = useState<ScriptType>(ScriptType.P2WPKH); // we assume both inputs and outputs are of same script type
  const [inputCount, setInputCount] = useState<number>(1);
  const [outputCount, setOutputCount] = useState<number>(1);
  const [recipientCount, setRecipientCount] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

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
    processForm(inputScript, inputCount, outputCount, recipientCount);
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
              <button type="submit" disabled={isDisabled} onClick={handleSubmit}>Calculate</button><br/><br/><br/>
              {/* Transaction size in raw bytes: <span id="txBytes"></span><br/> */}
              Transaction size in virtual bytes: <span>{txVBytes}</span><br/>
              {/* Transaction size in weight units: <span id="txWeight"></span><br/><br/> */}
              {/* <p>Which size should you use for calculating fee estimates?<br/>
                Estimates should be in <a href="https://medium.com/@murchandamus/psa-wrong-fee-rates-on-block-explorers-48390cbfcc74">satoshis per virtual byte.</a></p> */}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
