import { Button } from "../HeaderContent";
import { CircleScribble } from "../Doodles";

/*
 * Ascending stepped paths (Group 1000011091.svg) used as the band's backdrop.
 * The staircase climbs left to right, which suits the closing "pay it forward"
 * note. Drawn in currentColor so the pink follows the brand token rather than
 * the hex baked into the source file, and sliced so it always covers the band
 * without distorting the step angle.
 */
function StepsBackdrop() {
  return (
    <svg
      viewBox="0 0 2195 1815"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full text-primary"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.1"
      strokeWidth="120"
    >
      <path d="M452.511 1802.02L486.302 1644.59C494.129 1608.12 531.751 1586.4 567.248 1597.85L654.166 1625.9C689.663 1637.36 727.285 1615.64 735.113 1579.17L754.279 1489.87C762.106 1453.4 799.729 1431.68 835.225 1443.14L922.143 1471.19C957.64 1482.64 995.262 1460.92 1003.09 1424.45L1022.26 1335.15C1030.08 1298.68 1067.71 1276.96 1103.2 1288.42L1190.12 1316.47C1225.62 1327.93 1263.24 1306.2 1271.07 1269.74L1290.23 1180.44C1298.06 1143.97 1335.68 1122.25 1371.18 1133.7L1458.1 1161.75C1493.59 1173.21 1531.22 1151.49 1539.04 1115.02L1558.21 1025.72C1566.04 989.251 1603.66 967.53 1639.16 978.986L1726.07 1007.04C1761.57 1018.49 1799.19 996.771 1807.02 960.302L1826.19 871.003C1834.01 834.534 1871.64 812.813 1907.13 824.269L1994.05 852.32C2029.55 863.776 2067.17 842.054 2075 805.585L2108.79 648.148" />
      <path d="M329.972 1589.78L363.762 1432.34C371.59 1395.87 409.212 1374.15 444.709 1385.6L531.627 1413.66C567.124 1425.11 604.746 1403.39 612.574 1366.92L631.74 1277.62C639.567 1241.15 677.189 1219.43 712.686 1230.89L799.604 1258.94C835.101 1270.39 872.723 1248.67 880.551 1212.2L899.717 1122.91C907.544 1086.44 945.167 1064.72 980.663 1076.17L1067.58 1104.22C1103.08 1115.68 1140.7 1093.96 1148.53 1057.49L1167.69 968.189C1175.52 931.72 1213.14 909.998 1248.64 921.454L1335.56 949.505C1371.06 960.961 1408.68 939.24 1416.51 902.771L1435.67 813.472C1443.5 777.003 1481.12 755.282 1516.62 766.737L1603.54 794.788C1639.03 806.244 1676.65 784.523 1684.48 748.054L1703.65 658.755C1711.48 622.286 1749.1 600.565 1784.59 612.021L1871.51 640.072C1907.01 651.528 1944.63 629.806 1952.46 593.337L1986.25 435.9" />
      <path d="M208.117 1378.71L241.379 1220.69C249.103 1184 286.974 1162.13 322.614 1173.79L409.328 1202.16C444.969 1213.82 482.84 1191.95 490.564 1155.26L509.356 1065.98C517.08 1029.28 554.951 1007.42 590.592 1019.08L677.305 1047.44C712.946 1059.1 750.817 1037.23 758.541 1000.54L777.333 911.26C785.057 874.565 822.928 852.7 858.569 864.359L945.282 892.724C980.923 904.382 1018.79 882.517 1026.52 845.822L1045.31 756.544C1053.03 719.849 1090.91 697.984 1126.55 709.642L1213.26 738.007C1248.9 749.665 1286.77 727.8 1294.5 691.105L1313.29 601.827C1321.01 565.132 1358.88 543.267 1394.52 554.925L1481.24 583.29C1516.88 594.949 1554.75 573.084 1562.47 536.389L1581.26 447.11C1588.99 410.415 1626.86 388.55 1662.5 400.209L1749.21 428.574C1784.85 440.232 1822.73 418.367 1830.45 381.672L1863.71 223.652" />
      <path d="M85.5734 1166.47L119.364 1009.03C127.191 972.561 164.814 950.84 200.311 962.296L287.229 990.347C322.725 1001.8 360.348 980.081 368.175 943.612L387.341 854.313C395.169 817.845 432.791 796.123 468.288 807.579L555.206 835.63C590.702 847.086 628.325 825.365 636.152 788.896L655.318 699.597C663.146 663.128 700.768 641.406 736.265 652.862L823.183 680.913C858.68 692.369 896.302 670.648 904.129 634.179L923.296 544.88C931.123 508.411 968.745 486.69 1004.24 498.146L1091.16 526.197C1126.66 537.652 1164.28 515.931 1172.11 479.462L1191.27 390.163C1199.1 353.694 1236.72 331.973 1272.22 343.429L1359.14 371.48C1394.63 382.936 1432.26 361.214 1440.08 324.745L1459.25 235.447C1467.08 198.978 1504.7 177.256 1540.2 188.712L1627.11 216.763C1662.61 228.219 1700.23 206.498 1708.06 170.029L1741.85 12.5914" />
    </svg>
  );
}

/*
 * Closing band. It lands on the footer's colour so the page resolves into the
 * footer instead of stopping at a seam.
 */
export function LearnMore() {
  return (
    <div className="relative w-full overflow-hidden bg-[#2a1520]">
      <StepsBackdrop />

      {/* Scrim: the steps run behind the copy, so the middle is darkened back
          down to keep the text off the pattern. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
          bg-[radial-gradient(60%_60%_at_50%_50%,rgba(42,21,32,0.92)_0%,rgba(42,21,32,0)_100%)]"
      />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-5 py-20 text-center sm:px-8 sm:py-32 lg:px-10">
        {/* leading opens up from 1.1 so the scribble looping under "Forward"
            clears the line beneath it */}
        <h2 className="mb-0 text-4xl font-bold leading-[1.3] tracking-tight sm:text-5xl lg:text-6xl">
          Pay it{" "}
          <span className="relative inline-block">
            <CircleScribble />
            <span className="relative">Forward</span>
          </span>
          <span className="block bg-gradient-to-r from-[#f75394] from-35% to-[#6A394C] bg-clip-text text-transparent">
            Join the Community
          </span>
        </h2>

        <p className="mb-0 max-w-[46ch] text-base text-white/70 sm:text-lg">
          Payjoin can bring many benefits to Bitcoin, but it needs your help
        </p>

        <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            target="_blank"
            href="https://payjoin.substack.com/"
            className="no-underline hover:no-underline"
          >
            <Button variant="primary">Join our newsletter</Button>
          </a>
          <a
            target="_blank"
            href="https://discord.gg/6rJD9R684h"
            className="no-underline hover:no-underline"
          >
            <Button variant="secondary">Join the Discord</Button>
          </a>
        </div>

        <p className="mb-0 mt-2 text-sm text-white/50">
          Stay up to date with Payjoin development
        </p>
      </section>
    </div>
  );
}
