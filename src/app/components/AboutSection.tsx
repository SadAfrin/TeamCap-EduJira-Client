import Image from 'next/image';
import React from 'react';

// Feature items interface
interface FeatureItem {
  id: number;
  icon: string;
  title: string;
}

const features: FeatureItem[] = [
  { id: 1, icon: '🎓', title: 'Experienced Faculty' },
  { id: 2, icon: '💻', title: 'Modern Digital Lab' },
  { id: 3, icon: '🏆', title: 'Extracurricular Activities' },
  { id: 4, icon: '🛡️', title: 'Safe & Secure Campus' },
];

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Image Column */}
          <div className="relative w-full h-[350px] sm:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
              alt="School Campus"
              fill
              className="rounded-2xl shadow-xl object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg hidden sm:block">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm">Years of Educational Excellence</p>
            </div>
          </div>

          {/* Text Content Column */}
          <div>
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              Empowering Minds for Future Leadership
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At our institution, we empower every student to reach their full potential. Combining modern technology, a nurturing environment, and core moral values, we deliver top-quality education to build bright futures.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                >
                  <span className="text-blue-600 text-xl">{feature.icon}</span>
                  <span className="font-medium text-gray-800">{feature.title}</span>
                </div>
              ))}
            </div>

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md">
              Learn More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;