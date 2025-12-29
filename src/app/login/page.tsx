"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });

      if (res.ok) {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin");
      } else {
        const data = await res.json();
        alert(data.error || "Invalid Admin Password");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <form onSubmit={handleLogin} className="p-6 sm:p-8 bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">EduCentral</h1>
          <h2 className="text-base sm:text-lg text-gray-600">Admin Access</h2>
        </div>
        <input
          type="password"
          placeholder="Enter Admin Password"
          className="w-full p-3 sm:p-4 border border-gray-300 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          value={pass}
          onChange={e => setPass(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 sm:p-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-semibold transition-colors text-sm sm:text-base"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-center">
          <a href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600">
            Back to Registration
          </a>
        </div>
      </form>
    </div>
  );
}