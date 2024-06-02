import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import WhyPayjoin from "../components/WhyPayjoin";
import HeaderContent from "../components/HeaderContent";
import FigmaDemo from "../components/FigmaDemo";
import WalletsUsingPayjoin from "../components/WalletsUsingPayjoin";
import { LearnMore } from "../components/LearnMore";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />"
    >
      <main className="text-center bg-secondary">
        <div className="flex flex-col items-center max-sm:gap-20">
          <HeaderContent />
          <WhyPayjoin />
          <WalletsUsingPayjoin />
          <FigmaDemo />
          <LearnMore />
        </div>
     </main>
    </Layout>
  );
}
