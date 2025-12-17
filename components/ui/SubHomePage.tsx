"use client"
export default function SubHomePage() {
  return (
    <div>
        <div className="bg-gray-50 py-22">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4">
            Have you not found the right one?
          </h2>
          <h3 className="sm:text-3xl font-bold text-center mb-12">
            Find a service suitable for you here.
          </h3>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {/* Row 1 */}
            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">FLIGHTS</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">HOTELS</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">RAIL DRISHTI</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">E-CATERING</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">BUS</span>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-900 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">HOLIDAY PACKAGES</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 14h.01M11 14h.01" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">TOURIST TRAIN</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 7-7 7M12 3l7 7-7 7" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">HILL RAILWAYS</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">CHARTER TRAIN</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 hover:bg-blue-50 transition cursor-pointer">
                <svg className="w-10 h-10 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="sm:text-lg font-bold text-center">GALLERY</span>
            </div>
          </div>
        <div>
          <img src="/warning.jpeg" alt="" />
        </div>
        </div>
      </div>

    </div>
  )
}
