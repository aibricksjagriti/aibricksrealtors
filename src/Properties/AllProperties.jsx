"use client";
import { motion } from "framer-motion";
import { MapPin, Bed, Ruler, Calendar, Building2, Flame } from "lucide-react";

const projects = [
  {
    name: "Sobha SkyParks",
    developer: "Sobha",
    location: "Dubai",
    type: "Apartments, Residential",
    bedrooms: "1 to 4 Bedroom",
    area: "1509.75 sq.ft",
    completion: "Q4 2031",
    price: "2.9M AED",
    image: "/home/abu-dhabi.webp",
    tag: "Trending",
  },
  {
    name: "Damac Islands",
    developer: "Damac",
    location: "Dubai",
    type: "Townhouse, Villa",
    bedrooms: "4 to 5 Bedrooms",
    area: "17078 sq.ft",
    completion: "Q3 2027",
    price: "2.8M AED",
    image: "/home/ajman.webp",
    tag: "Trending",
  },
  {
    name: "Riverside Views – Azure 2",
    developer: "Damac",
    location: "Dubai",
    type: "Apartments",
    bedrooms: "1 to 2 Bedroom",
    area: "1039 sq.ft",
    completion: "Q1 2029",
    price: "628.0K AED",
    image: "/home/dubai.webp",
    tag: "Trending",
  },
  // 🌆 Pune Properties
  {
    developer: "Godrej",
    name: "Godrej Horizon",
    type: "Apartments, Residential",
    location: "Pune",
    bedrooms: "2 to 4 Bedrooms",
    area: "1450 sq.ft",
    completion: "Q2 2028",
    price: "1.2 Cr INR",
    tag: "Trending",
    image: "/home/properties/godrej-horizon.jpg",
  },
  {
    developer: "Kolte Patil",
    name: "Kolte Patil Universe",
    type: "Apartments",
    location: "Pune",
    bedrooms: "2 to 3 Bedrooms",
    area: "1280 sq.ft",
    completion: "Q4 2027",
    price: "98L INR",
    tag: "Trending",
    image: "/home/properties/kolte-patil-universe.jpg",
  },
  {
    developer: "Lodha",
    name: "Lodha Bella Vita",
    type: "Luxury Villas",
    location: "Pune",
    bedrooms: "3 to 5 Bedrooms",
    area: "2500 sq.ft",
    completion: "Q3 2029",
    price: "2.3 Cr INR",
    tag: "Trending",
    image: "/home/properties/lodha-bella-vita.webp",
  },

  // 🌇 Mumbai Properties
  {
    developer: "Oberoi",
    name: "Oberoi Sky City",
    type: "Apartments",
    location: "Mumbai",
    bedrooms: "2 to 4 Bedrooms",
    area: "1800 sq.ft",
    completion: "Q1 2030",
    price: "3.8 Cr INR",
    tag: "Trending",
    image: "/home/properties/obroi-sky-city.jpg",
  },
  {
    developer: "Lodha",
    name: "Lodha Park",
    type: "Apartments, Duplex",
    location: "Mumbai",
    bedrooms: "2 to 5 Bedrooms",
    area: "2200 sq.ft",
    completion: "Q4 2028",
    price: "5.2 Cr INR",
    tag: "Trending",
    image: "/home/properties/lodha-park.jpg",
  },
  {
    developer: "Godrej",
    name: "Godrej Bayview",
    type: "Apartments",
    location: "Mumbai",
    bedrooms: "1 to 3 Bedrooms",
    area: "1200 sq.ft",
    completion: "Q2 2029",
    price: "2.4 Cr INR",
    tag: "Trending",
    image: "/home/properties/Godrej-Bayview.webp",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function AllProperties() {
  return (
    <section className=" py-16  px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Heading */}
          <div className="pb-20">
            <div className="flex justify-center mb-2">
              <Building2 size={40} className="text-[var(--color-ochre)]" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-[var(--color-darkgray)] uppercase">
              Our Properties
            </h2>
          </div>
        </motion.div>

        {/* Project Cards Grid */}
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-3 
            gap-8 
            place-items-center
          "
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                relative bg-white 
                rounded-3xl overflow-hidden 
                shadow-lg 
                w-full max-w-[370px] 
                transition-all duration-500 
                hover:shadow-2xl 
                hover:-translate-y-2
              "
            >
              {/* Image */}
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                <motion.img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Developer Tag */}
                <div className="absolute top-4  bg-[#e8c13f] text-[var(--color-darkgray)]  sm:text-sm font-lg px-3 py-1 rounded-br-xl rounded-tr-xl font-semibold">
                  <p className="text-lg">{p.developer}</p>
                </div>
                {/* Trending Tag */}
                <div className="absolute bottom-2 right-0 bg-[#e8c13f] text-[var(--color-darkgray)] text-xs sm:text-sm font-semibold px-3 py-1  flex items-center gap-1 rounded-bl-xl rounded-tl-xl">
                  <p className="text-lg flex">
                    <Flame size={24} className="text-[var(--color-darkgray)]" />{" "}
                    {p.tag}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 text-left">
                <h3 className="text-[var(--color-darkgray)] text-xl sm:text-xl font-semibold mb-1 hover:text-[var(--color-brickred)] transition-colors cursor-pointer">
                  {p.name}
                </h3>
                <p className="text-gray-500 text-lg mb-4">{p.type}</p>

                <div className="flex flex-col gap-2 text-gray-600 text-sm mb-4">
                  <p className="flex items-center gap-2 text-md">
                    <MapPin size={16} /> {p.location}
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Bed size={16} /> {p.bedrooms}
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Ruler size={16} /> {p.area}
                  </p>
                  <p className="flex items-center gap-2 text-md">
                    <Calendar size={16} /> {p.completion}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-[var(--color-brickred)] font-bold text-base sm:text-lg">
                    {p.price}
                  </span>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[var(--color-brickred)] text-white text-xs sm:text-sm px-4 py-2 rounded-md hover:bg-[var(--color-ochre)] transition"
                  >
                    Enquire Now
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
