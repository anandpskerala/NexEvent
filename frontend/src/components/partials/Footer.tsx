import { CustomLogo } from "./CustomLogo";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 px-8 text-gray-300 rounded-t-3xl mt-16 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6 gap-2">
              <CustomLogo className="w-8 h-8"/>
              <span className="text-white text-3xl font-extrabold tracking-wide">NexEvent</span>
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
              Connecting people to extraordinary experiences through a curated selection of events around the world. Discover, book, and enjoy unforgettable moments.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-110">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all duration-300 ease-in-out transform hover:scale-110">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-110">
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg mb-5 relative after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-blue-500">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Hiring!</span></a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg mb-5 relative after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-blue-500">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cancellation Options</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-lg mb-5 relative after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-blue-500">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Settings</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Accessibility Statement</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
          <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} NexEvent. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors duration-200">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Feedback</a>
          </div>
        </div>
      </div>
    </footer>
  );
};