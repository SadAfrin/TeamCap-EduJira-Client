import Link from "next/link";
import type { ReactNode } from "react";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: StaticPageProps) {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <section className="relative isolate overflow-hidden bg-slate-900 px-6 py-20 sm:py-24 lg:px-8">
        <div
          className="absolute -top-24 -right-24 -z-10 transform-gpu blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-1404/767 w-351 bg-linear-to-r from-indigo-500 to-cyan-500 opacity-20"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-400">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <div className="space-y-6 text-base leading-relaxed text-slate-600">
          {children}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <Link
            href="/"
            className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
