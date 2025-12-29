'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

export default function HomePage() {
  const [showRegistration, setShowRegistration] = useState(false);

  if (showRegistration) {
    return <RegistrationForm onBack={() => setShowRegistration(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Welcome Card */}
        <Card className="p-4 sm:p-6 md:p-8 shadow-xl bg-white/80 backdrop-blur">
          {/* Logo Inside Card */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-2xl">
              {/* CHANGE YOUR LOGO HERE - Replace GraduationCap with your logo image */}
              <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              {/* Example with image: <img src="/your-logo.png" alt="Logo" className="w-full h-full object-contain p-4" /> */}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">GREENWOOD</h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600">Teacher Management System</p>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 text-center">
            Welcome to Teacher Registration Portal
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-4 sm:mb-5 text-center max-w-2xl mx-auto">
            Join our esteemed network of educators across Greenwood High School and Abhyaas The Global School branches.
          </p>

          <div className="mb-4 sm:mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg text-center sm:text-left">
                <div className="font-semibold text-emerald-900 mb-1 text-xs sm:text-sm">📝 Easy Registration</div>
                <p className="text-xs text-emerald-700">Step-by-step form</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-center sm:text-left">
                <div className="font-semibold text-blue-900 mb-1 text-xs sm:text-sm">🎓 Complete Profile</div>
                <p className="text-xs text-blue-700">Full qualifications</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-50 rounded-lg text-center sm:text-left">
                <div className="font-semibold text-purple-900 mb-1 text-xs sm:text-sm">⚡ Quick Approval</div>
                <p className="text-xs text-purple-700">Instant review</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRegistration(true)}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 sm:px-10 py-3 sm:py-5 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Start Teacher Registration
          </button>

          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-200 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Already registered? <a className="text-blue-600 font-semibold "> Contact Admin - office@ghs.ac.in</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
