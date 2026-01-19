"use client";

import { useState, useRef } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RegisterModal from "./RegisterModal";

export default function LoginModal({ open, onClose, onRegisterClick }) {
  if (!open) return null;

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const router = useRouter();
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully 🎉");

        formRef.current.reset();
        onClose();

        // slight delay so toast is visible before redirect
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* LOGIN MODAL */}
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 pt-14">
        <div className="relative bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 h-[520px]">
            {/* LEFT */}
            <div className="hidden md:flex  p-8 text-white items-center justify-center">
              <div className="relative">
                {/* Bubble */}
                <div className="absolute -top-4 -left-6 bg-ochre text-darkgray px-5 py-3 rounded-full text-lg font-semibold shadow">
                  Live the <span className="text-brickred">Future</span>
                </div>

                {/* Person Image */}
                <Image
                  src="/login-1.png" // add image in public folder
                  alt="Login"
                  width={440}
                  height={600}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold">
                Login to Unlock Bottom Prices
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Exclusive Deals & Free Site Visit
              </p>

              <div className="mt-4 bg-amber-50 text-amber-700 px-4 py-2 rounded-md text-sm font-medium mb-2">
                ⚡ Trusted by <strong>1 Lac+</strong> Home Buyers
              </div>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-5 mt-6"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full rounded-lg px-4 py-3 bg-lightcream"
                />

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="w-full rounded-lg px-4 py-3 bg-lightcream"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C9A24D] text-xl text-lightcream py-3 rounded-lg font-semibold flex justify-center cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </button>
              </form>

              <p className="text-center text-md mt-6">
                Don't have an account?{" "}
                <button
                  onClick={onRegisterClick}
                  className="text-[#C9A24D] font-semibold cursor-pointer hover:text-brickred"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTER MODAL */}
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
