import "./App.css";
import SocketIOCLient, { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  const initialText = "Message this group";
  const [socket, setSocket] = useState<Socket>();
  const [chatInput, setChatInput] = useState(initialText);
  const [showSendButton, setShowSendButton] = useState<boolean>();
  const [messageList, setMessageList] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    newSocket.on("serverMessage", (newMessage) => {
      console.log(`received ${newMessage}`);
      setMessageList((arr) => [...arr, newMessage]);
    });
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  let handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(event?.target?.value);
    if (chatInput !== initialText) {
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
    if (chatInput === "") {
      setChatInput(initialText);
      setShowSendButton(false);
    }
  };

  let submit = () => {
    console.log("sending?");
    socket?.emit("message", chatInput);
    setMessageList((arr) => [...arr, chatInput]);
    // setChatInput(initialText);
    setChatInput("");
    setShowSendButton(false);
  };

  let handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  //show ? "fade-in" : "fade-out"
  function sendButton() {
    if (showSendButton === undefined) {
      return (
        <button onClick={submit}>
          <img
            src="/blurplearrow.png"
            className={"rounded-full w-0 collapse"}
          />
        </button>
      );
    }

    if (showSendButton === true) {
      return (
        <button onClick={submit}>
          <img
            src="/blurplearrow.png"
            className={"rounded-full w-0 collapse fade-in"}
          />
        </button>
      );
    } else
      return (
        <button onClick={submit}>
          <img
            src="/blurplearrow.png"
            className={"rounded-full w-0 collapse fade-out"}
          />
        </button>
      );
  }
  return (
    <div className="App">
      <div id="chat" className="App bg-[#36393e]">
        <ul className="z-20 w-full h-80 ">
          {messageList.map((message) => (
            <li className="text-white text-base w-full h-10">{message}</li>
          ))}
        </ul>
        <div
          className="center w-48 h-12 bg-slate-500 text-white"
          onClick={() => {
            setShowSendButton(!showSendButton);
            console.log("??");
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
              onSubmit={submit}
              onKeyDown={handleKeyDown}
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
