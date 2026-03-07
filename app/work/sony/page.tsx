import ProjectShell from '@/components/ProjectShell';

const sections = [
  {
    label: 'Overview',
    body: (
      <p>Research and interaction design for Sony&apos;s next-generation personal audio division — exploring the boundary between physical form and digital interface in earbuds and headphones designed for creative professionals.</p>
    ),
  },
  {
    label: 'Problem',
    body: (
      <>
        <p>Consumer audio hardware is increasingly software-defined, but the interaction model is still hardware-first: buttons, taps, gestures tied to physical affordances. As earbuds become more capable (spatial audio, biometrics, ambient awareness), the interaction model needs a rethink.</p>
        <p style={{ marginTop: '16px' }}>How do you design for a device that&apos;s worn in both ears, has no screen, and needs to disappear from attention?</p>
      </>
    ),
  },
  {
    label: 'Process',
    body: (
      <p>Ethnographic research with musicians, commuters, and remote workers across three cities. Technology probe studies with early hardware. Concept development across three directions, refined through co-creation workshops and experience prototyping.</p>
    ),
  },
  {
    label: 'Outcome',
    body: (
      <p>Delivered a research report and interaction framework to Sony&apos;s Tokyo product team. One of three proposed interaction patterns was incorporated into the product roadmap for 2023 release. NDA constraints prevent sharing specifics — a deck is available on request.</p>
    ),
  },
];

export default function SonyPage() {
  return (
    <ProjectShell
      title="Sony Audio"
      description="Ethnographic research and interaction design for next-generation personal audio — at the boundary of hardware and software."
      sections={sections}
    />
  );
}
