import Image from "next/image";

const features = [
  {
    title: "High Booking Success",
    description: "Designed to provide you a safe booking experience.",
    image: "/safepayment.png",
    alt: "High booking success",
  },
  {
    title: "7-Day Booking Support",
    description: "Live help 7 days a week. Talk to real humans anytime.",
    image: "/247support.png",
    alt: "7 day booking support",
  },
  {
    title: "Trusted Train Ticket Booking",
    description: "Personalized experience for quick and easy bookings.",
    image: "/fastBooking.png",
    alt: "Trusted ticket booking",
  },
  {
    title: "Reliable Live Train Tracking",
    description: "Plan your journey smoothly & without any hassles.",
    image: "/trainStat.png",
    alt: "Live train tracking",
  },
  {
    title: "Eliminate Waitlist Guesswork",
    description: "Stay informed with real-time ticket status updates.",
    image: "/eliminateGuesswork.png",
    alt: "Eliminate waitlist guesswork",
  },
  {
    title: "Instant Auto-Refunds",
    description: "Get your money back instantly, hassle-free.",
    image: "/instantRefund.png",
    alt: "Instant auto refunds",
  },
  {
    title: "Find Confirmed Tickets",
    description: "Discover the best alternatives with guaranteed seats.",
    image: "/confirmedSeat.png",
    alt: "Find confirmed tickets",
  },
  {
    title: "1-Click Tatkal Booking",
    description: "Book faster with a single click, saving precious seconds.",
    image: "/clickTatkal.png",
    alt: "1 click tatkal booking",
  },
];

export default function WhyToBookWithRailYatri() {
  return (
    <section className="bg-[#fbfbfb] py-10 sm:py-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl md:text-4xl 
               font-medium tracking-tight leading-snug 
               mb-8 sm:mb-12 text-gray-900">
          Why Book Train Tickets
          <br />
          <span className="text-gray-600 font-normal">with </span>
          <span className="font-semibold text-orange-500">IRCTC</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl sm:rounded-2xl 
                         p-4 sm:p-6 
                         text-center shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4 sm:mb-5">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={64}
                  height={64}
                  className="sm:w-20 sm:h-20 object-contain"
                />
              </div>

              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
