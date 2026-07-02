import Link from 'next/link';

const sampleProjects = [
  {
    id: 'cmr3jwx0n0001cgd20habmqbf',
    name: 'Sample Project (Mid-Stage): Beposo Community Solar Mini-Grid',
    readiness: 'Major work needed',
    summary:
      'Use this one to show new advisors what partial evidence, missing budget support, and draft endorsements look like.',
  },
  {
    id: 'cmr3k5rl60003cgd2jp8bbclz',
    name: 'Sample Project (Submission-Ready): Adumkrom Community Solar Mini-Grid',
    readiness: 'Ready to submit',
    summary:
      'Use this one to show what a stronger Ghana mini-grid submission looks like once most critical evidence is already documented.',
  },
];

const workflowSteps = [
  {
    title: 'Capture one structured intake',
    body: 'Project site, ownership, productive-use, cost, and readiness evidence are collected in a single advisor workflow.',
  },
  {
    title: 'Score Mission 300 alignment',
    body: 'The platform classifies debt sensitivity, grant suitability, and local ownership strength immediately.',
  },
  {
    title: 'Match against grant pathways',
    body: 'Funders are ranked against geography, instrument fit, ownership model, and probable eligibility.',
  },
  {
    title: 'Turn gaps into next steps',
    body: 'Proposal sections, readiness gaps, and questions-to-answer become the actual work plan for the team.',
  },
];

const audiences = [
  {
    title: 'First-time advisors',
    body: 'Learn quickly what evidence the platform expects and how project quality changes the readiness result.',
  },
  {
    title: 'Project developers',
    body: 'Prioritize grant-first, debt-sensitive pathways instead of spending time on poor-fit capital options.',
  },
  {
    title: 'Review teams',
    body: 'Spot weak documentation, missing approvals, and proposal risks early before a funder sees the file.',
  },
];

const faqs = [
  {
    q: 'Is access public?',
    a: 'No. The workspace is invite-only so you can keep access limited to trusted colleagues and advisors.',
  },
  {
    q: 'What do the sample projects show?',
    a: 'They provide a realistic Ghana mini-grid example at two different readiness levels so new users can understand the platform quickly.',
  },
  {
    q: 'Does this replace technical diligence?',
    a: 'No. It sharpens early screening and proposal preparation, but real diligence still depends on documents, engineering, and review.',
  },
];

export default function Home() {
  return (
    <div className="bg-[#f7f5ef]">
      <section className="landing-grid overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(55,145,161,0.45),transparent_34%),linear-gradient(180deg,#183154_0%,#143052_64%,#132d4d_100%)] text-white">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center rounded-full border border-white/16 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]">
              Mission 300 support desk · scored to debt-sensitive grant fit
            </div>

            <h1 className="mt-10 max-w-5xl text-5xl font-extrabold leading-[0.95] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Fund only the community energy projects you can actually carry to submission.
            </h1>

            <p className="mt-8 max-w-4xl text-xl leading-[1.65] text-slate-200 sm:text-[2rem] sm:leading-[1.55]">
              M300 Support Desk captures project intake, scores Mission 300 alignment,
              flags debt-sensitive risks, and shows what evidence still needs to exist
              before a grant application is credible. Signal over noise, not another
              spreadsheet graveyard.
            </p>

            <div className="mt-12 flex max-w-3xl flex-col gap-4 sm:flex-row">
              <div className="flex min-h-[72px] flex-1 items-center rounded-2xl border border-slate-200/15 bg-white px-6 text-lg font-medium text-slate-500 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                Ghana solar mini-grid · sample intake ready
              </div>
              <Link
                href="/analyze"
                className="inline-flex min-h-[72px] items-center justify-center rounded-2xl bg-[#f4af21] px-8 text-lg font-extrabold text-slate-950 transition hover:bg-[#f7bb43]"
              >
                Start the analysis
              </Link>
            </div>

            <p className="mt-5 text-base text-slate-300">
              Invite-only workspace. Use the sample projects below to guide first-time users before they enter a live record.
            </p>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#24a29a]">
            How it works
          </p>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-6xl">
            From raw project notes to your three best next moves.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[28px] border border-slate-900/8 bg-white p-7 shadow-[0_20px_60px_rgba(20,35,55,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#163154] text-sm font-extrabold text-white">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="audience" className="border-y border-slate-900/6 bg-[#fbf8f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#24a29a]">
                Who it&apos;s for
              </p>
              <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-6xl">
                Built for teams that need sharper early-stage judgment.
              </h2>
              <p className="mt-6 text-lg leading-9 text-slate-600">
                The point is not to decorate a project. The point is to identify whether it is
                fundable, what is missing, and which grant pathways deserve the team&apos;s time.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="rounded-[28px] border border-slate-900/8 bg-white p-7"
                >
                  <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
                    {audience.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">{audience.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="samples" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#24a29a]">
            Sample
          </p>
          <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-6xl">
            Two realistic projects for onboarding and demos.
          </h2>
          <p className="mt-6 text-lg leading-9 text-slate-600">
            Both examples already exist in the platform. Use them to show users the difference
            between a project that still needs material work and one that is materially stronger.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {sampleProjects.map((project, index) => (
            <div
              key={project.id}
              className="rounded-[30px] border border-slate-900/8 bg-white p-8 shadow-[0_20px_60px_rgba(20,35,55,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#163154] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                  Sample 0{index + 1}
                </span>
                <span className="rounded-full bg-[#dff5ef] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#1a7a70]">
                  {project.readiness}
                </span>
              </div>

              <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-slate-900">
                {project.name}
              </h3>
              <p className="mt-5 text-base leading-8 text-slate-600">{project.summary}</p>

              <div className="mt-8">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#163154] px-6 py-4 text-base font-extrabold text-white transition hover:bg-[#204069]"
                >
                  Open sample project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-slate-900/8 bg-[#fbf8f1]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#24a29a]">
              FAQ
            </p>
            <h2 className="mt-5 text-4xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-6xl">
              A few fast answers for new users.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-[28px] border border-slate-900/8 bg-white p-7"
              >
                <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
                  {faq.q}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
