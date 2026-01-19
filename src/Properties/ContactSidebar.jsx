export default function ContactSidebar() {
  return (
    <div className=" bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-xl font-semibold text-darkGray mb-3">
        Call Me Instantly
      </h3>

      <p className="text-md text-gray-500 mb-4">
        Our executive will call you right now
      </p>

      <input
        type="tel"
        placeholder="Enter Phone Number"
        className="w-full border rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-[var(--brick-red)]"
      />

      <button className="w-full bg-brickred text-white py-3 rounded-lg font-semibold hover:bg-ochre transition">
        Call Me Now
      </button>

      {/* <div className="mt-5 border-t pt-4">
        <button className="w-full border border-brickred text-brickred py-3 rounded-lg hover:bg-ochre hover:text-white transition">
          Book Free Site Visit
        </button>
      </div> */}
    </div>
  );
}
