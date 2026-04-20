// Static FAQs for packages by destination
export const getPackageFAQs = (destination?: string) => {
  const commonFAQs = [
    {
      question: "What is included in the package price?",
      answer:
        "The package includes accommodations at the hotels mentioned, daily breakfast, sightseeing as per the itinerary, and professional guide services. Please check the 'What's Included' and 'Not Included' sections for a complete breakdown.",
    },
    {
      question: "Can I customize the package?",
      answer:
        "Yes, all packages can be customized based on your preferences, duration, budget, and travel style. Contact our team to discuss your requirements, and we'll create a personalized itinerary for you.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "Cancellations made 30 days before the trip are eligible for a full refund. Cancellations within 30 days will incur a 50% charge. Within 14 days, 100% of the package cost is non-refundable.",
    },
    {
      question: "Is travel insurance included?",
      answer:
        "Travel insurance is not included in the package price. However, we highly recommend purchasing comprehensive travel insurance to cover unforeseen circumstances like flight cancellations, medical emergencies, and trip delays.",
    },
    {
      question: "What are the transportation arrangements?",
      answer:
        "Transportation during the package is arranged as per the itinerary. This typically includes airport transfers, inter-city travel, and sightseeing tours. The mode of transport (car, coach, train) depends on the package details.",
    },
    {
      question: "How many people can book this package?",
      answer:
        "Our packages are flexible and can accommodate individuals, couples, families, and groups. Group discounts are available for bookings of 4 or more people. Contact us for group package pricing.",
    },
  ];

  const destinationFAQs: { [key: string]: any[] } = {
    jaipur: [
      {
        question: "What are the best places to visit in Jaipur?",
        answer:
          "Top attractions in Jaipur include Hawa Mahal (Palace of Winds), City Palace, Jantar Mantar, Amber Fort, and Albert Hall Museum. The Pink City is known for its stunning architecture and vibrant culture.",
      },
      {
        question: "How many days are needed to explore Jaipur?",
        answer:
          "Typically, 2-3 days are sufficient to explore major attractions in Jaipur. A 3-day itinerary allows you to visit all major forts, palaces, and museums without feeling rushed.",
      },
      {
        question: "Is Jaipur suitable for families?",
        answer:
          "Yes, Jaipur is very family-friendly with attractions suitable for all ages. Kids enjoy camel rides, the zoo, and interactive museums. The city is well-connected and safe for families.",
      },
      {
        question: "What is the local cuisine like in Jaipur?",
        answer:
          "Jaipur is famous for its traditional Rajasthani cuisine including dal-baati-churma, gatte ki sabzi, and bajra rotis. You'll also find excellent street food like pyaaz ki kachauris and moong dal halwa.",
      },
    ],
    udaipur: [
      {
        question: "What makes Udaipur special?",
        answer:
          "Udaipur, the 'City of Lakes,' is famous for its romantic atmosphere, stunning palaces, and beautiful lakes. Lake Pichola, City Palace, and Jag Mandir are iconic attractions that attract visitors from around the world.",
      },
      {
        question: "Is Udaipur good for romantic getaways?",
        answer:
          "Absolutely! Udaipur is one of India's most romantic destinations. Sunset boat rides on Lake Pichola, lakeside dining, and heritage palace stays create unforgettable romantic experiences.",
      },
      {
        question: "What water activities are available in Udaipur?",
        answer:
          "You can enjoy boat rides on Lake Pichola, visit floating palaces, paddleboarding, and sunset cruises. The lake offers a peaceful way to explore the city's beauty.",
      },
      {
        question: "How many days should I spend in Udaipur?",
        answer:
          "A 2-3 day stay is ideal to explore Lake Pichola, City Palace, visit Jag Mandir, enjoy a sunset boat ride, and experience the local culture and cuisine.",
      },
    ],
    jaisalmer: [
      {
        question: "What is the best time to visit Jaisalmer?",
        answer:
          "October to February is the ideal time to visit Jaisalmer when the weather is pleasant. The Sam Sand Dunes are particularly magical during winter nights with clear skies perfect for stargazing.",
      },
      {
        question: "Can I experience a desert safari in Jaisalmer?",
        answer:
          "Yes! Camel safaris in the Thar Desert near Sam are a highlight. You can enjoy sunset safaris, overnight desert camps, and authentic Rajasthani hospitality with dinner under the stars.",
      },
      {
        question: "What are the main attractions in Jaisalmer?",
        answer:
          "Key attractions include Jaisalmer Fort, Gadsisar Lake, Sam Sand Dunes, Amar Sagar Temple, and the yellow sandstone architecture throughout the city. The city itself is like walking through a fairytale.",
      },
      {
        question: "Is Jaisalmer suitable for adventure seekers?",
        answer:
          "Yes! Beyond camel safaris, you can enjoy jeep safaris, sandboarding, dune hiking, and quad biking. The desert landscape offers plenty of adventure activities.",
      },
    ],
    agra: [
      {
        question: "When is the best time to visit Agra and the Taj Mahal?",
        answer:
          "October to March is the best time when the weather is pleasant. Early morning (before 7 AM) is the ideal time to visit the Taj Mahal to avoid crowds and experience its beauty in soft light.",
      },
      {
        question: "What are the main attractions in Agra?",
        answer:
          "The Taj Mahal is the star attraction, but don't miss Agra Fort, Itmad-ud-Daulah's Tomb, and Mehtab Bagh. These monuments showcase the splendid Mughal architecture.",
      },
      {
        question: "How many days are needed for Agra?",
        answer:
          "1-2 days are sufficient to see the main attractions. A day trip is possible from Delhi, but an overnight stay allows for a relaxed experience and the magical Taj Mahal at sunrise.",
      },
      {
        question: "Can I visit the Taj Mahal multiple times?",
        answer:
          "Yes, you can visit the Taj Mahal as many times as you wish with the same ticket on the same day. Sunrise and sunset visits offer different photographic opportunities and atmospheres.",
      },
    ],
    delhi: [
      {
        question: "What are the must-see monuments in Delhi?",
        answer:
          "Must-visit monuments include India Gate, Qutub Minar, Red Fort, Jama Masjid, Humayun's Tomb, and Lodi Gardens. These represent different periods of Delhi's rich history.",
      },
      {
        question: "Is Delhi safe for tourists?",
        answer:
          "Yes, Delhi is generally safe for tourists. Exercise common precautions like avoiding deserted areas at night, using registered taxis or ride-sharing apps, and keeping valuables secure.",
      },
      {
        question: "How many days should I spend in Delhi?",
        answer:
          "2-3 days are sufficient to explore major attractions. Day 1: Old Delhi and monuments, Day 2: New Delhi and museums, Day 3: day trips to nearby areas or further exploration.",
      },
      {
        question: "What is the best way to explore Delhi?",
        answer:
          "Metro is the fastest and most affordable way to travel. For heritage walks, hire a local guide. Rickshaws and taxis work for short distances. Food walks in areas like Chandni Chowk offer authentic experiences.",
      },
    ],
    bikaner: [
      {
        question: "What makes Bikaner unique?",
        answer:
          "Bikaner is known for its rich desert heritage, magnificent forts and palaces, and camel breeding farms. The Junagarh Fort and Lalgarh Palace showcase stunning architecture.",
      },
      {
        question: "What is the Gajner Palace famous for?",
        answer:
          "Gajner Palace, a beautiful yellow sandstone structure, is famous for its architectural grandeur and is now a heritage hotel. It's a serene location perfect for experiencing royal heritage.",
      },
      {
        question: "Can I visit camel farms in Bikaner?",
        answer:
          "Yes, you can visit the National Camel Research Centre and local camel farms. It's an interesting experience to learn about camels and their importance to desert life.",
      },
      {
        question: "What is the local specialty food of Bikaner?",
        answer:
          "Bikaner is famous for its sweets and snacks, especially 'Namkeen' (savory items). Try local delicacies like moth ke laddu, khichdi, and various traditional Rajasthani dishes.",
      },
    ],
    kota: [
      {
        question: "What are the main attractions in Kota?",
        answer:
          "Key attractions include Bundi Palace, Garh Palace, Jag Mandir Palace, and Chambal Gardens. The city offers historical monuments and beautiful riverside views of the Chambal River.",
      },
      {
        question: "Is Kota a good destination for rafting?",
        answer:
          "Yes! The Chambal River offers exciting rafting opportunities. Water rafting with viewings of river dolphins and scenic landscapes is a major attraction in Kota.",
      },
      {
        question: "How far is Bundi from Kota?",
        answer:
          "Bundi is approximately 40 kilometers from Kota, about 45 minutes drive. Bundi Palace and step wells (baoris) make it a worthwhile day trip from Kota.",
      },
      {
        question: "What is special about Kota's art and culture?",
        answer:
          "Kota is famous for its miniature paintings and traditional handicrafts. The city has a rich artistic heritage reflected in its palaces and museums.",
      },
    ],
    ajmer: [
      {
        question: "What is the Ajmer Sharif Dargah?",
        answer:
          "The Ajmer Sharif Dargah is one of the most important Islamic pilgrimage sites in India, dedicated to Sufi saint Khawaja Moinuddin Chishti. It attracts pilgrims and visitors from around the world.",
      },
      {
        question: "What other attractions are in Ajmer?",
        answer:
          "Besides the Dargah, visit Ana Sagar Lake, Taragarh Fort, Aimer Pushkar Ajmer, and the Nasiyan Temple. The city has a serene spiritual atmosphere.",
      },
      {
        question: "Is Pushkar close to Ajmer?",
        answer:
          "Yes, Pushkar is only 15 kilometers from Ajmer, about 20 minutes away. Pushkar's temple, lake, and camel fair make it a popular extension to Ajmer visits.",
      },
      {
        question: "When is the Pushkar Camel Fair held?",
        answer:
          "The Pushkar Camel Fair is typically held in October-November for 5 days. It's one of the world's largest camel fairs with cultural performances, camel races, and trading activities.",
      },
    ],
  };

  // If destination is provided, combine destination-specific FAQs with common ones
  if (destination) {
    const destFAQs = destinationFAQs[destination.toLowerCase()] || [];
    return [...destFAQs, ...commonFAQs];
  }

  return commonFAQs;
};
