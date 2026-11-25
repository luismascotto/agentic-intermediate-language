import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { WalkthroughPlayer } from "./walkthrough-player";

/** an eyebrow, a heading and one sentence on what the two walkthroughs show, then the walkthrough player */
export function WatchSection() {
  return (
    <Section id="watch" tone="raised">
      <SectionHeading
        eyebrow="SEE IT RUN"
        text="Watch AIL build, and adopt"
        lead="Two short walkthroughs you can pause on any chapter: a spec change built into checked code, and an old app described by a spec and proven against it."
      />
      <WalkthroughPlayer />
    </Section>
  );
}
