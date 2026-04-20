 "use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">Get in <span className="text-blue-500 dark:text-yellow-400">Touch</span></h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Have a question or want to plan a trip? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            {[
              { icon: Mail, title: "Email", text: "info@aureotravels.com", sub: "We reply within 24 hours" },
              { icon: Phone, title: "Phone", text: "+91 98765 43210", sub: "Mon-Sat, 9am-6pm IST" },
              { icon: MapPin, title: "Office", text: "Jaipur, Rajasthan, India", sub: "Visit us anytime" },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-sm flex items-start gap-3 sm:gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-xl shrink-0"><item.icon size={20} className="sm:w-6 text-blue-500 dark:text-yellow-400" /></div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base\">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm break-words\">{item.text}</p>
                  <p className="text-gray-500 text-xs sm:text-sm\">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium dark:text-gray-300 mb-1 sm:mb-2">Your Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium dark:text-gray-300 mb-1 sm:mb-2">Your Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium dark:text-gray-300 mb-1 sm:mb-2">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell us about your travel plans..." />
              </div>
              <button type="submit" className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 text-sm sm:text-base">
                <Send size={16} className="sm:w-[18px]" />Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Find Us On <span className="text-blue-500 dark:text-yellow-400\">The Map</span></h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400\">Visit our office in Jaipur, Rajasthan</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.794040145211!2d75.78263!3d26.91246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4c2e0000001%3A0x0!2sJaipur%2C%20Rajasthan%20302001!5e0!3m2!1sen!2sin!4v1234567890123"
                style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
