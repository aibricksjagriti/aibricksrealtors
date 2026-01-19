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
        `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/auth/login`,
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

          <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
            {/* LEFT */}
            <div className="hidden md:flex bg-gradient-to-r from-[#5a082a] via-[#8D0B41] to-[#a63b1e] p-8 text-white items-center justify-center">
              <Image
                src="/home/abu-dhabi.webp"
                alt="Login"
                width={260}
                height={400}
                priority
              />
            </div>

            {/* RIGHT */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold">
                Login to Unlock Bottom Prices
              </h2>

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
                  className="w-full bg-[#C9A24D] py-3 rounded-lg font-semibold flex justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </button>
              </form>

              <p className="text-center text-sm mt-6">
                Don't have an account?{" "}
                <button
                  onClick={onRegisterClick}
                  className="text-[#C9A24D] font-semibold"
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
