"use client";

import Image from "next/image";
import { useState } from "react";
import { Phone, MessageCircle, Mail, Send, Calendar, User, AtSign } from "lucide-react";
import toast from "react-hot-toast";

export default function GuidePage() {
  const today = new Date().toISOString().split("T")[0];
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    toast.success("Message Sent! Our travel experts will get back to you within 24 hours.");
    setIsSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      travelDates: "",
      guideType: "",
      message: "",
    });
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Hire Local Tour Guides in Rajasthan &amp; Agra
            </h1>
            <p className="mt-5 text-gray-700 dark:text-gray-300 text-lg">
              Explore Jaipur, Udaipur, Jaisalmer, Agra &amp; more with certified local guides.
              Flexible pricing, multilingual support, and unforgettable experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#guide-booking"
                className="bg-blue-600 dark:bg-yellow-400 text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Book a Guide
              </a>
              <a
                href="#guide-pricing"
                className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              >
                View Pricing
              </a>
            </div>
          </div>
          <div className="relative w-full h-70 md:h-90 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/Guide/guide-hero.png"
              alt="Tour Guide"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>

        {/* Guide Information Content */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 md:p-10 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Hire Professional Tour Guides in Rajasthan &amp; Golden Triangle
          </h2>

          <div className="space-y-5 text-gray-700 dark:text-gray-300">
            <p>
              Exploring destinations like Jaipur, Udaipur, Jaisalmer, Delhi, and Agra becomes far
              more meaningful when accompanied by a knowledgeable local tour guide. At
              AureoTravels, we provide certified and experienced guides who help you understand
              the rich history, culture, architecture, and local stories behind every monument you
              visit. Whether you are visiting the majestic forts of Rajasthan or iconic landmarks
              like the Taj Mahal, our guides ensure that your journey is not just a visit, but a
              complete experience.
            </p>
            <p>
              Our tour guide services are designed for all types of travelers - solo tourists,
              couples, families, and large groups. The guide charges are structured based on group
              size and duration of service, ensuring flexibility and affordability. You can choose
              between half-day tours (up to 4 hours) or full-day tours (4 to 8 hours), depending
              on your itinerary. Larger groups may require more coordination and assistance, which
              is reflected in the pricing structure.
            </p>

            {/* Guide Pricing Tables */}
            <div id="guide-pricing" className="space-y-8 my-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 overflow-hidden w-full max-w-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Guide Charges</h3>
                <div className="overflow-x-auto md:overflow-visible pb-1 md:pb-0" style={{ WebkitOverflowScrolling: "touch" }}>
                  <table className="w-full text-left border-collapse text-sm sm:text-base" style={{ minWidth: "400px" }}>
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 pr-4 font-semibold">Group</th>
                      <th className="py-3 pr-4 font-semibold">Half Day</th>
                      <th className="py-3 font-semibold">Full Day</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 pr-4">1-5 Persons</td>
                      <td className="py-3 pr-4">Rs 2050</td>
                      <td className="py-3">Rs 2500</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 pr-4">6-14 Persons</td>
                      <td className="py-3 pr-4">Rs 2500</td>
                      <td className="py-3">Rs 3250</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">15-40 Persons</td>
                      <td className="py-3 pr-4">Rs 3350</td>
                      <td className="py-3">Rs 4350</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 overflow-hidden w-full max-w-full">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Language Allowance</h3>
                <div className="overflow-x-auto md:overflow-visible pb-1 md:pb-0" style={{ WebkitOverflowScrolling: "touch" }}>
                  <table className="w-full text-left border-collapse text-sm sm:text-base" style={{ minWidth: "400px" }}>
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 pr-4 font-semibold">Group</th>
                      <th className="py-3 pr-4 font-semibold">Half Day</th>
                      <th className="py-3 font-semibold">Full Day</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 pr-4">1-14 Persons</td>
                      <td className="py-3 pr-4">Rs 600</td>
                      <td className="py-3">Rs 800</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">15+ Persons</td>
                      <td className="py-3 pr-4">Rs 700</td>
                      <td className="py-3">Rs 1000</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Outstation Allowance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Excursion (100+ km)</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rs 1700 per day</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Without Stay</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rs 4750 per night</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">With Stay</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rs 1750 per night</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                What are Guide Charges?
              </h3>
              <p>
                Guide charges refer to the professional fee for a licensed tour guide who
                accompanies you throughout your sightseeing experience. These charges vary depending
                on the number of travelers in your group and the duration of the tour. A
                well-trained guide enhances your journey by providing historical context, managing
                your itinerary efficiently, and helping you explore hidden details that you might
                otherwise miss.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                What is Language Allowance?
              </h3>
              <p>
                For international travelers or those who prefer communication in a specific
                language, we offer multilingual tour guides. Language allowance is an additional
                charge applicable when you require a guide fluent in foreign languages such as
                French, Spanish, German, Italian, or others. This ensures smooth communication,
                better understanding of cultural nuances, and a more personalized travel experience.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Excursion &amp; Outstation Allowance Explained
              </h3>
              <p>
                When your travel extends beyond city limits (typically more than 100 km), an
                excursion allowance is applicable. This covers situations where the guide
                accompanies you for long-distance travel without an overnight stay. For trips that
                involve overnight stays outside the city, an outstation allowance is charged
                depending on whether accommodation and meals are provided to the guide or not.
              </p>
              <p className="mt-3">
                These allowances ensure that guides are fairly compensated for extended travel hours
                and additional responsibilities, while still maintaining transparent and
                standardized pricing for travelers.
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Why Choose AureoTravels for Tour Guides?
              </h3>
              <p>
                At AureoTravels, we focus on delivering not just services, but memorable travel
                experiences. All our guides are verified, professional, and trained to provide
                accurate information with a friendly approach. Our pricing is transparent, with no
                hidden charges, and aligned with standard guidelines.
              </p>
            </div>

            <ul className="list-disc pl-6 space-y-2 pt-2 text-gray-800 dark:text-gray-200">
              <li>Certified and experienced local guides</li>
              <li>Multi-language support for international travelers</li>
              <li>Transparent and standardized pricing</li>
              <li>Flexible booking options based on your itinerary</li>
              <li>Personalized experiences for individuals and groups</li>
            </ul>
          </div>
        </section>

        {/* Guide Services and Prices */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Guide Services and Prices</h2>
        </section>

        {/* Contact and Booking Form */}
        <section id="guide-booking" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Message Sent!</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our travel experts will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center bg-blue-600 dark:bg-yellow-400 text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
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
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
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
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
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
                          min={today}
                          value={formData.travelDates}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 appearance-none"
                    >
                      <option value="" disabled>
                        Select guide type...
                      </option>
                      <option value="half-day">Half Day Guide</option>
                      <option value="full-day">Full Day Guide</option>
                      <option value="outstation">Outstation Guide</option>
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-yellow-400 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-yellow-400 text-white dark:text-black px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Request a Guide
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
