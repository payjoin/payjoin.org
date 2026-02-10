import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import WhyPayjoin from "../components/HomepageFeatures";
import HeaderContent from "../components/HeaderContent";
import FigmaDemo from "../components/FigmaDemo";
import Testimonials from "../components/Testimonials";
import { LearnMore } from "../components/LearnMore";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Scale Bitcoin, save fees, and preserve privacy all at once."
    >
      <main className="text-center bg-secondary">
        <div className="flex flex-col items-center max-sm:gap-20">
          <HeaderContent />
          <WhyPayjoin />
          <Testimonials />
          <FigmaDemo />
          <LearnMore />
        </div>
     </main>
    </Layout>
  );
}
