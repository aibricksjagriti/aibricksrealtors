"use client";
import Image from "next/image";

export default function InfographicSection() {
  const items = [
    {
      title: "Some title can be here",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      icon: "/icons/lightbulb.svg",
      color: "bg-cyan-400",
    },
    {
      title: "Some title can be here",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      icon: "/icons/helmet.svg",
      color: "bg-blue-400",
    },
    {
      title: "Some title can be here",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      icon: "/icons/megaphone.svg",
      color: "bg-purple-400",
    },
    {
      title: "Some title can be here",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
      icon: "/icons/target.svg",
      color: "bg-pink-400",
    },
  ];

  return (
    <section className="w-full flex flex-col items-center justify-center py-16 px-4 bg-white">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left side */}
        <div className="flex flex-col gap-20 md:gap-32">
          {items.slice(0, 2).map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row-reverse items-center md:items-start text-center md:text-right gap-4"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color}`}
              >
                <Image src={item.icon} alt="icon" width={28} height={28} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center paper plane */}
        <div className="flex justify-center items-center">
          <Image
            src="/icons/paperplane.svg"
            alt="paper plane"
            width={220}
            height={220}
            className="w-48 sm:w-60 md:w-72"
          />
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-20 md:gap-32">
          {items.slice(2, 4).map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color}`}
              >
                <Image src={item.icon} alt="icon" width={28} height={28} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
