import PasswordGate from '@/components/PasswordGate';
import ProjectShell from '@/components/ProjectShell';

const sections = [
  {
    label: 'Overview',
    body: (
      <>
        <p>Salesloft needed a way for account executives to understand not just who they knew at a target account, but how influence flowed between stakeholders — who deferred to whom, who was the hidden blocker, who held the actual budget authority.</p>
        <p style={{ marginTop: '16px' }}>I led the 0→1 design of Influence Graph: an AI-powered relationship intelligence layer that surfaces stakeholder networks from email metadata, CRM data, and public signals.</p>
      </>
    ),
  },
  {
    label: 'Problem',
    body: (
      <>
        <p>Enterprise deals fail not because reps don&apos;t reach enough people — they fail because reps don&apos;t understand the invisible hierarchy. Traditional CRM shows contacts. It doesn&apos;t show power.</p>
        <p style={{ marginTop: '16px' }}>Research question: how do we represent relational complexity in a way that&apos;s actionable in a 30-second pre-call brief?</p>
      </>
    ),
  },
  {
    label: 'Process',
    body: (
      <p>Six weeks of generative research across 14 enterprise AEs. Concept sprints, two rounds of prototype testing, a design system component audit, and close collaboration with the ML team on data confidence thresholds and how to represent uncertainty in the UI.</p>
    ),
  },
  {
    label: 'Outcome',
    body: (
      <p>Shipped to beta in Q3 2024. Early signal: accounts where reps engaged with Influence Graph before key calls showed a 19% improvement in multi-threaded deal progression. Full rollout and longitudinal study ongoing.</p>
    ),
  },
];

export default function InfluenceGraphPage() {
  return (
    <PasswordGate>
      <ProjectShell
        title="Influence Graph"
        description="AI-powered relationship intelligence for enterprise sales — visualizing stakeholder power dynamics at scale."
        sections={sections}
      />
    </PasswordGate>
  );
}
