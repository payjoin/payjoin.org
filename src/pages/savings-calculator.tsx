import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import { processForm, } from "../utils/tx";

export default function SavingsCalculator(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Payjoin Savings Calculator"
    >
      <div className="flex flex-col justify-center mx-24 items-center bg-red">
        <span>Payjoin provides a unique opportunity for receiver-side savings.</span>
        <form role="form" action="javascript:void(0);">
          <div>
            <div className="col-sm-2">
            </div>
            <div className="col-sm-10">
              <p>This calculator will give you the upper bound of the size of a transaction with specific characteristics. The size could be a few bytes smaller due to signature randomness, but it's unpredictable and you should err on the side of caution to avoid creating transactions that don't get relayed due to paying fees below the standard minimum rate.</p>
              <p>If you want to understand how the calculation gets broken down, check out the explanation on the <a href="https://bitcoinops.org/en/tools/calc-size">Bitcoin Optech Calculator</a></p>
            </div>
          </div>
          <div>
            <label className="col-sm-2"></label>
            <div className="col-sm-10">
              <div className="form-group row">
                <h4>What are the attributes of the bitcoin transaction?</h4>
                <label htmlFor="input_count" className="col-sm-4 col-form-label">Number of inputs</label>
                <div className="col-sm-2">
                  <input type="text" id="input_count" className="format form-control" value={1} maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="input_script" className="col-sm-4 col-form-label">Input script type</label>
                <div className="col-sm-3">
                  <select id="input_script" className="format form-control">
                    <option value="P2PKH" selected>P2PKH</option>
                    <option value="P2SH">P2SH</option>
                    <option value="P2SH-P2WPKH">P2WPKH in P2SH</option>
                    <option value="P2SH-P2WSH">P2WSH in P2SH</option>
                    <option value="P2WPKH">P2WPKH</option>
                    <option value="P2WSH">P2WSH</option>
                    <option value="P2TR">P2TR</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="input_m" className="col-sm-4 col-form-label">Signatures per input</label>
                <div className="col-sm-2">
                  <input type="text" id="input_m" className="format form-control" value="1" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="input_n" className="col-sm-4 col-form-label">Pubkeys per input</label>
                <div className="col-sm-2">
                  <input type="text" id="input_n" className="format form-control" value="1" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2pkh_output_count" className="col-sm-4 col-form-label">P2PKH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2pkh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2sh_output_count" className="col-sm-4 col-form-label">P2SH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2sh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2sh_p2wpkh_output_count" className="col-sm-4 col-form-label">P2WPKH in P2SH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2sh_p2wpkh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2sh_p2wsh_output_count" className="col-sm-4 col-form-label">P2WSH in P2SH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2sh_p2wsh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2wpkh_output_count" className="col-sm-4 col-form-label">P2WPKH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2wpkh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2wsh_output_count" className="col-sm-4 col-form-label">P2WSH outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2wsh_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="p2tr_output_count" className="col-sm-4 col-form-label">P2TR outputs</label>
                <div className="col-sm-2">
                  <input type="text" id="p2tr_output_count" className="format form-control" value="0" maxLength={5} size={5} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => {processForm(); return false;}}>Calculate</button><br/><br/><br/>
              Transaction size in raw bytes: <span id="txBytes"></span><br/>
              Transaction size in virtual bytes: <span id="txVBytes"></span><br/>
              Transaction size in weight units: <span id="txWeight"></span><br/><br/>
              <p>Which size should you use for calculating fee estimates?<br/>
                Estimates should be in <a href="https://medium.com/@murchandamus/psa-wrong-fee-rates-on-block-explorers-48390cbfcc74">satoshis per virtual byte.</a></p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
