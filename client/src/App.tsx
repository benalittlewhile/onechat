import "./App.css";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { endianness } from "os";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const initialText = "Message this group";
  const [socket, setSocket] = useState<Socket>();
  const [chatInput, setChatInput] = useState(initialText);
  const [showSendButton, setShowSendButton] = useState<boolean>();

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    console.log(chatInput);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  let handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(event?.target?.value);
    if (chatInput != initialText) {
      setShowSendButton(true);
    }
    // event.target.style.height = "auto";
    // event.target.style.height = `${event.target.scrollHeight}px`;
  };

  let handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (chatInput == initialText) {
      setChatInput("");
      setShowSendButton(true);
    }
  };

  let handleFocusLoss = (event: React.FocusEvent<HTMLInputElement>) => {
    if (chatInput == "") {
      setChatInput(initialText);
      setShowSendButton(false);
    }
  };

  //show ? "fade-in" : "fade-out"
  function sendButton() {
    if (showSendButton === undefined) {
      return (
        <img src="/blurplearrow.png" className={"rounded-full w-0 collapse"} />
      );
    }

    if (showSendButton === true) {
      return (
        <img
          src="/blurplearrow.png"
          className={"rounded-full w-0 collapse fade-in"}
        />
      );
    } else
      return (
        <img
          src="/blurplearrow.png"
          className={"rounded-full w-0 collapse fade-out"}
        />
      );
  }
  return (
    <div className="App">
      <div id="chat" className="App bg-[#36393e]">
        <div
          className="center w-48 h-12 bg-slate-500 text-white"
          onClick={() => {
            setShowSendButton(!showSendButton);
          }}
        >
          fuck
        </div>
        <div
          id="bottomBar"
          className="z-10 absolute bottom-0 h-20 w-full flex justify-center items-center "
        >
          <div
            id="inputBar"
            className={
              "w-full p-4 h-5/6 text-base text-white items-center flex flex-row"
            }
          >
            <input
              className={
                "text-white bg-[#4a4c51] h-full w-full rounded-full p-2 outline-none block "
              }
              value={chatInput}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onBlur={handleFocusLoss}
              maxLength={1024 * 512}
            />
            {sendButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
