import Heading from "@theme/Heading";

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
  link: string;
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
    link: "/docs/why-payjoin/privacy"
  },
  {
    title: "Scale Bitcoin, lower fees",
    // Svg: require("@site/static/img/bitcoin-moneybag.svg").default,
    description: (
      <>
       Payjoin can settle many transactions at once, allowing higher throughput, time savings, and lower fees
      </>
    ),
    link: "/docs/why-payjoin/scaling"
  },
  {
    title: "Augment Lightning",
    // Svg: require("@site/static/img/superhero.svg").default,
    description: (
      <>
        Payjoin enables Lightning nodes to fund and open all their channels in one transaction while maintaining privacy
      </>
    ),
    link: "/docs/why-payjoin/lightning"
  },
];

function Feature({ title, description, link }: FeatureItem) {
  return (
    <div className="bg-secondary rounded-lg p-4 w-72 flex flex-col justify-between items-start">
      {/* {Svg && <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>} */}
      <div className="text-left text-xl">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
      <a href={link}>Learn More</a>
    </div>
  );
}

export default function WhyPayjoin(): JSX.Element {
  return (
    <div id="whypayjoin" className="min-h-screen bg-tertiary w-full">
      <section className="my-20 flex flex-col items-center gap-24">
        <h2 className="text-6xl">Why Payjoin?</h2>
        <div>
          <div className="flex flex-col md:flex-row gap-12 justify-between">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
