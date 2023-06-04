import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Err from "./view/Error/Err";
import Event from "./view/Action/Action";
import Http from "./view/Http/Http";
import "./App.css";
import initMonitor from "./core/index";
import initPressureTest from "./pressureTest";
import AnimationComponent from "./view/Animation/AnimationComponent";
import { Image } from "antd";
initMonitor("http://localhost:8080/add", "http://localhost:8080/api/json");
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/err" element={<Err />}></Route>
                <Route path="/event" element={<Event />}></Route>
                <Route path="/http" element={<Http />}></Route>
                <Route
                    path="animation"
                    element={<AnimationComponent />}
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

const IMG_URL =
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F960b9e5f-30a2-4fe9-b4c6-89a962f7d3ec%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1688477840&t=cc0d55b5c609aad81e244750d3b375a8";
const Home = () => {
    let navigate = useNavigate();
    return (
        <div className="info">
            <h1 className="info--h1">I am Homepage</h1>
            <button onClick={() => navigate("/event")} className="info--button">
                User Switch
            </button>
            <button onClick={() => navigate("/err")} className="info--button">
                Trigger Error
            </button>
            <button onClick={() => navigate("/http")} className="info--button">
                Emit Request
            </button>
            <button
                onClick={() => navigate("/animation")}
                className="info--button"
            >
                animation
            </button>
            <button onClick={() => initPressureTest()}>Pressure Test</button>
            <img
                src={IMG_URL}
                style={{
                    width: 80,
                }}
            />
            {/* <Image src={IMG_URL} width={80} />
            <Image src={IMG_URL} width={80} />
            <Image src={IMG_URL} /> */}
        </div>
    );
};
