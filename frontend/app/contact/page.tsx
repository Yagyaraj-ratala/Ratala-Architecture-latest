"use client";

import { useState } from 'react';

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
    <div className="pt-24 pb-16 px-6 bg-white">
      {/* Page Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-10">
        Contact{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Ratala Architecture
        </span>
      </h1>

      <div className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed space-y-14">
        {/* Intro */}
        <p className="text-center">
          We would love to hear from you. Whether you are planning a new project,
          need expert consultation, or have general inquiries, our team is ready
          to assist you.
        </p>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p>
              1st Floor, Diagonally opposite Daura Thakali,
              <br />
              Pepsicola-32, Kathmandu, Nepal
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p>+977 9851325508</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p>info@ratalaarchitecture.com</p>
          </div>
        </div>

        {/* Office Location Map */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-center">
            Our Office Location
          </h2>

          <p className="text-center text-gray-600">
            Ratala Architecture – Pepsicola-32, Kathmandu
          </p>

          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
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
          <div className="text-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Ratala+Architecture+Pepsicola+Kathmandu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              Get Directions
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-3xl font-semibold text-center mb-6">
            Send Us a Message
          </h2>

          <form className="max-w-3xl mx-auto space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Full Name"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <input
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <input
              type="text"
              placeholder="Subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <textarea
              rows={5}
              placeholder="Your Message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {statusMessage && (
              <p className="text-center text-sm text-gray-700">{statusMessage}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
        {showToast && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowToast(false)} />
            <div className="relative bg-white rounded-lg shadow-xl w-[min(90%,640px)] mx-4">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-2xl font-extrabold text-green-600">{toastMessage}</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-gray-700">Thank you — your message has been submitted. We'll get back to you shortly.</p>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowToast(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
