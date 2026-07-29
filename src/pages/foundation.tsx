import Layout from "@theme/Layout";

export default function Foundation(): JSX.Element {
  return (
    <Layout
      title="Foundation"
      description="Payjoin Foundation — mission and current structure"
    >
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>Payjoin Foundation</h1>
            <p>
              Payjoin Foundation is a 501c3 nonprofit research and development
              organization maintaining the Payjoin Dev Kit. It is dedicated
              to developing and distributing open-source software and standards that
              improve privacy, security, and usability in peer-to-peer digital
              transactions with a primary focus on Bitcoin. The Foundation conducts
              research, publishes freely available software and educational materials,
              and supports adoption of the technology it develops by providing reference
              implementations, technical documentation, and integration guidance to
              developers and infrastructure operators.
            </p>

            <h2>Board of Directors</h2>
            <ul>
              <li>Dan Gould</li>
              <li>Ben Allen</li>
              <li>Spacebear</li>
            </ul>

            <p>
              To reach the Foundation, email{" "}
              <a href="mailto:hello@payjoin.org">hello@payjoin.org</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
