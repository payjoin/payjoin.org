import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Preserve Privacy",
    // Svg: require("@site/static/img/ngu.svg").default,
    description: (
      <>
       Payjoin preserves privacy by breaking the most common method used to spy on bitcoin users
      </>
    ),
  },
  {
    title: "Scale Bitcoin, lower fees",
    // Svg: require("@site/static/img/bitcoin-moneybag.svg").default,
    description: (
      <>
       Payjoin can settle many transactions at once, allowing higher throughput, time savings, and lower fees
      </>
    ),
  },
  {
    title: "Augment Lightning",
    // Svg: require("@site/static/img/superhero.svg").default,
    description: (
      <>
        Payjoin enables Lightning nodes to fund and open all their channels in one transaction while maintaining privacy
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      {Svg && <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>}
      
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <div className="min-h-screen">
      <section className={styles.features}>
        <h2 className="text-6xl">Why Payjoin?</h2>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
