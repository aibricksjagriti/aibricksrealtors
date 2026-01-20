// "use client";

// import { useEffect, useState } from "react";
// import {
//   User,
//   Phone,
//   Mail,
//   Save,
//   Home,
//   CalendarCheck,
//   Building2,
// } from "lucide-react";
// import toast from "react-hot-toast";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//   });

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("user"));
//     if (stored) {
//       setUser({
//         name: stored.name || "",
//         email: stored.email || "",
//         phoneNumber: stored.phoneNumber || "",
//       });
//     }
//   }, []);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({
//             name: user.name,
//             phoneNumber: user.phoneNumber,
//           }),
//         },
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);

//       toast.success("Profile updated successfully");

//       localStorage.setItem("user", JSON.stringify({ ...user }));
//     } catch (err) {
//       toast.error(err.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f6f9] pt-24 pb-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* ===== HERO BANNER ===== */}
//         <div className="relative bg-gradient-to-r from-brickred to-ochre rounded-3xl p-10 text-white shadow-xl overflow-hidden">
//           <div className="relative z-10">
//             <h1 className="text-3xl font-bold">
//               Welcome back, {user.name || "User"} 👋
//             </h1>
//             <p className="mt-2 text-white/80 max-w-xl">
//               Manage your profile, explore properties and keep track of your
//               activity with AI Bricks.
//             </p>
//           </div>

//           {/* Decorative shapes */}
//           <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
//         </div>

//         {/* ===== STATS ===== */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
//             <Home className="text-ochre mb-3" size={30} />
//             <h3 className="text-xl font-semibold">Properties Viewed</h3>
//             <p className="text-gray-500 text-sm mt-1">12+ Listings</p>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
//             <CalendarCheck className="text-ochre mb-3" size={30} />
//             <h3 className="text-xl font-semibold">Site Visits</h3>
//             <p className="text-gray-500 text-sm mt-1">3 Scheduled</p>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
//             <Building2 className="text-ochre mb-3" size={30} />
//             <h3 className="text-xl font-semibold">Saved Projects</h3>
//             <p className="text-gray-500 text-sm mt-1">5 Shortlisted</p>
//           </div>
//         </div>

//         {/* ===== PROFILE SECTION ===== */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
//           {/* LEFT CARD */}
//           <div className="bg-white rounded-2xl shadow p-8">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 bg-ochre text-white rounded-full flex items-center justify-center text-3xl font-bold">
//                 {user.name?.charAt(0)?.toUpperCase() || "U"}
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold">{user.name}</h3>
//                 <p className="text-gray-500 text-sm">{user.email}</p>
//               </div>
//             </div>

//             <div className="mt-6 text-sm text-gray-600">
//               Your profile helps us personalize property suggestions and site
//               visits for you.
//             </div>
//           </div>

//           {/* RIGHT FORM */}
//           <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
//             <h3 className="text-xl font-semibold mb-6">
//               Edit Profile Information
//             </h3>

//             <form
//               onSubmit={handleUpdate}
//               className="grid grid-cols-1 md:grid-cols-2 gap-6"
//             >
//               {/* NAME */}
//               <div>
//                 <label className="text-sm text-gray-600">Full Name</label>
//                 <div className="relative mt-1">
//                   <User
//                     className="absolute left-3 top-3 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={user.name}
//                     onChange={(e) => setUser({ ...user, name: e.target.value })}
//                     className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-ochre outline-none"
//                   />
//                 </div>
//               </div>

//               {/* EMAIL */}
//               <div>
//                 <label className="text-sm text-gray-600">Email</label>
//                 <div className="relative mt-1">
//                   <Mail
//                     className="absolute left-3 top-3 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="email"
//                     value={user.email}
//                     disabled
//                     className="w-full pl-10 py-3 bg-gray-100 border rounded-lg"
//                   />
//                 </div>
//               </div>

//               {/* PHONE */}
//               <div>
//                 <label className="text-sm text-gray-600">Phone Number</label>
//                 <div className="relative mt-1">
//                   <Phone
//                     className="absolute left-3 top-3 text-gray-400"
//                     size={18}
//                   />
//                   <input
//                     type="text"
//                     value={user.phoneNumber}
//                     onChange={(e) =>
//                       setUser({ ...user, phoneNumber: e.target.value })
//                     }
//                     className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-ochre outline-none"
//                   />
//                 </div>
//               </div>

//               {/* BUTTON */}
//               <div className="md:col-span-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-ochre to-brickred text-white rounded-lg font-semibold shadow hover:scale-105 transition"
//                 >
//                   {loading ? "Updating..." : "Save Changes"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Save,
  Home,
  CalendarCheck,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser({
        name: stored.name || "",
        email: stored.email || "",
        phoneNumber: stored.phoneNumber || "",
      });
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: user.name,
            phoneNumber: user.phoneNumber,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Profile updated successfully");

      localStorage.setItem("user", JSON.stringify({ ...user }));
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ================= HERO ================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e] p-10 text-white shadow-xl">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome, {user.name || "User"} 👋
            </h1>
            <p className="mt-2 text-white/80 max-w-xl">
              Manage your profile, explore properties and keep track of your
              activity with AI Bricks.
            </p>
          </div>

          {/* glow effects */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Home size={28} />,
              title: "Viewed Properties",
              value: "12+",
            },
            {
              icon: <CalendarCheck size={28} />,
              title: "Site Visits",
              value: "3 Scheduled",
            },
            {
              icon: <Building2 size={28} />,
              title: "Saved Projects",
              value: "5 Shortlisted",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all"
            >
              <div className="text-ochre mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-500 mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ================= PROFILE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-ochre text-white rounded-full flex items-center justify-center text-3xl font-bold shadow">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Your profile helps us personalize property suggestions and site
              visits for you.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-8">
            <h3 className="text-xl font-semibold mb-6">
              Edit Profile Information
            </h3>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* NAME */}
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <div className="relative mt-1">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-ochre outline-none"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <div className="relative mt-1">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 py-3 bg-gray-100 border rounded-lg"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <div className="relative mt-1">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={user.phoneNumber}
                    onChange={(e) =>
                      setUser({ ...user, phoneNumber: e.target.value })
                    }
                    className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-ochre outline-none"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e] text-white rounded-lg font-semibold shadow hover:scale-105 transition"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
