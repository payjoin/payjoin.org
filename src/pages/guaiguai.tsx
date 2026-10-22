import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import GuaiGuaiPrize from "../components/GuaiGuai";

export default function GuaiGuai() {
  const card = useBaseUrl("/img/guaiguai/card.jpg", { absolute: true });
  return (
    <Layout
      title="乖乖"
      description="A green bag of 乖乖 keeps the machines well-behaved. Ours says: mind your own bits."
    >
      <Head>
        <meta property="og:image" content={card} />
        <meta name="twitter:image" content={card} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        <GuaiGuaiPrize />
        <h1 style={{ marginTop: "2rem", fontSize: "2.5rem", textAlign: "center" }}>
          乖乖 <span style={{ fontSize: "1.25rem", fontWeight: 400, color: "#bbb" }}>guāi guāi</span>
        </h1>
        <p>
          A corn puff snack from Taiwan, sold since 1968. The name means "well-behaved", what you
          say to settle a fussy child.
        </p>
        <h2>Why it sits on the server</h2>
        <p>
          Engineers in Taiwan leave an unopened bag on servers, network racks, ATMs and lab gear so
          the machines behave. It has to be the green bag, the coconut flavour, because a green light
          means everything is fine. Yellow and red look like warnings. Keep it in date, and don't eat
          it.
        </p>
        <p>
          <Link to="/docs/why-payjoin/privacy">How payjoin protects your privacy</Link>
        </p>
        <p style={{ marginTop: "3rem", fontSize: "0.8rem", color: "#999" }}>
          Bag photos from Wikimedia Commons: front by{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Eseap_2026_Kuai_Kuai.jpg">さえぼー</a> (CC0),
          back by <a href="https://commons.wikimedia.org/wiki/File:Kuai_Kuai_back.jpg">Justine.toms</a>{" "}
          (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>; the back texture is
          shared under the same licence). 乖乖 is a trademark of Kuai Kuai Co., Ltd.
        </p>
      </main>
    </Layout>
  );
}
