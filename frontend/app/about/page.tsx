export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-6 bg-white">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-10">
        About{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Ratala Architecture
        </span>
      </h1>

      <div className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed space-y-8">
        <p>
          Ratala Architecture & Interiors is a Nepal-based premium architectural
          studio known for designing modern, intelligent, and aesthetically
          inspiring spaces. With over 15 years of experience, we combine
          creativity, technology, and craftsmanship to bring ideas to life.
        </p>

        <p>
          Our core philosophy is simple — design meaningful spaces that enhance
          lifestyle, functionality, and long-term value.
        </p>

        <h2 className="text-3xl font-semibold mt-10">Our Mission</h2>
        <p>
          To transform the architectural landscape of Nepal with sustainable,
          innovative, and budget-friendly design solutions.
        </p>

        <h2 className="text-3xl font-semibold mt-10">Our Vision</h2>
        <p>
          To be the most trusted and technologically advanced architecture studio
          in Nepal, delivering world-class projects accessible to everyone.
        </p>

        <h2 className="text-3xl font-semibold mt-10">Why Choose Us?</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Modern and future-ready designs</li>
          <li>AI-driven cost estimation and 3D simulations</li>
          <li>100% client satisfaction rate</li>
          <li>Sustainable and eco-friendly concepts</li>
          <li>Fast project delivery with precision</li>
        </ul>
      </div>
    </div>
  );
}
