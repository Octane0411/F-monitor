import { emit } from "../emit";

// 可容忍的最大等待首屏时间
// const MAX_WAIT_LOAD_TIME = 3000

const [perfEntries] = window.performance.getEntriesByType("navigation");
const n = perfEntries as PerformanceNavigationTiming;
const [resourceEntries] = window.performance.getEntriesByType("resource");
const resourceEntry = resourceEntries as PerformanceResourceTiming;

let perfInfo = {};
const getPerformanceData = (isLoaded: boolean) => {
    if (!isLoaded) {
        console.warn("首屏异常");
    }

    // dns时间（如有缓存为0）
    const dns = n.domainLookupEnd - n.domainLookupStart;
    // 从 请求开始 到 DOM解析完成的时间
    const domReady = n.domContentLoadedEventEnd - n.startTime;

    const tcp = n.connectEnd - n.connectStart;
    const req = n.responseEnd - n.requestStart;
    const domParse = n.domComplete - n.domInteractive;
    const ttfb = n.responseStart - n.startTime;
    const totalTime = n.loadEventEnd - n.startTime;

    const url = window.location.href;
    perfInfo = {
        dns,
        domReady,
        tcp,
        req,
        domParse,
        url,
        ttfb,
        totalTime,
    };
    emit({ type: "Performance", name: "NavigationTimeData", data: perfInfo });

    // const dcl = n.domContentLoadedEventStart - n.fetchStart
    // emit({type: 'Performance', name: 'dcl', data: dcl})
};

function showPaintTimings() {
    if (window.performance) {
        let performance = window.performance;
        let performanceEntries = performance.getEntriesByType("paint");
        console.log(performanceEntries);
        performanceEntries.forEach((performanceEntry, i, entries) => {
            console.log(
                "The time to " +
                    performanceEntry.name +
                    " was " +
                    performanceEntry.startTime +
                    " milliseconds."
            );
        });
    } else {
        console.log("Performance timing isn't supported.");
    }
}

const isDataLoaded = (entry: PerformanceNavigationTiming): boolean => {
    return (
        entry &&
        entry.loadEventEnd !== 0 &&
        entry.responseEnd !== 0 &&
        entry.domComplete !== 0
    );
};

/**
 * 异步检测performance数据是否加载完成
 */
const initNavigationData = () => {
    if (isDataLoaded(n)) {
        getPerformanceData(true);
    } else {
        window.setTimeout(initNavigationData, 0);
    }
};

const initPaintData = () => {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            emit({
                type: "Performance",
                name: entry.name,
                data: { time: entry.startTime },
            });
        }
    });
    observer.observe({ entryTypes: ["paint"] });
};

const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1]; // Use the latest LCP candidate
    emit({
        type: "Performance",
        name: "lcp",
        data: { time: lastEntry.startTime },
    });
    console.log(lastEntry);
    // console.log("LCP:", lastEntry.startTime);
});
observer.observe({ type: "largest-contentful-paint", buffered: true });

const initPerformance = () => {
    initNavigationData();
    initPaintData();
};

export { initPerformance };
