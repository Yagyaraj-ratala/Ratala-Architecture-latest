"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "@/app/components/ui/Typography";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Calendar, User, Tag, Share2, Clock } from "lucide-react";

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

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`/api/blogs/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                } else {
                    // Handle 404
                    if (response.status === 404) {
                        router.push('/blogs');
                    }
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-8"></div>
                        <div className="h-12 w-3/4 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 w-full bg-gray-200 rounded-3xl mb-10"></div>
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-5%] w-[30%] h-[40%] bg-cyan-50/30 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[20%] right-[-5%] w-[25%] h-[35%] bg-blue-50/30 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    {/* Breadcrumbs / Back button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link href="/blogs" className="inline-flex items-center text-gray-500 hover:text-cyan-600 transition-colors gap-2 text-sm font-medium">
                            <ArrowLeft size={16} /> Back to Articles
                        </Link>
                    </motion.div>

                    {/* Post Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        {blog.category && (
                            <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                {blog.category}
                            </span>
                        )}
                        <Typography.H1 className="mb-6 leading-tight">
                            {blog.title}
                        </Typography.H1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                                    {blog.author ? blog.author.charAt(0) : 'R'}
                                </div>
                                <span className="font-medium text-gray-900">{blog.author || "Ratala Admin"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {new Date(blog.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {Math.ceil(blog.content.split(' ').length / 200)} min read
                            </div>
                        </div>
                    </motion.header>

                    {/* Featured Image */}
                    {blog.image_path && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-12 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src={`/uploads/${blog.image_path}`}
                                alt={blog.title}
                                className="w-full h-auto max-h-[500px] object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Summary/Intro */}
                    {blog.summary && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <p className="text-xl text-gray-700 font-medium italic border-l-4 border-cyan-500 pl-6 py-2">
                                {blog.summary}
                            </p>
                        </motion.div>
                    )}

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap"
                    >
                        {blog.content}
                    </motion.div>

                    {/* Footer of the post */}
                    <footer className="mt-16 pt-8 border-t border-gray-100">
                        <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shared by</span>
                                <span className="text-gray-900 font-medium">{blog.author || "Ratala Architecture & Interiors"}</span>
                            </div>
                            <div className="flex gap-4">
                                <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-16 text-center">
                            <Typography.H3 className="mb-4">Want more insights?</Typography.H3>
                            <Link href="/contact">
                                <Button variant="outline" className="px-8 border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                                    Book a Consultation
                                </Button>
                            </Link>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
