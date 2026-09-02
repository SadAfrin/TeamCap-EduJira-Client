import { heroSubjects } from "@/data/home";

export default function ReportCardWidget() {
  return (
    <div className="relative">
      <div className="ledger-rules rounded-lg border border-ink/15 bg-white/60 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-ink/20 pb-3">
          <div>
            <p className="font-display text-base font-medium">Term report</p>
            <p className="font-data text-xs text-ink/50">Class 8 · Section A</p>
          </div>
          <div
            className="seal-animate flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brass text-center font-data text-[10px] font-medium leading-tight text-brass"
            style={{ transform: "rotate(-8deg)" }}
          >
            AI
            <br />
            verified
          </div>
        </div>
        <div>
          {heroSubjects.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between border-b border-ink/10 py-2.5 last:border-0"
            >
              <div>
                <p className="text-sm">{s.name}</p>
                <p className="text-xs text-ink/50">{s.note}</p>
              </div>
              <span className="font-data text-sm font-medium text-chalk">
                {s.grade}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs italic text-ink/60">
          &ldquo;Consistent effort in problem-solving this term. Keep up the
          momentum in Bangla composition.&rdquo;
        </p>
      </div>
    </div>
  );
}