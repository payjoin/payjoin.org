import Layout from "@theme/Layout";

export default function Donate(): JSX.Element {
  return (
    <Layout
      title="Donate"
      description="Support Payjoin Foundation"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Donate</h1>
            <p>
              Payjoin Foundation is a 501(c)(3) non-profit. Your contributions are tax-deductible. Online payments coming soon.
            </p>

            <h2>To donate today</h2>
            <p>
              <strong>Email:</strong> <a href="mailto:donate@payjoin.org">donate@payjoin.org</a>
            </p>
            <p>
              We can arrange wire transfers, checks, or cryptocurrency donations. Reach out and we'll provide instructions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
