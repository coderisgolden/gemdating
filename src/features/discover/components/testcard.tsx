export default function ProfileInfoCard() {
  return (
    <div className="md:w-2/5 flex flex-col">
      {/* Profile Info */}
      <div className="p-8 bg-white flex-1">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Emma, 25</h2>
            <div className="flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>2 miles away</span>
            </div>
          </div>

          <button className="text-gray-400 hover:text-pink-500 transition-all duration-200 hover:scale-110">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-900 font-semibold text-xs tracking-wider uppercase mb-3">
            About Me
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Adventure seeker, coffee enthusiast, and nature lover. Always up for hiking and exploring new places.
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-900 font-semibold text-xs tracking-wider uppercase mb-3">
            Interests
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block py-2 px-4 text-xs text-white font-semibold bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-md">
              Travel
            </span>
            <span className="inline-block py-2 px-4 text-xs text-white font-semibold bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-md">
              Hiking
            </span>
            <span className="inline-block py-2 px-4 text-xs text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-md">
              Photography
            </span>
          </div>
        </div>

        <div>
          <p className="text-gray-900 font-semibold text-xs tracking-wider uppercase mb-3">
            Details
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
              <span>Marketing Professional</span>
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Looking for: Long-term relationship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Section */}
      <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 border-t border-gray-100">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Send Instant Message
        </h3>

        <div className="space-y-3">
          <button className="w-full py-3 px-6 bg-white text-rose-500 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center group">
            <span>Send Message</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="flex gap-2">
            <button className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-sm backdrop-blur-sm">
              👋 Wave
            </button>
            <button className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-sm backdrop-blur-sm">
              ❤️ Like
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
