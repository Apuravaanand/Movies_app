import { useEffect, useState } from "react";

const HeroSlider = () => {
    const slides = [
        {
            id: 1,
            title: "Explore Movies 🎬",
            desc: "Discover trending movies and shows from around the world.",
            img: "https://www.zee5.com/global/blog/wp-content/uploads/2025/01/4.jpg"
        },
        {
            id: 2,
            title: "Unlimited Entertainment 🍿",
            desc: "Watch your favorite content anytime, anywhere.",
            img: "https://www.zee5.com/global/blog/wp-content/uploads/2024/05/21-2.jpg"
        },
        {
            id: 3,
            title: "Feel the Experience 🎥",
            desc: "Enjoy cinematic visuals with smooth UI and animations.",
            img: "https://www.zee5.com/global/blog/wp-content/uploads/2025/01/3.jpg"
        },
        {
            id: 4,
            title: "New Release Movies 🎥",
            desc: "Enjoy cinematic visuals with smooth UI and animations.",
            img: "https://www.zee5.com/global/blog/wp-content/uploads/2024/06/15-1.jpg"
        }
    ];

    const [current, setCurrent] = useState(0);

    // Auto slide every 3 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="w-full h-[300px] overflow-hidden relative rounded-xl">

            {/* SLIDER TRACK */}
            <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out will-change-transform"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="min-w-full h-full relative flex-shrink-0"
                    >
                        {/* IMAGE */}
                        <img
                            src={slide.img}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>

                        {/* CONTENT */}
                        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
                            <h1 className="text-2xl md:text-4xl font-bold mb-3">
                                {slide.title}
                            </h1>

                            <p className="max-w-lg text-sm md:text-base text-gray-200">
                                {slide.desc}
                            </p>

                            <div className="mt-4 flex gap-3">
                                <button className="bg-white text-black px-4 py-2 rounded font-semibold hover:scale-105 transition">
                                    ▶ Play
                                </button>
                                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition">
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DOTS */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition ${current === i ? "bg-white scale-110" : "bg-gray-400"
                            }`}
                    ></div>
                ))}
            </div>

        </div>
    );
};

export default HeroSlider;