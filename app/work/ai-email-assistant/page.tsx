import PasswordGate from '@/components/PasswordGate';
import ProjectShell from '@/components/ProjectShell';

const sections = [
  {
    label: 'Overview',
    body: (
      <p>Salesloft&apos;s AI Email Assistant generates personalized outreach drafts for sales reps. My work focused on the critical moment between generation and send — designing the explainability layer that helps reps understand why the AI made certain choices, and when to trust it.</p>
    ),
  },
  {
    label: 'Problem',
    body: (
      <>
        <p>Generative AI in productivity tools creates a new class of UX problem: not just usability, but appropriate reliance. Reps were either over-trusting AI output (sending without reading) or under-trusting it (ignoring it entirely).</p>
        <p style={{ marginTop: '16px' }}>Neither behavior was good. We needed a middle path: informed, calibrated use.</p>
      </>
    ),
  },
  {
    label: 'Process',
    body: (
      <p>Diary studies with 8 reps over 3 weeks. Annotated existing AI output to find the most common failure modes. Designed and tested three different explainability patterns — inline annotations, a side panel, and a conversational refinement UI — before converging on a hybrid approach.</p>
    ),
  },
  {
    label: 'Outcome',
    body: (
      <p>The shipped design reduced the &quot;send without editing&quot; rate by 34% and improved rep-reported confidence in AI output from 3.1 to 4.2 on a 5-point scale. The pattern is now being extended to other AI features in the platform.</p>
    ),
  },
];

export default function AIEmailAssistantPage() {
  return (
    <PasswordGate>
      <ProjectShell
        title="AI Email Assistant"
        description="Designing explainability and appropriate reliance for generative AI in B2B sales workflows."
        sections={sections}
      />
    </PasswordGate>
  );
}
