"use client";

export default function StatsSection() {
  return (
    <section
      className="relative bg-gradient-to-r from-[#0F1E3E] via-[#23448b] to-[#DCE6F2]
 text-white py-12 px-6 sm:px-10 md:px-20"
    >
      {/* NEWS Ribbon */}
      <div className="flex">
        <div className="absolute top-0 left-0 bg-[#e8c13f] text-white font-bold px-12 py-4 rounded-br-2xl shadow-md">
          NEWS
        </div>

        {/* News Ticker */}
        <div className="text-lightcream  font-medium text-lg  text-center mb-8 border-b border-lightcream pb-2 whitespace-nowrap overflow-hidden">
          <marquee behavior="scroll" direction="left" scrollamount="5">
            Dubai cracks down on illegal, overcrowded apartments – AP News. UAE
            property sales hit $87 bn as luxury deals soar – Arabian Business.
            Dubai Market Expands Rapidly with High-End Developments.
          </marquee>
        </div>
      </div>
      {/* Stats Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 text-center">
        {/* Stat 1 */}
        <div>
          <h3 className="text-4xl sm:text-5xl font-bold text-[#d5b258]">
            2.70B
          </h3>
          <p className="text-[#d5b258] font-semibold mt-1 text-lg">
            Total Sales
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-[#d5b258]/60"></div>

        {/* Stat 2 */}
        <div>
          <h3 className="text-4xl sm:text-5xl font-bold text-[#d5b258]">
            524.21M
          </h3>
          <p className="text-[#d5b258] font-semibold mt-1 text-lg">
            Total Mortgaged
          </p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-[#d5b258]/60"></div>

        {/* Stat 3 */}
        <div>
          <h3 className="text-4xl sm:text-5xl font-bold text-[#d5b258]">
            317.42M
          </h3>
          <p className="text-[#d5b258] font-semibold mt-1 text-lg">Gifts</p>
        </div>
      </div>
    </section>
  );
}
