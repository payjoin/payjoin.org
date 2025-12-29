import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./supporters.module.css";

export default function Supporters(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Supporters"
      description="Who supports Payjoin Dev Kit?"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Supporters</h1>
            <p>
              The Payjoin project is proudly supported by a number of organizations. If you'd like to become a supporter
              please reach out at: <a href="mailto:hello@payjoin.org">hello@payjoin.org</a>
            </p>

            <h2>2025</h2>
            <div className={styles.supporters}>
              <div className={styles.row}>
                <a href="https://nitter.net/spiralbtc/status/1961473589049245895#m" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/spiral.svg" alt="Sponsor Spiral" />
                  Spiral
                </a>
                <a href="https://opensats.org/blog/advancements-in-developer-libraries#payjoin-dev-kit" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/opensats.png" alt="OpenSats" />
                  OpenSats
                </a>
                <a href="https://hrfbounties.org/#Serverless%20Payjoin" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/hrf.png" alt="HRF" />
                  HRF
                </a>
                <a href="https://bitcoinmagazine.com/news/ben-allen-receives-maelstrom-bitcoin-developer-grant-to-advance-payjoin-tech" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/maelstrom.png" alt="Maelstrom" />
                  Maelstrom
                </a>
                <a href="https://www.btrust.tech/" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/btrust.jpg" alt="Btrust" />
                  ₿trust
                </a>
                <a href="https://www.cakewallet.com/" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/cake.png" alt="Cake Wallet" />
                  Cake Wallet
                </a>
              </div>
            </div>

            <h2>2024</h2>
            <div className={styles.supporters}>
              <div className={styles.row}>
                <a href="https://nitter.net/spiralbtc/status/1848741207502885101#m" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/spiral.svg" alt="Sponsor Spiral" />
                  Spiral
                </a>
                <a href="https://opensats.org/blog/bitcoin-grants-july-2023#payjoin-dev-kit" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/opensats.png" alt="OpenSats" />
                  OpenSats
                </a>
                <a href="https://hrfbounties.org/#Serverless%20Payjoin" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/hrf.png" alt="HRF" />
                  HRF
                </a>
              </div>
            </div>

            <h2>2023</h2>
            <div className={styles.supporters}>
              <div className={styles.row}>
                <a href="https://nitter.net/spiralbtc/status/1747663472836431925#m" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/spiral.svg" alt="Sponsor Spiral" />
                  Spiral
                </a>
                <a href="https://opensats.org/blog/bitcoin-grants-july-2023#payjoin-dev-kit" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/opensats.png" alt="OpenSats" />
                  OpenSats
                </a>
                <a href="https://geyser.fund/project/bobspacebkk/posts/view/2759" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/bob-space.webp" alt="BOB" />
                  BOB
                </a>
              </div>
            </div>

            <h2>2022</h2>
            <div className={styles.supporters}>
              <div className={styles.row}>
                <a href="https://geyser.fund/grants/3" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/geyser.jpg" alt="Geyser" />
                  Geyser
                </a>
              </div>
            </div>

            <h2>2021</h2>
            <div className={styles.supporters}>
              <div className={styles.row}>
                <a href="https://hrf.org/latest/hrfs-bitcoin-development-fund-announces-375-million-satoshis-across-10-q3-gifts/#:~:text=Payjoin" target="_blank" rel="nofollow noopener">
                  <img src="/img/supporters/hrf.png" alt="HRF" />
                  HRF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

