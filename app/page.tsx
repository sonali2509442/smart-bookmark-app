

"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // If already logged in → go to dashboard
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push("/dashboard");
    };
    checkUser();
  }, []);

  // Google sign-in
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7BA]">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold">SmartBookmark</h1>

        <button
          onClick={signIn}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          Login
        </button>
      </nav>

      {/* HERO / MAIN BANNER */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        
        <h2 className="text-5xl font-bold mb-6 text-gray-800">
          Save your links. <br /> Access anywhere.
        </h2>

        <p className="text-gray-600 text-lg max-w-xl mb-8">
          SmartBookmark is a simple and private tool to store your favorite
          websites in one place. Access them anytime, from any device.
        </p>

        <button
          onClick={signIn}
          className="bg-black text-white px-8 py-4 rounded-xl text-lg hover:bg-gray-800"
        >
          Sign in with Google
        </button>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500">
        © 2026 SmartBookmark
      </footer>
    </div>
  );
}
