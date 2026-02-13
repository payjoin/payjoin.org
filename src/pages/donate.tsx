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
            .donate-ring {
              position: relative;
              width: 312px;
              height: 312px;
              border-radius: 50%;
              border: 8px solid #f75394;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 48px 0;
              -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 312 312'%3E%3Cdefs%3E%3Cmask id='m'%3E%3Crect width='312' height='312' fill='white'/%3E%3Cline x1='295' y1='17' x2='17' y2='295' stroke='black' stroke-width='8'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='312' height='312' mask='url(%23m)'/%3E%3C/svg%3E");
              mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 312 312'%3E%3Cdefs%3E%3Cmask id='m'%3E%3Crect width='312' height='312' fill='white'/%3E%3Cline x1='295' y1='17' x2='17' y2='295' stroke='black' stroke-width='8'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='312' height='312' mask='url(%23m)'/%3E%3C/svg%3E");
              mask-size: 100% 100%;
              -webkit-mask-size: 100% 100%;
            }

            .donate-monad {
              position: relative;
              width: 280px;
              height: 280px;
              border-radius: 50%;
              overflow: hidden;
              -webkit-mask-image: radial-gradient(circle at center, transparent 16px, black 17px);
              mask-image: radial-gradient(circle at center, transparent 16px, black 17px);
            }

            .donate-form {
              position: absolute;
              width: 100%;
              height: 100%;
            }

            .donate-form-top {
              clip-path: polygon(0 0, 98% 0, 0 98%);
            }

            .donate-form-bottom {
              clip-path: polygon(100% 2%, 100% 100%, 2% 100%);
            }

            .donate-half {
              width: 100%;
              height: 100%;
              border: none;
              cursor: pointer;
              transition: filter 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
            }

            .donate-half-top {
              background: #f75394;
            }

            .donate-half-bottom {
              background: #d63a7a;
            }

            .donate-half:hover {
              filter: brightness(1.2);
            }

            .donate-half-label {
              color: #fff;
              font-weight: 600;
              text-align: center;
              line-height: 1.3;
              pointer-events: none;
              text-shadow: 0 1px 3px rgba(0,0,0,0.25);
              position: absolute;
            }

            .donate-form-top .donate-half-label {
              font-size: 16px;
              top: 25%;
              left: 18%;
            }

            .donate-form-bottom .donate-half-label {
              font-size: 16px;
              bottom: 25%;
              right: 18%;
            }

            .donate-half-sublabel {
              display: block;
              font-size: 11px;
              font-weight: 400;
              opacity: 0.8;
              margin-top: 3px;
            }

            @media (max-width: 480px) {
              .donate-ring { width: 280px; height: 280px; }
              .donate-monad { width: 230px; height: 230px; }
              .donate-form-top .donate-half-label,
              .donate-form-bottom .donate-half-label { font-size: 14px; }
              .donate-half-sublabel { font-size: 10px; }
            }
          `}</style>

          <div className="donate-ring">
            <div className="donate-monad">
              <form
                method="POST"
                action="https://btcpay.payjoin.org/apps/ChsF92PR6Bg5G6vprg2Mrigbjju/pos"
                target="_blank"
                className="donate-form donate-form-top"
              >
                <input type="hidden" name="redirectUrl" value="https://payjoin.org/thank-you" />
                <button type="submit" className="donate-half donate-half-top">
                  <span className="donate-half-label">
                    Tax-Deductible
                    <span className="donate-half-sublabel">receipt via email</span>
                  </span>
                </button>
              </form>

              <form
                method="POST"
                action="https://btcpay.payjoin.org/apps/2QGBRUqtx42txccW9kJZbCfZcd46/pos"
                target="_blank"
                className="donate-form donate-form-bottom"
              >
                <input type="hidden" name="redirectUrl" value="https://payjoin.org/thank-you" />
                <button type="submit" className="donate-half donate-half-bottom">
                  <span className="donate-half-label">
                    Anonymous
                    <span className="donate-half-sublabel">no info collected</span>
                  </span>
                </button>
              </form>
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
