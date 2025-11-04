"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Video, Quote, Bot, Mic, MessageSquare, Calendar } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import StepsSection from "@/components/layout/stepsSection";
import { sendFeedbackEmail } from "@/actions/emailAction/feedbackEmail";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 100 characters long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters long")
    .max(100, "Subject must be at most 100 characters long"),
  message: z
    .string()
    .min(3, "Message must be at least 3 characters long")
    .max(500, "Message must be at most 1000 characters long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session && !isPending) {
      router.replace("/dashboard");
    }
  }, [session, isPending]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("subject", data.subject);
      formData.append("message", data.message);
      const result = await sendFeedbackEmail(formData);
      if (result.success) {
        toast.success("Message sent successfully");
        router.replace("/");
        setIsLoading(false);
        reset();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Meeting Notes",
      description:
        "Automatically generate smart meeting summaries and insights",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Recording & Transcription",
      description:
        "Record meetings and convert speech to text with high accuracy",
    },
    {
      icon: <FiLinkedin className="w-8 h-8" />,
      title: "LinkedIn Auto-Posting",
      description:
        "Generate & publish LinkedIn posts directly from meeting notes",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Stream-powered Calls",
      description: "High-quality video meetings powered by Stream Video SDK",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Real-Time Chat",
      description: "Chat during calls with seamless real-time messaging",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Scheduling Meetings",
      description: "Schedule and manage meetings with ease",
    },
  ];

  if (session && !isPending) {
    return <Skeleton className="h-screen" />;
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
              Connect Better, <br className="hidden md:block" /> Anywhere,
              Anytime
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
            >
              Experience seamless video conferencing with crystal clear audio
              and video quality. No downloads required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                onClick={() => router.replace("/register")}
                className="glass-button px-8 py-6 text-lg font-semibold text-black"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                onClick={() => router.replace("/login")}
                className="px-8 py-6 text-lg font-semibold text-black"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20" id="features">
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
      <StepsSection />
      <section className="relative py-20 px-5">
        <div className="max-w-4xl mx-auto text-center glass-card p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to start your next meeting?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of satisfied users who trust our platform for their
            video conferencing needs.
          </p>
          <div className="flex justify-center items-center">
            <Button
              onClick={() => router.replace("/register")}
              className="glass-button px-8 py-6 text-lg font-semibold text-black "
            >
              Create Instant Meeting
            </Button>
          </div>
        </div>
      </section>
      <section
        className="py-20 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-gray-900/30 px-5"
        id="contact"
      >
        <div className="glass-card p-12 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="glass-card p-2 w-full"
                    placeholder="Your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="glass-card p-2 w-full"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className="glass-card p-2 w-full"
                  placeholder="How can we help?"
                />
                {errors.subject && (
                  <p className="text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  className="glass-card p-2 w-full"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
                {errors.message && (
                  <p className="text-red-500">{errors.message.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" className="glass-button p-2">
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="relative py-10 glass-card-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} CallRio.ai All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-600 dark:text-gray-400 text-sm">
            <Link
              href="https://github.com/PriyanshuG24/callrio.ai"
              target="_blank"
              className="hover:text-blue-500 transition flex items-center gap-2"
            >
              <FiGithub className="w-6 h-6" />
              Github
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
