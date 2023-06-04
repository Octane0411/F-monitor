import axios from "axios";
import { event } from "../interface/env";
import { getBrowserInfo, getPlatform } from "../utils/user";

type Timeout = ReturnType<typeof window.setTimeout>;
let timer: Timeout;

let events: any[] = [];
let requestUrl: string | URL = "";
let XhrRequestUrl: string = "";
const MAX_CACHE_LEN = 5;
const MAX_WAITING_TIME = 5000;

const ignoreURL = "http://localhost:8080/api/test";

function logLocalStorage() {
    const data = localStorage.getItem("requestQueue");
    if (data) {
        console.log("[local]", JSON.parse(data));
    }
}

// 从本地缓存中读取数据并加入到队列中
function loadEventsFromLocalStorage() {
    const data = localStorage.getItem("requestQueue");
    if (data) {
        const cachedQueue = JSON.parse(data);
        events.push(...cachedQueue);
    }
    logLocalStorage();
}
loadEventsFromLocalStorage();

// 保存队列数据到本地缓存
function saveQueueToLocalStorage() {
    localStorage.setItem("requestQueue", JSON.stringify(events));
    // logLocalStorage();
}

function emitPatch(data: event[]) {
    for (const item of data) {
        emit(item);
    }
}
/**
 * emit monitor data
 * @param {*} data the event with type, name and data
 */
function emit(data: event) {
    if (data.type === "Request" && data.data.requestUrl === ignoreURL) {
        return;
    }
    console.log("emit", data);
    data.timeStamp = Date.now();
    data.platform = getPlatform();
    data.browser = getBrowserInfo();
    events.push(data);
    saveQueueToLocalStorage();
    clearTimeout(timer);
    events.length >= MAX_CACHE_LEN
        ? send()
        : (timer = setTimeout(send, MAX_WAITING_TIME));
}

function emitXHR(data: event) {
    console.log("emit", data);
    data.timeStamp = Date.now();
    data.platform = getPlatform();
    data.browser = getBrowserInfo();
    events.push(data);
    clearTimeout(timer);
    events.length >= MAX_CACHE_LEN
        ? sendXHR()
        : (timer = setTimeout(send, MAX_WAITING_TIME));
}

/**
 * send request in requestIdleCallback()
 * by navigator.sendBeacon, request will not be broken when close blower
 */
function send() {
    if (events.length) {
        const sendEvents = events.slice(0, MAX_CACHE_LEN);
        events = events.slice(MAX_CACHE_LEN);
        saveQueueToLocalStorage();
        navigator.sendBeacon(requestUrl, JSON.stringify(sendEvents));
        if (events.length) {
            window.requestIdleCallback(() => setTimeout(send, 17));
        }
    }
}

function sendXHR() {
    if (events.length) {
        const sendEvents = events.slice(0, MAX_CACHE_LEN);
        events = events.slice(MAX_CACHE_LEN);
        axios.post(XhrRequestUrl, JSON.stringify(sendEvents));
        navigator.sendBeacon(requestUrl, JSON.stringify(sendEvents));
        if (events.length) {
            window.requestIdleCallback(() => setTimeout(send, 17));
        }
    }
}

function initServer(url: any, xhrURL: any) {
    requestUrl = url;
    XhrRequestUrl = xhrURL;
}
export { emit, emitPatch, initServer, events };
