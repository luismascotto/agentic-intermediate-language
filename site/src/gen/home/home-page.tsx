import { TopBar } from "./sections/top-bar";
import { Hero } from "./hero/hero";
import { GapStrip } from "./sections/gap-strip";
import { TreeSection } from "./tree/tree-section";
import { Journey } from "./journey/journey";
import { WatchSection } from "./watch/watch-section";
import { Readers } from "./readers/readers";
import { BuildLoop } from "./build-loop/build-loop";
import { AdoptSection } from "./adopt/adopt-section";
import { SpecBrowser } from "./sections/spec-browser";
import { GetStarted } from "./sections/get-started";
import { Footer } from "./sections/footer";

/** the parts appear in this order: TopBar, Hero, GapStrip, TreeSection, Journey, WatchSection, Readers, BuildLoop, AdoptSection, SpecBrowser, GetStarted, Footer */
export function HomePage() {
  return (
    <div
      style={{
        background: "var(--color-page)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--font-body)",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <TopBar />
      <main>
        <Hero />
        <GapStrip />
        <TreeSection />
        <Journey />
        <WatchSection />
        <Readers />
        <BuildLoop />
        <AdoptSection />
        <SpecBrowser />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
}
