import Link from "next/link";
import React from "react";
import {
  FaYoutube,
  FaGithub,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

type Props = {};

const Footer = (props: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#21b3e4]/5 to-[#46e256]/5 dark:via-[#21b3e4]/10 dark:to-[#46e256]/10 pointer-events-none"></div>

      {/* Glass-morphism Container */}
      <div className="relative backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 border-t border-white/30 dark:border-white/5 shadow-lg shadow-gray-200/20 dark:shadow-black/20">
        {/* Main Footer Content */}
        <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-[20px] font-[700] text-black dark:text-white relative inline-block">
                About
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#21b3e4] to-[#46e256] rounded-full"></span>
              </h3>
              <ul className="space-y-3 mt-4">
                <li>
                  <Link
                    href="/about"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Section */}
            <div className="space-y-4">
              <h3 className="text-[20px] font-[700] text-black dark:text-white relative inline-block">
                Quick Links
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#21b3e4] to-[#46e256] rounded-full"></span>
              </h3>
              <ul className="space-y-3 mt-4">
                <li>
                  <Link
                    href="/courses"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/course-dashboard"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Course Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-[20px] font-[700] text-black dark:text-white relative inline-block">
                Follow Us
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#21b3e4] to-[#46e256] rounded-full"></span>
              </h3>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
                  aria-label="YouTube"
                >
                  <FaYoutube className="text-xl" />
                </Link>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-800/10 dark:bg-gray-400/20 text-gray-800 dark:text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-gray-800/30"
                  aria-label="GitHub"
                >
                  <FaGithub className="text-xl" />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-pink-500/10 dark:bg-pink-500/20 text-pink-500 hover:bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-400/10 dark:bg-blue-400/20 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-xl" />
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-blue-600/30"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </Link>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="text-[20px] font-[700] text-black dark:text-white relative inline-block">
                Contact Info
                <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-[#21b3e4] to-[#46e256] rounded-full"></span>
              </h3>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3 group">
                  <MdPhone className="text-[#21b3e4] dark:text-[#46e256] text-xl mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
                    +1 (885) 665-2022
                  </p>
                </div>
                <div className="flex items-start gap-3 group">
                  <MdEmail className="text-[#21b3e4] dark:text-[#46e256] text-xl mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
                    info@elearning.com
                  </p>
                </div>
                <div className="flex items-start gap-3 group">
                  <MdLocationOn className="text-[#21b3e4] dark:text-[#46e256] text-xl mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300">
                    123 Learning Street,
                    <br />
                    Education City, EC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 dark:border-white/5">
          <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                &copy; {currentYear}{" "}
                <span className="font-semibold text-black dark:text-white">
                  ELearning
                </span>
                . All Rights Reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/sitemap"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#21b3e4] dark:hover:text-[#46e256] transition-colors duration-300"
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
