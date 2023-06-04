import React, { useEffect, useState } from "react";

const FrameRateDisplay = ({ minRate, setMinRate }) => {
    const [frameRate, setFrameRate] = useState(0);

    useEffect(() => {
        let frameCount = 0;
        let startTime = performance.now();

        const calculateFrameRate = () => {
            const currentTime = performance.now();
            const deltaTime = currentTime - startTime;

            frameCount++;

            if (deltaTime >= 1000) {
                const currentFrameRate = Math.round(
                    (frameCount * 1000) / deltaTime
                );
                setFrameRate(currentFrameRate);
                frameCount = 0;
                startTime = currentTime;
            }

            window.requestAnimationFrame(calculateFrameRate);
        };

        window.requestAnimationFrame(calculateFrameRate);

        return () => {
            // Cleanup function
            cancelAnimationFrame(calculateFrameRate);
        };
    }, [frameRate]);

    return (
        <div>
            <p>Frame Rate Now : {frameRate} FPS</p>
            {/* <p>Min Frame Rate: {minRate} FPS</p> */}
        </div>
    );
};

export default FrameRateDisplay;
