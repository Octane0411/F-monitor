import React, { useState } from "react";
import "./AnimationComponent.css"; // 引入样式文件
import FrameRateDisplay from "./components/FrameRateDisplay";
import axios from "axios";
import { emit } from "../../core/src/emit";
import AverageRateDisplay from "./components/AverageRateDisplay";
import { events } from "../../core/src/emit";

const TEST_NUM = 1000;

const AnimationComponent = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [minRate, setMinRate] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    let AnimationNum = 3000;

    const startAnimation = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
        }, 5000); // 动画持续时间为5秒
    };

    async function runTest() {
        console.log("[test]Test started");

        const promises = [];

        for (let i = 0; i < TEST_NUM; i++) {
            promises.push(sendRequest());
        }

        try {
            await Promise.all(promises);
        } catch (error) {
            console.error("[test]Test failed:", error);
        }
        console.log("[test]Test end");
        setIsRunning(false);
    }

    function runEmit() {
        console.log("[test]Test started");
        for (let i = 0; i < TEST_NUM; i++) {
            emit({
                type: "User",
                name: "leave",
                data: {
                    user: document.cookie.split("=")[1],
                    url: window.location.href,
                    data: { user: "user2", url: "http://localhost:3001/" },
                },
            });
        }
        console.log("[test]Test end");
        if (events.length === 0) {
            setIsRunning(false);
        }
    }

    return (
        <div>
            <button onClick={startAnimation}>开始动画</button>
            <FrameRateDisplay minRate={minRate} setMinRate={setMinRate} />
            <AverageRateDisplay
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                minRate={minRate}
                setMinRate={setMinRate}
            />
            <button
                onClick={() => {
                    runTest();
                    setMinRate(10000);
                    setIsRunning(true);
                }}
                style={{ marginBottom: 50 }}
            >
                普通XHR上报
            </button>
            <button
                onClick={() => {
                    runEmit();
                    setMinRate(10000);
                    setIsRunning(true);
                }}
            >
                本课题上报
            </button>

            {new Array(AnimationNum).fill(0).map(() => (
                <div className={`box ${isAnimating ? "animate" : ""}`}></div>
            ))}
        </div>
    );
};

async function sendRequest() {
    const startTime = new Date().getTime();

    const testJSON = [
        {
            type: "User",
            name: "enter",
            data: { user: "user2", url: "http://localhost:3001/" },
            timeStamp: 1684082498479,
            platform: "Mac OS",
            browser: "Chrome 112",
        },
    ];

    try {
        const response = await axios.post(
            "http://localhost:8080/api/test",
            testJSON
        );
    } catch (error) {
        console.error("Error:", error.message);
        return 0;
    }
}

export default AnimationComponent;
