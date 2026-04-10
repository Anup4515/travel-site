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
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">Get in <span className="text-blue-500 dark:text-yellow-400">Touch</span></h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Have a question or want to plan a trip? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email", text: "info@aureotravels.com", sub: "We reply within 24 hours" },
              { icon: Phone, title: "Phone", text: "+91 98765 43210", sub: "Mon-Sat, 9am-6pm IST" },
              { icon: MapPin, title: "Office", text: "Jaipur, Rajasthan, India", sub: "Visit us anytime" },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl"><item.icon size={24} className="text-blue-500 dark:text-yellow-400" /></div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                  <p className="text-gray-500 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell us about your travel plans..." />
              </div>
              <button type="submit" className="bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2">
                <Send size={18} />Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
