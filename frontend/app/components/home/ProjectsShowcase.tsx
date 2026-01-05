"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";
import { ProjectCard } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface ApiProject {
  id: number;
  status: string;
  project_type: string;
  title: string;
  location: string;
  description: string | null;
  image_path: string | null;
  completed_date: string | null;
  created_at: string;
}

interface DisplayProject {
  image: string;
  title: string;
  location: string;
  category: string;
  href: string;
}

export default function ProjectsShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const [projects, setProjects] = useState<DisplayProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProjects = async () => {
      try {
        // Fetch both completed and ongoing projects
        const [completedRes, ongoingRes] = await Promise.all([
          fetch('/api/projects?status=completed'),
          fetch('/api/projects?status=ongoing')
        ]);

        if (!completedRes.ok || !ongoingRes.ok) {
          throw new Error('Failed to fetch projects');
        }

        const completedProjects: ApiProject[] = await completedRes.json();
        const ongoingProjects: ApiProject[] = await ongoingRes.json();

        // Combine and shuffle all projects
        const allProjects = [...completedProjects, ...ongoingProjects];

        if (allProjects.length === 0) {
          throw new Error('No projects in database');
        }

        // Shuffle array function
        const shuffleArray = <T,>(array: T[]): T[] => {
          const shuffled = [...array];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };

        // Shuffle and take first 3 projects
        const shuffledProjects = shuffleArray(allProjects).slice(0, 3);

        // Map to display format
        const mappedProjects: DisplayProject[] = shuffledProjects.map((project) => ({
          image: project.image_path ? `/uploads/${project.image_path}` : '/projects/ImageR1.jpg',
          title: project.title,
          location: project.location,
          category: project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1),
          href: `/projects/${project.status === 'completed' ? 'completed' : 'ongoing'}`,
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to default projects if API fails
        setProjects([
          {
            image: "/projects/ImageR1.jpg",
            title: "Luxury Villa",
            location: "Kathmandu, Nepal",
            category: "Residential",
            href: "/projects/completed",
          },
          {
            image: "/projects/interior1.jpg",
            title: "Modern Corporate Office",
            location: "Lalitpur, Nepal",
            category: "Commercial",
            href: "/projects/completed",
          },
          {
            image: "/projects/interior3.jpg",
            title: "Himalayan Resort Design",
            location: "Pokhara, Nepal",
            category: "Hospitality",
            href: "/projects/completed",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomProjects();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-white overflow-hidden"
    >
      {/* Ambient Glows */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-50/50 blur-[120px] rounded-full animate-float-slow"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[150px] rounded-full animate-float-slow"
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography.H2 className="mb-4 text-gray-800">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Recent Projects
            </span>
          </Typography.H2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-14"
        >
          <Typography.P className="text-center text-gray-700">
            Discover our latest architectural and interior creations — each one
            crafted with precision, sustainability, and a vision for modern living.
          </Typography.P>
        </motion.div>

        {/* Projects Grid - Using ProjectCard component */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
                <div className="bg-gray-200 rounded h-4 mb-2"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                image={project.image}
                title={project.title}
                location={project.location}
                category={project.category}
                href={project.href}
                size="md"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects available at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14"
        >
          <Link href="/projects/completed">
            <Button
              size="lg"
              animated={true}
            >
              View All Projects
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}