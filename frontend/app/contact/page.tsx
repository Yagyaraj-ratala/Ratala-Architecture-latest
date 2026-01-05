"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';
import { Typography } from '@/app/components/ui/Typography';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setStatusMessage('Please fill name, email and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, phone, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      const successText = 'Thank you Your Message has been sent successfully!';
      setStatusMessage(successText);
      setToastMessage(successText);
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 4000);
      setFullName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
    } catch (err) {
      console.error('Submit contact error:', err);
      setStatusMessage(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

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
              Contact{" "}
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
              We would love to hear from you. Whether you are planning a new project,
              need expert consultation, or have general inquiries, our team is ready
              to assist you.
            </Typography.P>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative py-12 md:py-16 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <MapPin className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              <Typography.H3 className="text-gray-800 mb-4">Address</Typography.H3>
              <Typography.P className="text-gray-700">
                1st Floor, Diagonally opposite Daura Thakali,
                <br />
                Pepsicola-32, Kathmandu, Nepal
              </Typography.P>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Phone className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              <Typography.H3 className="text-gray-800 mb-4">Phone</Typography.H3>
              <a
                href="tel:+9779851325508"
                className="text-gray-700 hover:text-cyan-500 transition-colors duration-300"
              >
                <Typography.P>+977 9851325508</Typography.P>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-5">
                <div className="p-3 bg-cyan-50 rounded-xl">
                  <Mail className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              <Typography.H3 className="text-gray-800 mb-4">Email</Typography.H3>
              <a
                href="mailto:info@ratalaarchitecture.com"
                className="text-gray-700 hover:text-cyan-500 transition-colors duration-300"
              >
                <Typography.P>info@ratalaarchitecture.com</Typography.P>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Location Map */}
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Typography.H2 className="text-gray-800 mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Office Location
              </span>
            </Typography.H2>
            <Typography.P className="text-gray-700">
              Ratala Architecture – Pepsicola-32, Kathmandu
            </Typography.P>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <iframe
                title="Ratala Architecture Map"
                src="https://www.google.com/maps?q=Ratala+Architecture+Pepsicola+Kathmandu&z=17&output=embed"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Get Directions Button */}
            <div className="text-center mt-8">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Ratala+Architecture+Pepsicola+Kathmandu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" animated={true}>
                  Get Directions
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Typography.H2 className="text-gray-800">
              Send Us a{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Message
              </span>
            </Typography.H2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <form className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-200 space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800"
                />
              </div>

              <div>
                <textarea
                  rows={5}
                  placeholder="Your Message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800 resize-none"
                  required
                />
              </div>

              {statusMessage && (
                <div className={`text-center text-sm p-3 rounded-lg ${statusMessage.includes('Thank you')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  {statusMessage}
                </div>
              )}

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  size="lg"
                  animated={!submitting}
                  className={submitting ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowToast(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <Typography.H3 className="text-green-600">{toastMessage}</Typography.H3>
            </div>
            <div className="px-6 py-5">
              <Typography.P className="text-gray-700">
                Thank you — your message has been submitted. We'll get back to you shortly.
              </Typography.P>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => setShowToast(false)}
                variant="primary"
                size="md"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
