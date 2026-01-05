"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";
import { Button } from "@/app/components/ui/Button";
import { Lightbulb, Building2, Award, FileText, CheckCircle2, User, Calendar, ArrowRight } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  author: string | null;
  image_path: string | null;
  category: string | null;
  created_at: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-cyan-50/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-[-80px] w-[450px] h-[450px] bg-blue-50/40 blur-3xl rounded-full"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography.H1 className="mb-6">
              Transforming Spaces with{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Ratala Architecture
              </span>
            </Typography.H1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Typography.P className="text-gray-700 text-lg md:text-xl">
              Insights, trends, and inspiration from the world of architecture and interiors.
              Discover how we're redefining modern living in Nepal.
            </Typography.P>
          </motion.div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Typography.H2 className="text-gray-900 mb-2">Latest Articles</Typography.H2>
              <div className="h-1.5 w-20 bg-cyan-500 rounded-full"></div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    {blog.image_path ? (
                      <img
                        src={`/uploads/${blog.image_path}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-cyan-50 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-cyan-200" />
                      </div>
                    )}
                    {blog.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-cyan-600 text-xs font-bold rounded-full uppercase tracking-wider">
                          {blog.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {blog.author || "Ratala Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <Typography.H3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {blog.title}
                    </Typography.H3>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {blog.summary || (blog.content.length > 150 ? blog.content.substring(0, 150) + '...' : blog.content)}
                    </p>

                    <div className="mt-auto">
                      <Link href={`/blogs/${blog.slug}`} className="inline-flex items-center text-cyan-600 font-semibold text-sm hover:gap-2 transition-all">
                        Read Full Article <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Typography.P className="text-gray-500">No articles published yet. Check back soon!</Typography.P>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
