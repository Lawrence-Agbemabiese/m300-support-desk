import Link from 'next/link';

const sampleProjects = [
  {
    id: 'cmr3jwx0n0001cgd20habmqbf',
    name: 'Sample Project (Mid-Stage): Beposo Community Solar Mini-Grid',
    readiness: 'Major work needed',
    summary:
      'Useful for first-time users who need to understand what draft evidence, partial endorsements, and missing budget work look like.',
    tags: ['Ghana', 'Solar mini-grid', 'Mid-stage', 'Mixed readiness'],
  },
  {
    id: 'cmr3k5rl60003cgd2jp8bbclz',
    name: 'Sample Project (Submission-Ready): Adumkrom Community Solar Mini-Grid',
    readiness: 'Ready to submit',
    summary:
      'Shows a stronger intake with documented land, demand, budget, and timeline evidence so users can compare what “good” looks like.',
    tags: ['Ghana', 'Solar mini-grid', 'Submission-ready', 'Grant-first'],
  },
];

const workflowSteps = [
  {
    title: 'Capture the project signal',
    body: 'Enter site, ownership, productive-use, and readiness evidence details in one structured intake.',
  },
  {
    title: 'Score for Mission 300 fit',
    body: 'The platform classifies debt sensitivity, local ownership strength, and grant suitability in one pass.',
  },
  {
    title: 'Surface credible funders',
    body: 'Grant matches are ranked against geography, instrument fit, ownership model, and likely eligibility.',
  },
  {
    title: 'Turn analysis into action',
    body: 'Proposal guidance, readiness questions, and checklist gaps become the next work plan for advisors.',
  },
];

const audiences = [
  {
    title: 'Advisors onboarding quickly',
    body: 'Use the samples and structured intake to understand the level of evidence the platform expects.',
  },
  {
    title: 'Project developers reducing noise',
    body: 'Focus on grant-first pathways that protect fiscal space instead of wasting cycles on weak-fit capital.',
  },
  {
    title: 'Review teams spotting risk early',
    body: 'See debt sensitivity, readiness gaps, and proposal weaknesses before a project reaches a funder desk.',
  },
];

const faqs = [
  {
    q: 'Is the platform public?',
    a: 'No. Registration is invite-only so access can stay limited to your trusted project and advisor group.',
  },
  {
    q: 'What do the sample projects do?',
    a: 'They show new users what a mid-stage intake looks like versus a stronger submission-ready record, using realistic but fictional Ghana mini-grid projects.',
  },
  {
    q: 'Does the platform replace technical diligence?',
    a: 'No. It accelerates early screening, funder matching, and readiness coaching, but real diligence still depends on supporting documents and review.',
  },
];

export default function Home() {
  return (
    <div>
      <section className="landing-grid overflow-hidden bg-[#162a45] text-white">
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                Mission 300 • grant-first energy project screening
              </div>
              <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Build only the energy projects communities can actually fund and sustain.
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
                M300 Support Desk helps advisors turn raw project concepts into debt-sensitive,
                funder-ready mini-grid cases. Capture the intake once, score Mission 300 fit,
                expose readiness gaps, and move toward credible grant submissions faster.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#efb540] px-6 py-4 text-base font-extrabold text-slate-950 transition hover:bg-[#f3c15b]"
                >
                  Start an analysis
                </Link>
                <Link
                  href="#samples"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-base font-bold text-white transition hover:bg-white/12"
                >
                  Review sample projects
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Invite-only workspace. Built for advisors, project developers, and review teams working on African energy access.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-12 h-40 w-40 rounded-full bg-[#6ed0bf]/20 blur-3xl" />
              <div className="absolute right-2 top-0 h-48 w-48 rounded-full bg-[#efb540]/12 blur-3xl" />
              <div className="landing-glow relative rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,42,69,0.96),rgba(14,28,48,0.94))] p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Guided workspace</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
                      What first-time users should notice
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#6ed0bf]/30 bg-[#6ed0bf]/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#9fe6da]">
                    Sample mode
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-emerald-300/20 bg-white/6 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white">M300 alignment</p>
                        <p className="mt-1 text-sm text-slate-300">
                          Score ownership, grant fit, and debt sensitivity before proposal drafting.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#6ed0bf] px-4 py-3 text-center text-slate-950">
                        <div className="text-3xl font-extrabold leading-none">100</div>
                        <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em]">Tier 1</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {sampleProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-white">{project.readiness}</p>
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-200">
                            sample
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{project.name}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-bold text-white">Readiness coaching</p>
                    <ul className="mt-3 space-y-3 text-sm text-slate-300">
                      <li>Critical gaps stay visible until evidence is explicit and documented.</li>
                      <li>Partial items trigger precise “what remains?” questions instead of vague prompts.</li>
                      <li>Proposal sections stay synced with the actual backend-calculated readiness state.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1f8a7c]">
            How it works
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            One workflow from intake to funder-facing readiness.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            The platform is designed to reduce guesswork. It does not just score a project; it
            shows what still needs to be evidenced before a real submission is credible.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[26px] border border-[var(--surface-line)] bg-[var(--surface-card)] p-6 shadow-[0_18px_50px_rgba(33,45,66,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#162a45] text-sm font-extrabold text-white">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="audience"
        className="border-y border-slate-900/6 bg-[rgba(255,253,247,0.72)]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1f8a7c]">
                Who it’s for
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Built for people who need sharper early-stage decisions.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                The value is not more data for its own sake. The value is a cleaner signal
                about whether a project is fundable, what evidence is still missing, and which
                grant pathways deserve time.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {audiences.map((audience) => (
                <div
                  key={audience.title}
                  className="rounded-[26px] border border-[var(--surface-line)] bg-[var(--surface-card)] p-6"
                >
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                    {audience.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{audience.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="samples"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1f8a7c]">
              Sample projects
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Two guided examples for first-time users.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              These records live in the platform right now. Use them to understand how the same
              type of Ghana solar mini-grid project looks at two different readiness levels.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900/10 bg-white/80 px-4 py-3 text-sm text-slate-600">
            Sign in first to open the sample project detail pages.
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {sampleProjects.map((project, index) => (
            <div
              key={project.id}
              className="rounded-[30px] border border-[var(--surface-line)] bg-[var(--surface-card)] p-7 shadow-[0_24px_80px_rgba(25,37,57,0.08)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#162a45] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                  Sample 0{index + 1}
                </span>
                <span className="rounded-full bg-[#efb540]/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8a5a00]">
                  {project.readiness}
                </span>
              </div>
              <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
                {project.name}
              </h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{project.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#162a45] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#203b63]"
                >
                  Open sample project
                </Link>
                <Link
                  href="/analyze"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-900/10 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Start your own analysis
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-slate-900/8 bg-[rgba(255,253,247,0.72)]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#1f8a7c]">
              FAQ
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              A few things users ask immediately.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-[26px] border border-[var(--surface-line)] bg-[var(--surface-card)] p-6"
              >
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">{faq.q}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
