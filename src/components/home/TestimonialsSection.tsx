import Image from "next/image";

export default function TestimonialsSection() {
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

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by the entire education ecosystem
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-slate-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author.name}
              className="group flex flex-col justify-between rounded-3xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5 hover:ring-indigo-200"
            >
              <blockquote className="text-slate-700">
                <p>{`"${testimonial.body}"`}</p>
              </blockquote>
              <div className="mt-8 flex items-center gap-x-4">
                <Image
                  className="h-10 w-10 rounded-full bg-slate-100 object-cover"
                  src={testimonial.author.imageUrl}
                  alt={testimonial.author.name}
                  width={40}
                  height={40}
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
