import Image from "next/image";

const testimonials = [
  {
    body: "Before EduJira, tracking attendance and updating report cards took me hours every weekend. Now, the AI handles the summaries, and I have my weekends back.",
    author: {
      name: "Sarah Jenkins",
      role: "High School Science Teacher",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    },
  },
  {
    body: "The early warning system is a game-changer. It flagged a drop in a student's engagement weeks before midterm exams, allowing us to intervene and get them back on track.",
    author: {
      name: "David Chen",
      role: "School Principal",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
    },
  },
  {
    body: "Finally, an app that doesn't feel like navigating a maze. I can see my daughter's timetable, missing assignments, and messages from teachers all on one simple dashboard.",
    author: {
      name: "Elena Rodriguez",
      role: "Parent",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
    },
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Bg decorations */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-72 w-72 rounded-full bg-indigo-50/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">Testimonials</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by the entire education ecosystem
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-sm leading-6 text-slate-900 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author.name}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-50/80 p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-2xl hover:shadow-indigo-900/5 hover:ring-indigo-200"
            >
              {/* Quote mark */}
              <div className="pointer-events-none absolute -top-2 -left-2 text-8xl font-bold text-indigo-100/60 leading-none select-none">
                &ldquo;
              </div>

              <blockquote className="relative text-slate-700">
                <p className="leading-relaxed">{testimonial.body}</p>
              </blockquote>

              <div className="mt-8 flex items-center gap-x-4 border-t border-slate-100 pt-6">
                <Image
                  className="h-11 w-11 rounded-full bg-slate-100 object-cover ring-2 ring-white"
                  src={testimonial.author.imageUrl}
                  alt={testimonial.author.name}
                  width={44}
                  height={44}
                />
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-slate-500">
                    {testimonial.author.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
