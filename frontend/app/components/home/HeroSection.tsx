"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Phone, Mail, MapPin, User, MessageSquare, Briefcase, DollarSign, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Button Component (same as header)
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  animated = false,
}) => {
  const baseClasses = `
    rounded-lg font-semibold transition-all duration-300 transform 
    border relative overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600 
      text-white border-white/20 
      hover:scale-105 hover:shadow-lg
    `,
    secondary: `
      bg-gradient-to-r from-gray-700 to-gray-900 
      text-white border-white/20 
      hover:scale-105 hover:shadow-lg
    `,
    outline: `
      bg-transparent border-2 border-white 
      text-white hover:bg-white/10
      hover:scale-105
    `,
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base sm:text-lg",
    lg: "px-8 py-4 text-lg",
  };

  const animationClass = animated ? "float-3d" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${animationClass}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/10 hover:bg-white/5 transition-colors" />
    </button>
  );
};

// Define the slide data structure
interface Slide {
  image: string;
  title: string;
  subtitle: string;
  features: string[];
  primaryButton?: {
    text: string;
    action: () => void;
  };
}

export default function HomeHero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: ""
  });

  // Slide data
  const slides: Slide[] = [
    {
      image: "/ImageR1.jpg",
      title: "Modern Architectural Design",
      subtitle: "Innovative 3D visualization and cutting-edge architectural solutions",
      features: [
        "3D Design Visualization",
        "Sustainable Architecture",
        "Modern Construction Techniques",
        "Project Management"
      ],
      primaryButton: {
        text: "View Portfolio",
        action: () => router.push('/projects/completed')
      }
    },
    {
      image: "/interior1.jpg",
      title: "Luxury Interior Spaces",
      subtitle: "Transform your interiors with elegant, functional designs",
      features: [
        "Custom Interior Design",
        "Space Optimization",
        "Material Selection",
        "Lighting Design"
      ],
      primaryButton: {
        text: "Explore Services",
        action: () => router.push('/services')
      }
    },
    {
      image: "/interior2.jpg",
      title: "Sustainable Architecture",
      subtitle: "Eco-friendly designs harmonizing with nature and modern comfort",
      features: [
        "Green Building Materials",
        "Energy Efficient Design",
        "Natural Lighting",
        "Eco-friendly Solutions"
      ],
      primaryButton: {
        text: "Ongoing projects",
        action: () => router.push('/projects/ongoing')
      }
    }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message
        alert('Thank you! Your quote request has been submitted successfully.');
        setIsQuoteModalOpen(false);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          budget: "",
          message: ""
        });
      } else {
        throw new Error(result.error || 'Failed to submit quote');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes cinematicDrift {
          0% { transform: scale(1) translateX(0) translateY(0); }
          50% { transform: scale(1.05) translateX(-10px) translateY(-10px); }
          100% { transform: scale(1) translateX(0) translateY(0); }
        }
        .animate-cinematicDrift {
          animation: cinematicDrift 20s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.4s; }
        .delay-400 { animation-delay: 0.6s; }
        .delay-500 { animation-delay: 0.8s; }

        @keyframes float3D {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .float-3d { animation: float3D 3s ease-in-out infinite; }
      `}</style>

      <main className="relative h-[calc(100vh-64px)] min-h-[500px] sm:h-[85vh] md:h-screen w-full overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 bg-cover bg-center animate-cinematicDrift transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-800/50 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex items-center h-full px-4 sm:px-6 py-8 sm:py-12">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left Side - Main Content */}
              <div className="text-white">
                <h1
                  key={`title-${currentSlide}`}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 md:mb-7 bg-gradient-to-r from-white via-cyan-50 to-white bg-clip-text text-transparent leading-tight tracking-tight animate-fadeIn"
                >
                  {currentSlideData.title}
                </h1>

                <p
                  key={`subtitle-${currentSlide}`}
                  className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-5 sm:mb-7 md:mb-9 text-white/90 leading-relaxed font-normal animate-fadeIn delay-200"
                >
                  {currentSlideData.subtitle}
                </p>

                {/* Features List */}
                <div className="mb-5 sm:mb-7 md:mb-9 animate-fadeIn delay-300">
                  <ul className="space-y-2 sm:space-y-2.5 md:space-y-3.5">
                    {currentSlideData.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs sm:text-sm md:text-base lg:text-lg text-white/95 font-medium">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full mr-3.5 shadow-sm"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 animate-fadeIn delay-400">
                  {currentSlideData.primaryButton && (
                    <Button
                      onClick={currentSlideData.primaryButton.action}
                      size="md"
                      animated={true}
                    >
                      {currentSlideData.primaryButton.text}
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsQuoteModalOpen(true)}
                    variant="outline"
                    size="md"
                  >
                    Consult our team
                  </Button>
                </div>
              </div>

              {/* Right Side - CTA Card (hidden on mobile) */}
              <div className="hidden lg:block animate-fadeIn delay-500">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-2xl">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2.5 tracking-tight">Start Your Dream Project</h3>
                    <p className="text-white/80 text-base font-normal">Get expert consultation today</p>
                  </div>

                  <div className="space-y-4 mb-7">
                    <div className="flex items-center text-white/95">
                      <Phone className="w-5 h-5 mr-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-base font-medium">+977 9851325508</span>
                    </div>
                    <div className="flex items-center text-white/95">
                      <Mail className="w-5 h-5 mr-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-base font-medium">info@ratalaarchitecture.com</span>
                    </div>
                    <div className="flex items-center text-white/95">
                      <MapPin className="w-5 h-5 mr-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-base font-medium">Kathmandu, Nepal</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsQuoteModalOpen(true)}
                    size="lg"
                    animated={true}
                    className="w-auto px-10 mx-auto block"
                  >
                    Get Free Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </main>


      {/* Get Free Quote Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20"
            >
              {/* Decorative Header Background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-cyan-600 to-blue-700 -z-10 opacity-10" />

              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 pb-4 relative">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Get Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Consultation</span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Transform your vision into architectural reality.</p>
                </div>
                <button
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all duration-300 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 pt-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <User className="w-4 h-4 text-cyan-500" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <Mail className="w-4 h-4 text-cyan-500" /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <Phone className="w-4 h-4 text-cyan-500" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800"
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                        <Briefcase className="w-4 h-4 text-cyan-500" /> Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800 appearance-none cursor-pointer"
                      >
                        <option value="">Select project type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="interior">Interior Design</option>
                        <option value="renovation">Renovation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                      <DollarSign className="w-4 h-4 text-cyan-500" /> Estimated Budget
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select budget range</option>
                      <option value="5-10">5-10 Lakhs</option>
                      <option value="10-25">10-25 Lakhs</option>
                      <option value="25-50">25-50 Lakhs</option>
                      <option value="50-100">50 Lakhs - 1 Crore</option>
                      <option value="100+">1 Crore+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                      <MessageSquare className="w-4 h-4 text-cyan-500" /> Project Details
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all text-gray-800 resize-none"
                      placeholder="Tell us about your project requirements, location, timeline, etc."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-200 hover:shadow-cyan-300 transition-all duration-300 transform active:scale-95 disabled:grayscale"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Submit Quote Request"}
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-gray-400 mt-4">
                    * Our experts will contact you within 24 hours of submission.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}