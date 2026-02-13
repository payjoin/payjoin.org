import Layout from "@theme/Layout";

export default function ThankYou(): JSX.Element {
  return (
    <Layout title="Thank You" description="Thank you for your donation">
      <div className="container margin-vert--lg">
        <div className="col col--8 col--offset-2" style={{ textAlign: "center" }}>
          <h1>Thank you for your donation!</h1>
          <p style={{ fontSize: "1.2rem", color: "#aaa" }}>
            Your support helps us build private, scalable payments for Bitcoin.
          </p>
          <p>
            Questions about your donation?{" "}
            <a href="mailto:donate@payjoin.org">donate@payjoin.org</a>
          </p>
          <a href="/" style={{ display: "inline-block", marginTop: "24px", color: "#4a9eff" }}>
            Back to payjoin.org
          </a>
        </div>
      </div>
    </Layout>
  );
}
