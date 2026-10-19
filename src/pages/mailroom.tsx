import Layout from "@theme/Layout";

export default function Mailroom(): JSX.Element {
  return (
    <Layout
      title="Payjoin Mailroom"
      description="The Payjoin mailroom operators list and the infrastructure partner brief"
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
        .mr-ops-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .mr-ops-card {
          display: grid;
          grid-template-columns: 1fr auto;
          column-gap: 1rem;
          row-gap: 0.15rem;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          font-size: 0.93rem;
        }
        .mr-ops-name {
          color: #e0e0e0;
          font-weight: 600;
        }
        .mr-ops-meta {
          text-align: right;
          color: #999;
          font-size: 0.85rem;
        }
        .mr-ops-card a {
          color: #ccc;
          word-break: break-all;
        }
        .mr-ops-note {
          font-size: 0.85rem !important;
          color: #999 !important;
          margin-top: 0.5rem;
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
            Payjoin work for every wallet.
          </p>
        </div>

        <div className="mr-section">
          <h2>Why Does This Matter?</h2>
          <p>
            Payjoin makes it possible to break Satoshi's original privacy
            concern: that all inputs to a transaction belong to one person.
          </p>
          <p>
            With Async Payjoin, receivers no longer need to run a server. But this convenience depends on directory and
            relay infrastructure existing. Today, only a small handful of
            operators run these services. A single point of failure is a single
            point of censorship.
          </p>
        </div>

        <div className="mr-section">
          <h2>Why Does It Matter Who Runs This?</h2>
          <p>
            Bitcoin privacy infrastructure works best when it's operated by
            entities that can sustain it long-term. We don't need a sprawling
            network of operators. Fewer directories
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
              One scenario deserves naming plainly: if the relay and the
              directory collude, they can together correlate a client's IP
              address (visible to the relay) with a session identifier
              (visible to the directory) and the timing of message exchanges.
              They still cannot decrypt payloads, see counterparties,
              addresses, amounts, or the eventual transaction; payloads are
              padded to a fixed size so post and poll bodies are
              size-indistinguishable. The defense is operator separation:
              relay and directory are operated by different entities, curated
              by the Payjoin Foundation.
            </p>
            <p>
              The same separation applies to an operator's own wallet. If you
              ship a wallet that syncs through your own Electrum, Esplora or
              mempool backend, do not default it to your own directory. The
              backend already sees the user's IP address, and your directory
              would then see the same user's mailbox. That is the correlation
              the relay exists to prevent. Default your wallet to other
              operators' directories and let others default to yours.
            </p>
            <p>
              <strong>
                You never touch bitcoin. You never see transactions. Zero
                custody risk.
              </strong>
            </p>
            <p className="mr-ops-note">
              Async Payjoin (BIP 77) payloads are end-to-end encrypted. V1
              backwards-compatible requests (BIP 78) are plaintext, meaning the
              directory can see v1 sender IP addresses and transaction
              contents. V1 is off unless an operator enables it.
            </p>
          </div>
        </div>

        <div className="mr-section" id="metrics">
          <h2>Aggregate Metrics: Four Integers a Week</h2>
          <p>
            Aggregate metrics reporting shipped in payjoin-mailroom 0.1.3 and
            is a listing requirement. It is optional in the software itself:
            build with the <code>telemetry</code> feature and add a{" "}
            <code>[telemetry]</code> section to the config. Without both,
            nothing is exported. Logs are never exported either way. This
            section states exactly what leaves your server, why it is safe for
            users, and who sees it. The canonical description, and the one
            that wins if this page lags behind, is the{" "}
            <a href="https://github.com/payjoin/rust-payjoin/blob/master/payjoin-mailroom/README.md#telemetry">
              Telemetry section of the payjoin-mailroom README
            </a>
            .
          </p>
          <p>
            <strong>What is collected.</strong> Four integers per week. Each
            covers the most recently completed Monday-to-Monday UTC week:
          </p>
          <table className="mr-table">
            <thead>
              <tr>
                <th>Gauge</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>http_requests_weekly</code>
                </td>
                <td>HTTP requests completed</td>
              </tr>
              <tr>
                <td>
                  <code>http_requests_started_weekly</code>
                </td>
                <td>HTTP requests started</td>
              </tr>
              <tr>
                <td>
                  <code>db_entries_weekly</code>
                </td>
                <td>Mailbox entries written</td>
              </tr>
              <tr>
                <td>
                  <code>bootstrap_tunnel_sheds_weekly</code>
                </td>
                <td>OHTTP bootstrap tunnels refused at the concurrency cap</td>
              </tr>
            </tbody>
          </table>
          <p>
            The data points carry no attributes. The export is labelled with
            exactly two resource attributes: <code>service.name</code>, which
            is always <code>payjoin-mailroom</code>, and{" "}
            <code>operator.domain</code>, which you choose and which the
            Foundation dashboards group by. Values are pushed once an hour,
            and every push in a week carries the same settled value, so the
            hourly cadence adds delivery attempts, not detail.
          </p>
          <p>
            <strong>What is not collected.</strong>
          </p>
          <ul>
            <li>
              No IP addresses, mailbox IDs, hostnames, endpoints, HTTP methods,
              status codes or protocol versions. None of these is attached to
              any data point.
            </li>
            <li>
              No payload contents and no payload sizes. Nothing about any
              individual request is exported.
            </li>
            <li>
              No live, daily or per-request figures. Only the settled week is
              exported. The week in progress is never visible, so there is no
              live value to watch and no overlapping windows to difference for
              daily traffic.
            </li>
            <li>
              No logs. Stdout logs stay on your machine whatever the log
              format.
            </li>
            <li>
              Nothing from the environment. The resource is built from an
              empty resource, so <code>OTEL_RESOURCE_ATTRIBUTES</code> cannot
              add anything to it.
            </li>
          </ul>
          <p>
            <strong>Why this does not harm privacy.</strong> Payjoin privacy
            rests on an observer being unable to tie a particular user to a
            particular mailbox or transaction. A weekly total of requests
            across every user of a mailroom, exported only after the week has
            closed, cannot be tied to anyone. It has no timestamp finer than a
            week, no identifier, and no link to the chain. The counts are
            exported exactly, including zero. Rounding or withholding small
            values would hide at most a few units from a passive viewer, and
            anyone able to send traffic can add a known amount and subtract it
            back out, so exactness gives up nothing and keeps the numbers
            honest.
          </p>
          <p>
            <strong>Trust model.</strong>
          </p>
          <ul>
            <li>
              <strong>Users</strong> trust nothing new. Metrics add no
              visibility into any session for the operator, the Foundation or
              anyone else. The guarantees in the trust box above are
              unchanged.
            </li>
            <li>
              <strong>Operators</strong> keep their own per-request view on
              stdout, plus a heartbeat line once a minute with requests in
              flight, open bootstrap tunnels and, on Linux, the open file
              descriptor count. None of it leaves the machine. What does leave
              is the four integers above, labelled with the operator's chosen
              domain, pushed over OTLP to the Foundation's endpoint with an
              auth token issued on request.
            </li>
            <li>
              <strong>The Payjoin Foundation</strong> receives those series and
              publishes aggregate dashboards from them. Per-operator weekly
              series are visible to Foundation dashboard editors and kept at
              the stack's default retention.
            </li>
          </ul>
          <p>
            Each rule above is pinned by a unit test in{" "}
            <code>src/metrics.rs</code> or <code>src/telemetry.rs</code>, and
            the mailroom is open source. An operator building from source can
            check the export surface rather than take this page's word for it.
          </p>
          <p className="mr-ops-note">
            The four counters are persisted in <code>weekly_counts.txt</code>{" "}
            under <code>storage_dir</code>, so a redeploy keeps the week. Run
            one mailroom process per <code>operator_domain</code>. Two
            processes sharing a value each report their own share of the week
            to the same series.
          </p>
        </div>

        <div className="mr-section" id="operators">
          <h2>Payjoin Mailroom Operators</h2>
          <p>
            In every session the relay and the directory must be run by
            different entities. The relay sees the client's IP address and no
            content. The directory sees encrypted mailboxes and no IP
            addresses. Neither can link a user to a transaction on its own. A
            wallet must pair a relay and a directory from different registrable
            domains, which is why each listed operator runs both roles under
            one domain.
          </p>
          <p>
            Wallets should use every listed operator, choosing a relay and a
            directory at random for each session. A wallet that ships with its
            own fixed subset is fingerprinted by that subset.
          </p>
          <div className="mr-ops-list">
            <div className="mr-ops-card">
              <span className="mr-ops-name">Ava Chow</span>
              <span className="mr-ops-meta">US</span>
              <a href="https://payjoin.achow101.com">payjoin.achow101.com</a>
              <span className="mr-ops-meta">v0.1.2</span>
            </div>
            <div className="mr-ops-card">
              <span className="mr-ops-name">BOB Space</span>
              <span className="mr-ops-meta">Thailand</span>
              <a href="https://pj.bobspacebkk.com">pj.bobspacebkk.com</a>
              <span className="mr-ops-meta">v0.1.2</span>
            </div>
            <div className="mr-ops-card">
              <span className="mr-ops-name">Vinteum</span>
              <span className="mr-ops-meta">Brazil</span>
              <a href="https://payjoin.lab.vinteum.org">payjoin.lab.vinteum.org</a>
              <span className="mr-ops-meta">v0.1.2</span>
            </div>
          </div>
          <p className="mr-ops-note">
            Each mailroom serves both roles from the one URL. Its OHTTP key
            configuration is at /.well-known/ohttp-gateway under that URL.
          </p>
          <p>
            <strong>Listing criteria.</strong> An operator runs both roles,
            directory and relay, from one mailroom URL. It is run independently
            of every other listed operator, with no shared owners, staff or
            control, and its mailroom does not share infrastructure with
            another entry. It runs a release within the last two minor versions
            and gives the Payjoin Foundation a security contact that answers.
            Opening the pull request is consent to be listed. It reports
            coarse aggregate metrics to the Foundation: the four weekly counts
            described under{" "}
            <a href="#metrics">Aggregate Metrics</a> above, enabled with the
            telemetry feature and a <code>[telemetry]</code> section.
          </p>
          <p>
            <strong>Delisting.</strong> An entry is removed when it is
            unreachable for 30 days, runs a version with an unpatched security
            advisory, or there is evidence that it colludes with another entry.
          </p>
          <p>
            <strong>How to get listed.</strong> Read this brief, run a
            mailroom that meets the criteria, then{" "}
            <a href="https://github.com/payjoin/payjoin.org/edit/master/src/pages/mailroom.tsx">
              open a pull request
            </a>{" "}
            adding an operator card to this page, following the existing
            ones. Send your security contact to hello@payjoin.org. It is not
            published. Objections and questions are handled in the open on the pull
            request. The Payjoin Foundation curates the list against the
            published criteria.
          </p>
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
                  <strong>Metrics</strong>
                </td>
                <td>
                  Build with the telemetry feature and fill in the{" "}
                  <code>[telemetry]</code> section. Four integers a week leave
                  your server. Nothing else does. See{" "}
                  <a href="#metrics">Aggregate Metrics</a>.
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
              Encrypted blobs and their own server logs. The directory sees
              fixed-size encrypted mailboxes and no IP addresses. The relay
              sees IP addresses and no content. The operator never sees
              payload contents, Bitcoin addresses, or sender/receiver
              identity. The exception is V1 requests, which are plaintext. V1
              is off unless an operator enables it. What leaves the server is
              four weekly integers, described under{" "}
              <a href="#metrics">Aggregate Metrics</a>. This is less
              visibility than even Signal has running their own
              infrastructure, since Signal registers phone numbers and sees
              payload sizes. payjoin-mailroom does neither.
            </p>
          </div>

          <div className="mr-faq-item">
            <p className="mr-faq-q">Is there a revenue model?</p>
            <p className="mr-faq-a">
              Public-good infrastructure, and it is mutual. Your mailroom serves
              other wallets' users, and your own wallet's users rely on other
              operators' mailrooms. Running one is a reputation signal that your
              organization takes Bitcoin privacy seriously.
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
            <a href="/mailroom-brief.pdf">Download this brief as a PDF</a>
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
