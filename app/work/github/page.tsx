import ProjectShell from '@/components/ProjectShell';

const sections = [
  {
    label: 'Overview',
    body: (
      <p>As a product design intern at GitHub, I contributed to the Pull Request experience redesign — a project touching 50M+ active users and 1.5M+ daily pull requests. My focus was the code review annotation system and the file diff navigation model.</p>
    ),
  },
  {
    label: 'Problem',
    body: (
      <>
        <p>Code review is cognitively expensive. Reviewers lose context switching between the file tree, the diff view, and the conversation thread. For large PRs (500+ files), the experience degrades sharply.</p>
        <p style={{ marginTop: '16px' }}>How do we preserve spatial memory and conversational context across a review session?</p>
      </>
    ),
  },
  {
    label: 'Process',
    body: (
      <p>Participatory design sessions with 12 GitHub engineers. Competitive analysis of code review tools. Three rounds of prototype testing with internal teams. Close collaboration with engineering on performance constraints (the diff viewer is a custom-built renderer, not a standard DOM implementation).</p>
    ),
  },
  {
    label: 'Outcome',
    body: (
      <p>Several interaction patterns I proposed shipped in the revamped PR experience, including the sticky file header and the inline conversation threading model. The redesign was announced at GitHub Universe 2022.</p>
    ),
  },
];

export default function GitHubPage() {
  return (
    <ProjectShell
      title="GitHub Pull Requests"
      description="Redesigning the code review experience for 50M+ developers — focusing on cognitive load, spatial memory, and conversational context."
      sections={sections}
    />
  );
}
