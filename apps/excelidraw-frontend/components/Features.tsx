import { Pen, Users, Zap, Globe, Layers, Lock, Share2, History } from 'lucide-react';

const features = [
  {
    name: 'Intuitive Drawing Tools',
    description: 'Sketch and draw with ease using our simple yet powerful tools.',
    icon: Pen,
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together with your team in real-time, no matter where you are.',
    icon: Users,
  },
  {
    name: 'Lightning Fast',
    description: 'Experience smooth and responsive drawing with our optimized performance.',
    icon: Zap,
  },
  {
    name: 'Accessible Anywhere',
    description: 'Access your whiteboards from any device with an internet connection.',
    icon: Globe,
  },
  {
    name: 'Infinite Canvas',
    description: 'Unlimited space to bring your ideas to life, with easy navigation.',
    icon: Layers,
  },
  {
    name: 'Secure and Private',
    description: 'Your drawings are encrypted and stored securely.',
    icon: Lock,
  },
  {
    name: 'Multi-User Editing',
    description: 'Multiple users can edit the same drawing simultaneously.',
    icon: Share2,
  },
  {
    name: 'Version History',
    description: 'Track and restore previous changes to your drawings effortlessly.',
    icon: History,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-white dark:bg-gray-900" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Everything you need to create and collaborate
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Excalidraw provides all the tools you need for effective visual collaboration.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
