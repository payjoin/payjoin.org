import Layout from "@theme/Layout";

export default function Mailroom(): JSX.Element {
  return (
    <Layout
      title="Infrastructure Partner Brief"
      description="Deploy lightweight, zero-custody infrastructure that strengthens Bitcoin privacy for everyone"
    >
      <style>{`
        .mr-page {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
          line-height: 1.7;
        }
        .mr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          border-bottom: 2px solid #f75394;
          margin-bottom: 3rem;
        }
        .mr-header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mr-header-left img {
          width: 32px;
          height: 32px;
        }
        .mr-header-left span {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fff;
        }
        .mr-header-right {
          font-size: 0.85rem;
          color: #888;
          font-style: italic;
        }
        .mr-hero {
          text-align: center;
          margin: 3rem 0 4rem;
        }
        .mr-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .mr-hero p {
          font-size: 1.15rem;
          color: #999;
          max-width: 600px;
          margin: 0 auto;
        }
        .mr-section {
          margin-bottom: 2.5rem;
        }
        .mr-section h2 {
          font-size: 1.4rem;
          color: #f75394;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #2a2a2a;
        }
        .mr-section p,
        .mr-section li {
          color: #ccc;
          font-size: 0.95rem;
        }
        .mr-section ul {
          padding-left: 1.5rem;
        }
        .mr-section li {
          margin-bottom: 0.75rem;
        }
        .mr-section strong {
          color: #e0e0e0;
        }
        .mr-section code {
          background: rgba(247, 83, 148, 0.1);
          color: #f75394;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          font-size: 0.88rem;
        }
        .mr-trust-box {
          background: rgba(247, 83, 148, 0.07);
          border-left: 4px solid #f75394;
          padding: 1.5rem 2rem;
          border-radius: 0 8px 8px 0;
          margin-top: 1rem;
        }
        .mr-trust-box h2 {
          border: none !important;
          padding: 0 !important;
          margin-top: 0;
        }
        .mr-trust-box p {
          margin-bottom: 0.5rem;
        }
        .mr-trust-box p:last-child {
          margin-bottom: 0;
        }
        .mr-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
        }
        .mr-table th {
          background: rgba(247, 83, 148, 0.15);
          color: #f75394;
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mr-table td {
          padding: 0.75rem 1rem;
          font-size: 0.93rem;
          color: #ccc;
          border-bottom: 1px solid #1a1a1a;
        }
        .mr-table tr:nth-child(odd) td {
          background: rgba(255, 255, 255, 0.03);
        }
        .mr-table tr:nth-child(even) td {
          background: rgba(255, 255, 255, 0.06);
        }
        .mr-table tr:last-child td {
          border-bottom: none;
        }
        .mr-faq-item {
          margin-bottom: 1.75rem;
        }
        .mr-faq-q {
          color: #e0e0e0 !important;
          font-weight: 600;
          margin-bottom: 0.25rem !important;
        }
        .mr-faq-a {
          color: #aaa !important;
        }
        .mr-cta {
          background: #f75394;
          color: #fff;
          padding: 2.5rem 2rem;
          border-radius: 8px;
          text-align: center;
          margin: 3rem 0;
        }
        .mr-cta h2 {
          color: #fff !important;
          border: none !important;
          font-size: 1.6rem;
          margin-bottom: 0.75rem;
          padding: 0 !important;
        }
        .mr-cta a {
          color: #fff;
          text-decoration: underline;
          font-weight: 600;
          font-size: 1.05rem;
        }
        .mr-cta p {
          color: rgba(255, 255, 255, 0.85) !important;
          margin-bottom: 0.5rem;
        }
        .mr-footer-brief {
          text-align: center;
          padding: 2rem 0;
          border-top: 1px solid #2a2a2a;
          color: #666;
          font-size: 0.85rem;
        }
        .mr-footer-brief a {
          color: #888;
        }
        @media (max-width: 640px) {
          .mr-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          .mr-hero h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="mr-page">
        <div className="mr-header">
          <div className="mr-header-left">
            <img src="/svg/monad.svg" alt="Payjoin" />
            <span>Payjoin Foundation</span>
          </div>
          <div className="mr-header-right">Infrastructure Partner Brief</div>
        </div>

        <div className="mr-hero">
          <h1>Run Payjoin Infrastructure</h1>
          <p>
            Deploy lightweight, zero-custody infrastructure that strengthens
            Bitcoin privacy for everyone
          </p>
        </div>

        <div className="mr-section">
          <h2>What Is Payjoin Mailroom?</h2>
          <p>
            <code>payjoin-mailroom</code> is a single, lightweight binary that
            bundles the two server-side roles required by Async Payjoin (<a href="https://github.com/bitcoin/bips/blob/master/bip-0077.md">BIP 77</a>):
          </p>
          <ul>
            <li>
              <strong>Payjoin Directory</strong>: a store-and-forward mailbox
              that holds small, ephemeral, end-to-end encrypted payloads so a
              sender and receiver can complete a payjoin asynchronously (they
              don't need to be online at the same time).
            </li>
            <li>
              <strong>OHTTP Relay</strong>: a simple HTTP proxy that separates
              client IP addresses from the directory, preventing the directory
              from correlating users with their network identity. No loopbacks
              between the relay and directory within the same instance.
            </li>
          </ul>
          <p>
            Together, these two components are the backbone that makes Async
            Payjoin work for <em>every</em> wallet.
          </p>
        </div>

        <div className="mr-section">
          <h2>Why Does This Matter?</h2>
          <p>
            Payjoin breaks the most damaging assumption in on-chain
            surveillance: that all inputs to a transaction belong to one person.
            By letting sender and receiver batch into a single transaction,
            payjoin makes chain analysis dramatically harder, and{" "}
            <strong>
              unlike mixing, Payjoin looks like any typical transaction.
            </strong>
          </p>
          <p>
            Async Payjoin removed the last barrier to adoption: receivers no longer
            need to run servers. But this convenience depends on directory and
            relay infrastructure existing. Today, only a small handful of
            operators run these services. A single point of failure is a single
            point of censorship.
          </p>
        </div>

        <div className="mr-section">
          <h2>Why Does It Matter Who Runs This?</h2>
          <p>
            Bitcoin privacy infrastructure works best when it's operated by
            entities that can sustain it long-term. The ideal operators are
            organizations with the resources, jurisdiction, and institutional
            will to keep infrastructure online: companies with legal counsel,
            organizations in privacy-respecting jurisdictions, and entities with
            a track record of supporting open-source infrastructure.
          </p>
          <p>
            We don't need a sprawling network of operators. Fewer directories
            means a larger anonymity set. The more users share a single
            directory, the harder traffic analysis becomes. But we do need{" "}
            <strong>a few more resilient operators</strong> for redundancy and
            resistance to censorship.
          </p>
        </div>

        <div className="mr-section">
          <div className="mr-trust-box">
            <h2>Trust Model: YOU SEE NOTHING</h2>
            <p>
              All Async Payjoin payloads are end-to-end encrypted with HPKE. The
              directory cannot read, forge, or correlate transaction contents.
              The OHTTP relay only sees encrypted blobs and never learns who is
              paying whom. No loopbacks between relay and directory roles.
            </p>
            <p>
              <strong>
                You never touch bitcoin. You never see transactions. Zero
                custody risk.
              </strong>
            </p>
          </div>
        </div>

        <div className="mr-section">
          <h2>What You Need</h2>
          <table className="mr-table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Server</strong>
                </td>
                <td>A $5/month VPS is sufficient. Minimal CPU and RAM.</td>
              </tr>
              <tr>
                <td>
                  <strong>Domain + TLS</strong>
                </td>
                <td>
                  A domain name with TLS. ACME is built in for automatic
                  certificate provisioning.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Storage</strong>
                </td>
                <td>
                  Very minimal. Only config details are persisted.
                  Payjoin payloads are ephemeral.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Deployment</strong>
                </td>
                <td>
                  Docker image, Nix flake, or build from source. Inline config
                  supported.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Bitcoin Node</strong>
                </td>
                <td>
                  <strong>Not required.</strong> Pure relay infrastructure. No
                  chain access needed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mr-section">
          <h2>FAQ</h2>

          <div className="mr-faq-item">
            <p className="mr-faq-q">
              Can the operator steal or censor bitcoin?
            </p>
            <p className="mr-faq-a">
              No. The service never holds keys, constructs transactions, or
              accesses a bitcoin node. Payloads are encrypted end-to-end.
              The worst an operator can do is go offline, in which case wallets
              automatically fall back to the typical (non-payjoin) transaction by using the address
              included in the Bitcoin URI. No funds are ever at risk.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">
              What is the service comparable to, architecturally?
            </p>
            <p className="mr-faq-a">
              Think of a CDN or encrypted email relay. You forward opaque,
              encrypted blobs between parties. You cannot inspect, modify, or
              correlate the contents. Even a fully compromised operator learns
              nothing useful.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">What about OFAC compliance?</p>
            <p className="mr-faq-a">
              payjoin-mailroom supports configurable IP address filtering for
              all requests regardless of protocol version. Async
              Payjoin sessions are encrypted end-to-end and opaque by design.
              For optional legacy v1 backwards-compatibility, where requests
              are plaintext, additional direct address screening is built in.
              Operators can enforce their own compliance policies without any
              changes to the protocol.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">What data does the operator see?</p>
            <p className="mr-faq-a">
              Aggregate metrics only: raw mailbox counts (roughly two per
              payjoin session). The operator doesn't see payload contents, Bitcoin
              addresses, or sender/receiver identity. OHTTP blinds client IP
              from the directory, and all payloads are encrypted end-to-end.
              This is less visibility than even Signal has running their own
              infrastructure, since Signal registers phone numbers and sees
              payload sizes. payjoin-mailroom does neither.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">Is there a revenue model?</p>
            <p className="mr-faq-a">
              Public-good infrastructure. Running a mailroom is a reputation
              signal that your organization takes Bitcoin privacy seriously. The
              spec includes optional DoS-prevention auth tokens for the future,
              but current load is minimal.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">
              Who uses this infrastructure today?
            </p>
            <p className="mr-faq-a">
              Bull Bitcoin (first mobile wallet with Async Payjoin send + receive),
              Cake Wallet, and the payjoin-cli reference implementation all
              depend on this infrastructure, with more integrations in progress.
              The flagship directory is payjo.in, with OHTTP relays run by a few
              community members.
            </p>
          </div>
        </div>

        <div className="mr-cta">
          <h2>Get Started</h2>
          <p>
            <a href="https://github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom">
              github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom
            </a>
          </p>
          <p>
            Questions? Reach out at{" "}
            <a href="https://payjoin.org">payjoin.org</a> or open a Discussion
            on{" "}
            <a href="https://github.com/payjoin/rust-payjoin/discussions">
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="mr-footer-brief">
          <a href="https://payjoin.org">payjoin.org</a>
          {" · "}
          <a href="https://github.com/payjoin/rust-payjoin">
            github.com/payjoin/rust-payjoin
          </a>
          {" · "}
          <a href="https://github.com/bitcoin/bips/blob/master/bip-0077.md">
            BIP 77
          </a>
        </div>
      </div>
    </Layout>
  );
}
