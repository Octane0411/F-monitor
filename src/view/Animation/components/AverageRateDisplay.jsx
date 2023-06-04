import React, { useEffect, useState } from "react";

const AverageRateDisplay = ({
    isRunning,
    setIsRunning,
    minRate,
    setMinRate,
}) => {
    const [frameRate, setFrameRate] = useState(0);

    useEffect(() => {
        let frameCount = 0;
        let startTime = performance.now();

        let animationFrameId;

        const calculateFrameRate = () => {
            if (!isRunning) {
                return;
            }
            frameCount++;
            const currentTime = performance.now();
            const totalTime = currentTime - startTime;
            const currentFrameRate = Math.round(
                (frameCount * 1000) / totalTime
            );
            setFrameRate(currentFrameRate);
            setMinRate((prevMinRate) => {
                if (currentFrameRate < prevMinRate) {
                    return currentFrameRate;
                } else {
                    return prevMinRate;
                }
            });

            // if (deltaTime >= 1000) {
            //     const currentFrameRate = Math.round(
            //         (frameCount * 1000) / deltaTime
            //     );

            if (isRunning) {
                animationFrameId =
                    window.requestAnimationFrame(calculateFrameRate);
            } else {
                const currentTime = performance.now();
                const totalTime = currentTime - startTime;
                const currentFrameRate = Math.round(
                    (frameCount * 1000) / totalTime
                );
                setFrameRate(currentFrameRate);
                cancelAnimationFrame(animationFrameId);
            }
        };

        if (isRunning) {
            animationFrameId = window.requestAnimationFrame(calculateFrameRate);
        } else {
            cancelAnimationFrame(animationFrameId);
        }

        return () => {
            // Cleanup function
            cancelAnimationFrame(animationFrameId);
        };
    }, [isRunning]);

    // const handleButtonClick = () => {
    //     setIsRunning(!isRunning);
    // };

    return (
        <div>
            <p>Min Frame Rate During Test: {minRate} FPS</p>
            <p>Average Frame Rate During Test: {frameRate} FPS</p>
            {/* <button onClick={handleButtonClick}>
                {isRunning ? "Stop test" : "Waiting for test running"}
            </button> */}
            <p>{isRunning ? "running" : "not running"}</p>
        </div>
    );
};

export default AverageRateDisplay;
