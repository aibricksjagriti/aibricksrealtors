"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterModal({ open, onClose, onLoginClick }) {
  if (!open) return null;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber"),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ✅ SUCCESS TOAST
      toast.success("Registration successful! Please login.");

      // ✅ Close register modal
      onClose();

      // ✅ Open login modal after short delay
      setTimeout(() => {
        onLoginClick();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 pt-14">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT SECTION */}
          <div className="hidden md:flex relative  p-8 text-white items-center justify-center">
            <div className="relative">
              {/* Bubble */}
              <div className="absolute -top-6 -left-6 bg-ochre text-darkgray px-5 py-3 rounded-full text-lg font-semibold shadow">
                Live the <span className="text-brickred">Future</span>
              </div>

              {/* Person Image */}
              <Image
                src="/login-1.png" // add image in public folder
                alt="Register"
                width={440}
                height={700}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Register to Unlock Bottom Prices
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Exclusive Deals & Free Site Visit
            </p>

            <div className="mt-4 bg-amber-50 text-amber-700 px-4 py-2 rounded-md text-sm font-medium mb-2">
              ⚡ Trusted by <strong>1 Lac+</strong> Home Buyers
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <input
                  name="name"
                  required
                  placeholder="Full Name"
                  className="mt-1 w-full rounded-lg bg-lightcream  px-4 py-3 text-darkgray focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  className="mt-1 w-full rounded-lg bg-lightcream  px-4 py-3 text-darkgray focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  name="phoneNumber"
                  required
                  placeholder="Mobile Number"
                  className="mt-1 w-full rounded-lg bg-lightcream  px-4 py-3 text-darkgray focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative mt-1">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="w-full rounded-lg bg-lightcream  px-4 py-3 text-darkgray focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-darkgray"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-lg bg-[#C9A24D] font-semibold py-3 hover:opacity-90 transition flex items-center justify-center cursor-pointer text-xl text-lightcream"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-md mt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="text-[#C9A24D] cursor-pointer hover:text-brickred"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
