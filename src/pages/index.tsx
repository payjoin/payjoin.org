import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "../components/HomepageFeatures";
import HeaderContent from "../components/HeaderContent";
import FigmaDemo from "../components/FigmaDemo";
import UsedBy from "../components/UsedBy";
import { LearnMore } from "../components/LearnMore";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <main className="text-center bg-secondary flex flex-col items-center">
        <HeaderContent />
        <HomepageFeatures />
        <UsedBy />
        <FigmaDemo />
        <LearnMore />
      </main>
    </Layout>
  );
}
