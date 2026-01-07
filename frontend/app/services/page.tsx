"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Home,
  Leaf,
  HardHat,
  Layers,
  Camera,
  Phone,
  Mail,
  Instagram,
  MessageSquare,
  AlertCircle,
  Tiktok,
  CheckCircle2,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { ServiceCard } from "@/app/components/ui/Card";
import { getUserData, getAuthToken } from "@/lib/auth-storage";

export default function ServicesPage() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserData();
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const services = [
    {
      icon: Building2,
      title: "Architectural Design",
      description:
        "Innovative architectural planning that combines modern design with practical functionality for both residential and commercial spaces.",
      image: "/services/architecture.jpg",
      link: "/services/architectural-design",
      contactRole: "Chief Architect",
      contactNumber: "+977 9851000001",
      email: "architect@ratala.com",
      facebook: "https://facebook.com/ratala.architect",
      instagram: "https://instagram.com/ratala.architect"
    },
    {
      icon: Home,
      title: "Interior Design",
      description:
        "Creative and functional interior designs that bring elegance, comfort, and personality to your living or workspace.",
      image: "/services/interior.jpg",
      link: "/services/interior-design",
      contactRole: "Head Interior Designer",
      contactNumber: "+977 9851000002",
      email: "interior@ratala.com",
      facebook: "https://facebook.com/ratala.interior",
      instagram: "https://instagram.com/ratala.interior"
    },
    {
      icon: Leaf,
      title: "Sustainable Architecture",
      description:
        "Eco-friendly designs focusing on energy efficiency, natural light, and materials that respect the environment.",
      image: "/services/sustainable.jpg",
      link: "/services/sustainable-architecture",
      contactRole: "Eco Consultant",
      contactNumber: "+977 9851000003",
      email: "eco@ratala.com",
      facebook: "https://facebook.com/ratala.eco",
      instagram: "https://instagram.com/ratala.eco"
    },
    {
      icon: HardHat,
      title: "Construction & Project Management",
      description:
        "End-to-end construction oversight ensuring your project is delivered on time, within budget, and with superior quality.",
      image: "/services/construction.jpg",
      link: "/services/construction-management",
      contactRole: "Site Supervisor",
      contactNumber: "+977 9851000004",
      email: "construction@ratala.com",
      facebook: "https://facebook.com/ratala.construction",
      instagram: "https://instagram.com/ratala.construction"
    },
    {
      icon: Camera,
      title: "3D Visualization & Rendering",
      description:
        "Realistic 3D renders and walkthroughs that let you visualize your project before construction begins.",
      image: "/services/visualization.jpg",
      link: "/services/3d-visualization",
      contactRole: "3D Artist",
      contactNumber: "+977 9851000005",
      email: "3d@ratala.com",
      facebook: "https://facebook.com/ratala.3d",
      instagram: "https://instagram.com/ratala.3d"
    },
    {
      icon: Layers,
      title: "Landscape & Urban Design",
      description:
        "Transforming outdoor environments into inspiring, sustainable, and functional spaces that blend with nature.",
      image: "/services/landscape.jpg",
      link: "/services/landscape-design",
      contactRole: "Landscape Architect",
      contactNumber: "+977 9851000006",
      email: "landscape@ratala.com",
      facebook: "https://facebook.com/ratala.landscape",
      instagram: "https://instagram.com/ratala.landscape",
      tiktok: "https://www.tiktok.com/@ratalaarchitecture"
    },
  ];

  return (
    <div className="pt-36 pb-20 px-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          {username && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-cyan-100"
            >
              <span className="text-gray-600 font-medium">Hello, </span>
              <span className="text-cyan-600 font-bold capitalize">{username}</span>
            </motion.div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Our{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Services
            </span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            From modern architecture to elegant interiors, we offer complete
            design and build solutions tailored to your vision and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ServiceCard
                key={index}
                image={service.image}
                title={service.title}
                description={service.description}
                href={service.link}
                size="md"
                className="relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 border border-transparent bg-white"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white mr-3 shadow-lg flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  {/* Contact Number Reveal for Logged In Users */}
                  {username && (
                    <ContactReveal
                      serviceTitle={service.title}
                      role={service.contactRole}
                      number={service.contactNumber}
                      email={service.email}
                      facebook={service.facebook}
                      instagram={service.instagram}
                      tiktok={service.tiktok || "https://www.tiktok.com/@ratalaarchitecture"}
                    />
                  )}
                </div>
              </ServiceCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContactReveal({
  serviceTitle,
  role,
  number,
  email,
  facebook,
  instagram
}: {
  serviceTitle: string;
  role: string;
  number: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
}) {
  const [show, setShow] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [problem, setProblem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch tickets for this service
  const fetchTickets = useCallback(async () => {
    setIsLoadingTickets(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`/api/tickets?service_name=${encodeURIComponent(serviceTitle)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const tickets = await response.json();
        const openTicket = tickets.find((t: any) => t.status === 'open');
        setActiveTicket(openTicket || null);

        // If we choose to edit, ensure form has latest content
        if (openTicket && isEditing) {
          setProblem(openTicket.problem_description);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoadingTickets(false);
    }
  }, [serviceTitle, isEditing]);

  const handleCloseTicket = async (ticketId: number) => {
    setIsSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'solved' })
      });
      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          fetchTickets();
          setSubmitStatus('idle');
        }, 2000);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const token = getAuthToken();
      const url = isEditing && activeTicket ? `/api/tickets/${activeTicket.id}` : '/api/tickets';
      const method = isEditing ? 'PATCH' : 'POST';
      const body = isEditing ? { problem_description: problem } : {
        service_name: serviceTitle,
        problem_description: problem
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSubmitStatus('success');
        if (!isEditing) setProblem("");
        setTimeout(() => {
          setShowTicketForm(false);
          setIsEditing(false);
          setSubmitStatus('idle');
          fetchTickets(); // Refresh tickets
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Ticket Submission Client Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-white/20">
      <AnimatePresence mode="wait">
        {!show ? (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShow(true);
              fetchTickets();
            }}
            className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium backdrop-blur-sm transition-colors flex items-center justify-center gap-2 group/reveal"
          >
            <Phone className="w-4 h-4 group-hover/reveal:scale-110 transition-transform" />
            Show Contact Info
          </motion.button>
        ) : (
          <motion.div
            key="info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-lg p-3 text-center shadow-xl border border-white/40 overflow-hidden"
            onClick={(e) => {
              // Only stop propagation to prevent card behavior, don't prevent default form behavior
              e.stopPropagation();
            }}
          >
            {!showTicketForm ? (
              <>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">{role}</p>

                <div className="flex flex-col gap-2">
                  <a href={`tel:${number}`} className="flex items-center justify-center gap-2 text-cyan-600 font-bold text-sm hover:text-cyan-700 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    {number}
                  </a>

                  <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 text-gray-600 font-medium text-xs hover:text-cyan-600 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    {email}
                  </a>

                  <div className="flex items-center justify-center gap-4 mt-1 pt-1 border-t border-gray-100">
                    <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-1 px-2.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold">
                      <Facebook className="w-3 h-3" />
                      FB
                    </a>
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-1 px-2.5 rounded-md bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold">
                      <Instagram className="w-3 h-3" />
                      IG
                    </a>
                    <a href={tiktok} target="_blank" rel="noopener noreferrer" className="p-1 px-2.5 rounded-md bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold">
                      <FaTiktok className="w-3 h-3" />
                      TK
                    </a>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-2">
                  {isLoadingTickets ? (
                    <div className="py-2 text-[10px] text-gray-400 animate-pulse">Checking status...</div>
                  ) : activeTicket ? (
                    <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                      <p className="text-[10px] text-yellow-700 font-bold flex items-center justify-center gap-1 mb-2">
                        <AlertCircle className="w-3 h-3" />
                        Active Ticket
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCloseTicket(activeTicket.id)}
                          disabled={isSubmitting}
                          className="flex-1 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-[10px] font-bold transition-colors"
                        >
                          {isSubmitting ? '...' : 'Mark Solved'}
                        </button>
                        <button
                          onClick={() => {
                            setProblem(activeTicket.problem_description);
                            setIsEditing(true);
                            setShowTicketForm(true);
                          }}
                          className="flex-1 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-[10px] font-bold transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProblem("");
                        setShowTicketForm(true);
                      }}
                      className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 border border-red-100"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Raise Problem Ticket
                    </button>
                  )}

                  <button
                    onClick={() => setShow(false)}
                    className="text-[10px] text-gray-400 hover:text-gray-600 underline font-medium"
                  >
                    Hide
                  </button>
                </div>
              </>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmitTicket}
                className="text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    {isEditing ? 'Edit Ticket' : 'Report a Problem'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTicketForm(false);
                      setIsEditing(false);
                      setSubmitStatus('idle');
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                </div>

                {submitStatus === 'success' ? (
                  <div className="py-4 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-green-600 font-bold">
                      {isEditing ? 'Ticket Updated!' : 'Ticket Submitted!'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {isEditing ? 'Changes saved.' : 'We will contact you soon.'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Service</label>
                      <div className="text-[11px] font-semibold text-gray-700 truncate">{serviceTitle}</div>
                    </div>

                    <div className="mb-3">
                      <label className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Problem Description</label>
                      <textarea
                        required
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Please describe the issue..."
                        className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 focus:ring-1 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                        rows={3}
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-[10px] text-red-500 font-medium mb-2">Something went wrong. Please try again.</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-2 rounded-md text-xs font-bold text-white transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-100'
                        }`}
                    >
                      {isSubmitting ? 'Saving...' : (isEditing ? 'Update Ticket' : 'Submit Problem Ticket')}
                    </button>
                  </>
                )}
              </motion.form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
