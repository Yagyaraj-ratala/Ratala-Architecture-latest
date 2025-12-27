export default function BlogPage() {
  return (
    <div className="pt-40 pb-16 px-6 bg-white scroll-mt-32">
  <h4 id="page-title" className="text-4xl md:text-4xl font-bold text-center mb-10 pt-8">
        Transforming Spaces with{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Ratala Architecture
        </span>
      </h4>

      <div className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed space-y-8">
        {/* Introduction */}
        <p>
          In the heart of Nepal, <strong>Ratala Architecture & Interiors</strong> 
          is redefining modern living by combining creativity, functionality, and sustainability. 
          With over 15 years of experience, our studio delivers premium architectural solutions 
          that are both aesthetically inspiring and practical.
        </p>

        {/* Philosophy */}
        <h2 className="text-3xl font-semibold mt-10">The Philosophy of Ratala Architecture</h2>
        <p>
          At Ratala Architecture, we believe that architecture is not just about buildings—it’s about 
          <strong> creating spaces that enhance lifestyles</strong>. Every design is carefully planned 
          to balance functionality, comfort, and beauty.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Client-Centric Approach:</strong> Understanding your vision and turning it into reality.</li>
          <li><strong>Sustainable Design:</strong> Eco-friendly materials and energy-efficient solutions.</li>
          <li><strong>Innovative Technology:</strong> Using AI-driven simulations, 3D modeling, and cost estimation for precise results.</li>
        </ul>

        {/* Services */}
        <h2 className="text-3xl font-semibold mt-10">Our Services</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Residential Design:</strong> Modern apartments, luxury villas, and townhouses tailored to your lifestyle.</li>
          <li><strong>Commercial Spaces:</strong> Offices, retail stores, and co-working spaces that inspire productivity.</li>
          <li><strong>Interior Design:</strong> Personalized interiors that reflect your taste and optimize space.</li>
          <li><strong>3D Visualization & Cost Estimation:</strong> See your project before it’s built with realistic renderings and accurate budgeting.</li>
        </ul>

        {/* Why Choose Us */}
        <h2 className="text-3xl font-semibold mt-10">Why Choose Ratala Architecture</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Expertise across diverse architectural styles and modern design trends.</li>
          <li>Transparent cost estimation with AI-powered tools.</li>
          <li>Timely project delivery without compromising quality.</li>
          <li>Focus on sustainable and eco-friendly construction.</li>
        </ul>

        {/* Case Studies */}
        <h2 className="text-3xl font-semibold mt-10">Case Studies</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Modern Villa in Pepsicola:</strong> Combining luxury with minimalism, designed with energy-efficient materials.</li>
          <li><strong>Commercial Office in Kathmandu:</strong> Open-plan design for enhanced collaboration and productivity.</li>
        </ul>

        {/* Conclusion */}
        <h2 className="text-3xl font-semibold mt-10">Conclusion</h2>
        <p>
          Ratala Architecture is more than a design studio—it’s a <strong>partner in building your dream spaces</strong>. 
          From concept to execution, we ensure that every detail reflects your vision. Whether you are planning a home, office, 
          or commercial project, our expert team is ready to deliver innovative, functional, and beautiful designs.
        </p>

        {/* Call to Action */}
        <div className="text-center mt-6">
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-md hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
