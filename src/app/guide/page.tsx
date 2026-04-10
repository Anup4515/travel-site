"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, Send, Calendar, User, AtSign } from "lucide-react";
import toast from "react-hot-toast";

export default function GuidePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDates: "",
    guideType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Guide request submitted! We'll contact you shortly.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      travelDates: "",
      guideType: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Hire a Tour{" "}
            <span className="text-blue-500 dark:text-yellow-400">Guide</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore with confidence — book an expert local guide for a
            personalized travel experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-8 h-fit">
            <h2 className="text-xl font-bold">Contact for Guide Booking</h2>

            {/* Call Us */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                <Phone size={24} className="text-blue-500 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Call Us</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  +91 98100 XXXXX
                </p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  +91 11 4XXX XXXX
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <MessageCircle size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp</p>
                <a
                  href="https://wa.me/9198100XXXXX"
                  className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                >
                  Chat with us instantly
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                <Mail size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  guides@aureotravels.com
                </p>
              </div>
            </div>
          </div>

          {/* Guide Request Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg space-y-6"
            >
              <h2 className="text-xl font-bold">Hire a Tour Guide</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <AtSign
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Travel Dates */}
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Dates</label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guide Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Guide Type</label>
                <select
                  name="guideType"
                  value={formData.guideType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="" disabled>
                    Select guide type...
                  </option>
                  <option value="city">City Tour Guide</option>
                  <option value="heritage">Heritage & Monument Guide</option>
                  <option value="adventure">Adventure & Trekking Guide</option>
                  <option value="wildlife">Wildlife & Nature Guide</option>
                  <option value="spiritual">Spiritual & Temple Guide</option>
                  <option value="food">Food & Culinary Guide</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us your group size, dates, preferred language, and guide requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Request a Guide
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
