import Layout from "@theme/Layout";

export default function Donate(): JSX.Element {
  return (
    <Layout title="Donate" description="Support Payjoin Foundation">
      <div className="container margin-vert--lg">
        <div className="col col--8 col--offset-2">
          <h1>Donate</h1>
          <p>
            Payjoin Foundation is a 501(c)(3) nonprofit preserving privacy
            in peer-to-peer digital transactions.
          </p>

          <style>{`
            .donate-buttons { display: flex; gap: 16px; margin: 32px 0; flex-wrap: wrap; }
            .donate-option { display: flex; flex-direction: column; gap: 6px; }
            .donate-btn { padding: 14px 28px; background: var(--ifm-color-primary); color: #fff; border: none; border-radius: 8px; font-size: 17px; cursor: pointer; transition: opacity 0.2s; }
            .donate-btn:hover { opacity: 0.85; }
            .donate-hint { font-size: 13px; color: #888; margin: 0; }
          `}</style>

          <div className="donate-buttons">
            <div className="donate-option">
              <form
                method="POST"
                action="https://btcpay.payjoin.org/apps/ChsF92PR6Bg5G6vprg2Mrigbjju/pos"
                target="_blank"
              >
                <input type="hidden" name="redirectUrl" value="https://payjoin.org/thank-you" />
                <button type="submit" className="donate-btn">
                  Donate (Tax-Deductible)
                </button>
              </form>
              <p className="donate-hint">You'll provide name and email for your receipt</p>
            </div>

            <div className="donate-option">
              <form
                method="POST"
                action="https://btcpay.payjoin.org/apps/2QGBRUqtx42txccW9kJZbCfZcd46/pos"
                target="_blank"
              >
                <input type="hidden" name="redirectUrl" value="https://payjoin.org/thank-you" />
                <button type="submit" className="donate-btn">
                  Donate Anonymously
                </button>
              </form>
              <p className="donate-hint">No personal info collected, no receipt</p>
            </div>
          </div>

          <hr style={{ margin: "40px 0", borderColor: "#333" }} />

          <h2>Other ways to donate</h2>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:donate@payjoin.org">donate@payjoin.org</a>
          </p>
          <p>
            We can arrange wire transfers, checks, or other cryptocurrency
            donations. Reach out and we'll provide instructions.
          </p>
        </div>
      </div>
    </Layout>
  );
}
