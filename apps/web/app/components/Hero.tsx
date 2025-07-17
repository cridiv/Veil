import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full p-0 md:p-8 flex items-center justify-center bg-[rgb(25, 26, 31)]">
      {/* Windowed Container for Larger Devices */}
      <div className="relative w-full max-w-5xl mx-auto rounded-none md:rounded-3xl overflow-hidden shadow-none md:shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex items-center justify-center min-h-screen md:min-h-[80vh] p-6 md:p-12">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ask. Vote. Engage <br />
              <span className="bg-[#f5f5f5] bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Host Q&As and polls that feel instant. Get questions, answers, and
              live votes all flowing instantly.
            </p>

            <div className="flex justify-center">
              <Link
                href="/get-started"
                className="group relative px-8 py-4 bg-[#0f0f0f] cursor-pointer text-white font-semibold rounded-full shadow-lg border-none hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0  bg-[#1a1a1a] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
