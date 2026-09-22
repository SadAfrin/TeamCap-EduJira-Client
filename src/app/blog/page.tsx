import Link from "next/link";
import StaticPage from "@/components/common/StaticPage";

const posts = [
  {
    title: "Why role-based dashboards matter in schools",
    summary:
      "Admins, teachers, parents, and students need different views of the same data. Here is how EduJira keeps each role focused.",
  },
  {
    title: "Using attendance trends before they become problems",
    summary:
      "Early pattern detection helps staff intervene sooner—without adding more manual reporting work.",
  },
  {
    title: "A practical guide to parent communication",
    summary:
      "Clear notices, translated messages, and fewer missed updates. Small changes that improve trust at home.",
  },
];

export default function BlogPage() {
  return (
    <StaticPage
      eyebrow="Blog"
      title="Ideas for modern school teams"
      description="Product updates, classroom operations tips, and notes from the EduJira team."
    >
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {post.summary}
            </p>
          </article>
        ))}
      </div>
      <p>
        Want product walkthroughs instead? Explore{" "}
        <Link href="/programs" className="font-medium text-indigo-600 hover:text-indigo-500">
          features
        </Link>{" "}
        or read more{" "}
        <Link href="/about" className="font-medium text-indigo-600 hover:text-indigo-500">
          about EduJira
        </Link>
        .
      </p>
    </StaticPage>
  );
}
