import { useState, useEffect } from "react";
import "./ImageSlider.css";

export default function ImageSlider() {
    const images = [
        "home/a.jpeg",
        "home/b.jpeg",
        "home/c.jpeg",
        "home/d.jpeg",
        "home/e.jpeg",
        "home/f.jpeg",
        "home/g.jpeg",
        "home/h.jpeg",
        "home/j.jpeg",
    ];

    const groupSize = 3;

    // Break into groups of 3
    const groups = [];
    for (let i = 0; i < images.length; i += groupSize) {
        groups.push(images.slice(i, i + groupSize));
    }

    // Duplicate groups for infinite loop
    const loopGroups = [...groups, ...groups];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    // Reset instantly when reaching end of loop
    useEffect(() => {
        if (index === groups.length) {
            setTimeout(() => setIndex(0), 650); // wait animation then reset
        }
    }, [index]);

    return (
        <div className="slider-container">
            <div
                className="slider-wrapper"
                style={{
                    width: `${loopGroups.length * 100}%`,
                    transform: `translateX(-${index * (100 / loopGroups.length)}%)`,
                    transition: index === 0 ? "none" : "transform 0.6s ease-in-out",
                }}
            >
                {loopGroups.map((group, gi) => (
                    <div className="slide-group" key={gi}>
                        {group.map((src, i) => (
                            <div className="slide-box" key={i}>
                                <img src={src} className="slide-image" alt={`slide ${i}`} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
