import "./App.css";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <div className="App">
      <div id="chat" className="App bg-[#36393e]">
        <div className="w-48 h-12 bg-slate-500 text-white">fuck</div>
        <div
          id="bottomBar"
          className="z-10 absolute bottom-0 h-28 w-full flex justify-center items-center "
        >
          <div
            id="inputBar"
            className="w-11/12 h-5/6 flex flex-row text-base space-x-3 items-center"
          >
            <input
              className="text-white bg-[#4a4c51] h-full flex-grow 
            rounded-md p-2 outline-none block"
            />
            <br></br>
            <button className="bg-[#5865f2] w-1/6 h-1/2 rounded-md">
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//  <div
//           id="inputBar"
//           className="w-11/12 h-5/6 bg-slate-500 grid grid-cols-[8fr_0.2fr_2fr] text-base "
//         ></div>

export default App;
