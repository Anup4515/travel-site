"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface PackageFAQProps {
  faqs: FAQ[];
}

export default function PackageFAQ({ faqs }: PackageFAQProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3">
          <HelpCircle className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500 dark:text-yellow-400 transition-colors" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
            Frequently Asked <span className="text-blue-500 dark:text-yellow-400 transition-colors">Questions</span>
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg transition-colors">Common questions about this package</p>
      </motion.div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-yellow-400 transition-all shadow-md hover:shadow-lg"
          >
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full flex items-center justify-between p-4 sm:p-6 text-left focus:outline-none group\"
            >
              <span className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg pr-6 sm:pr-8 group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors\">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 sm:w-6 h-5 sm:h-6 text-blue-500 dark:text-yellow-400 shrink-0 transition-transform duration-300 ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openFaq === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
