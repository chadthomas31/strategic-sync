import Link from "next/link";

export default function Booking() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Book an AI Consultation</h1>
      {/* Description */}
      <p className="text-lg text-center text-gray-600 mb-8">
        Choose the AI consulting session that best fits your needs.
      </p>
      {/* Booking Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free AI Consult */}
        <div className="p-6 border rounded-lg shadow-lg text-center bg-white">
          <h2 className="text-xl font-bold mb-3">🚀 Free AI Consultation</h2>
          <p className="text-gray-600 mb-4">A 45-minute session to explore AI solutions for your business.</p>
          <a
            href="https://cal.com/strategicsync/ai-consultation-45-min-free"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Book Now - Free
          </a>
        </div>

        {/* AI Readiness Assessment */}
        <div className="p-6 border rounded-lg shadow-lg text-center bg-white">
          <h2 className="text-xl font-bold mb-3">🤖 AI Readiness Assessment</h2>
          <p className="text-gray-600 mb-4">A 90-minute session for $299, assessing your business for AI integration.</p>
          <a
            href="https://cal.com/strategicsync/ai-assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Book Now - $299
          </a>
        </div>

        {/* AI Strategy Session */}
        <div className="p-6 border rounded-lg shadow-lg text-center bg-white">
          <h2 className="text-xl font-bold mb-3">📊 AI Strategy Session</h2>
          <p className="text-gray-600 mb-4">A 120-minute session for $499 to build a customized AI strategy.</p>
          <a
            href="https://cal.com/strategicsync/ai-strategy-session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Book Now - $499
          </a>
        </div>
      </div>
      {/* Embedded Calendar for Quick Booking */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Quick Book a Session</h2>
        <div className="flex justify-center">
          <iframe
            src="https://cal.com/strategicsync"
            style={{ height: "700px", width: "100%", border: "none" }}
            title="Cal.com Booking"
          ></iframe>
        </div>
      </div>
      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

