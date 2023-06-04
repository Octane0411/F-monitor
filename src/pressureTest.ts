import axios from "axios";

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
            "http://localhost:8080/api/json",
            testJSON
        );
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        console.log("Response:", response.status);
        console.log("Duration:", duration, "ms");
        return duration;
    } catch (error: any) {
        console.error("Error:", error.message);
        return 0;
    }
}

async function runTest() {
    console.log("[test]Test started");
    const numUsers = 100; // 并发用户数
    const requestsPerUser = 10; // 每个用户的请求数

    const promises = [];
    const durations: any[] = [];

    for (let i = 0; i < numUsers; i++) {
        for (let j = 0; j < requestsPerUser; j++) {
            promises.push(
                sendRequest().then((duration) => durations.push(duration))
            );
        }
    }

    try {
        await Promise.all(promises);
        const totalDuration = durations.reduce(
            (total, duration) => total + duration,
            0
        );
        const averageDuration = totalDuration / durations.length;
        console.log("[test]Test completed successfully.");
        console.log("[test]Average Duration:", averageDuration, "ms");
    } catch (error) {
        console.error("[test]Test failed:", error);
    }
}

export default function initPressureTest() {
    runTest();
}
