import SocketIOCLient, { io, Socket } from "socket.io-client";
import { useEffect, useState, createContext, useRef } from "react";
import "../App.css";
import InputBar from "./InputBar";

const AlwaysScrollToBottom = () => {
  const myRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    myRef.current?.scrollIntoView();
  });
  return <div ref={myRef}></div>;
};

export default function Chat() {
  const [socket, setSocket] = useState<Socket>();
  const [messageList, setMessageList] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`, {
      query: {
        chatId: "0f1",
      },
    });
    newSocket.on("serverMessage", (newMessage) => {
      console.log(`recieved message with ${typeof newMessage}`);
      if (typeof newMessage === "object") {
        console.log(JSON.stringify(newMessage));
      } else {
        console.log(`received ${newMessage}`);
        setMessageList((arr) => [...arr, newMessage]);
        const element = document.getElementById("messageList");
        if (element?.scrollTop) {
          element.scrollTop = element.scrollHeight;
        }
      }
    });
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <div id="chat" className="App bg-[#36393e] h-full">
      {/* <div
        className="bg-red-500 w-12 h-6"
        onClick={() =>
          socket?.send({
            message: "lol",
            chatId: "0f1",
          })
        }
      ></div> */}
      <ul
        id="messageList"
        className="z-20 w-full h-96 flex flex-col justify-center items-center overflow-y-scroll"
      >
        {messageList.map((message) => (
          <li className="text-white text-base w-1/2 min-w-[50%] px-4 py-2 rounded-sm m-2 bg-dtextinput align-middle">
            {message}
          </li>
        ))}
        <AlwaysScrollToBottom />
      </ul>
      <InputBar
        messageList={messageList}
        setMessageList={setMessageList}
        socket={socket}
      />
    </div>
  );
}
