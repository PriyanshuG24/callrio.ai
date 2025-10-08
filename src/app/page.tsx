'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Video, Users, Zap, Quote} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import {Skeleton} from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session && !isPending) {
      router.replace('/dashboard');
    }
  }, [session, isPending]);



  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "HD Video Calls",
      description: "Crystal clear video quality for all your meetings"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with your team"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Low latency connections for smooth conversations"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      feedback: "The video quality is amazing and the platform is super easy to use!"
    },
    {
      name: "David Lee",
      role: "Software Engineer",
      feedback: "Finally a video platform that doesn’t lag. My team loves it!"
    },
    {
      name: "Emily Carter",
      role: "Designer",
      feedback: "The UI feels so smooth and modern. Highly recommended!"
    }
  ];
  if(session && !isPending){
    return <Skeleton className="h-screen"/>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
       

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6"
            >
              Connect Better, <br className="hidden md:block" /> Anywhere, Anytime
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
            >
              Experience seamless video conferencing with crystal clear audio and video quality. No downloads required.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button 
                onClick={() => router.replace('/register')}
                className="glass-button px-8 py-6 text-lg font-semibold text-black"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.replace('/login')}
                className="px-8 py-6 text-lg font-semibold text-black"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
            Loved by teams worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-card p-6 flex flex-col items-center"
              >
                <Quote className="w-8 h-8 text-blue-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{t.feedback}"
                </p>
                <span className="font-semibold text-gray-900 dark:text-white">{t.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{t.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center glass-card p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to start your next meeting?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of satisfied users who trust our platform for their video conferencing needs.
          </p>
          <Button 
            onClick={() => router.replace('/register')}
            className="glass-button px-8 py-6 text-lg font-semibold text-black"
          >
            Create Instant Meeting
          </Button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative py-10 glass-card-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} CallRio.ai All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-600 dark:text-gray-400 text-sm">
            <Link href="#" className="hover:text-blue-500 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-500 transition">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-500 transition">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
