import SocketIOCLient, { io, Socket } from "socket.io-client";
import { useEffect, useState, createContext } from "react";
import "../App.css";
import InputBar from "./InputBar";

export default function Chat() {
  const [socket, setSocket] = useState<Socket>();
  const [messageList, setMessageList] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    socket?.on("serverMessage", (newMessage) => {
      console.log(`received ${newMessage}`);
      setMessageList((arr) => [...arr, newMessage]);
    });
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  return (
    <div id="chat" className="App bg-[#36393e]">
      <ul className="z-20 w-full h-80 ">
        {messageList.map((message) => (
          <li className="text-white text-base w-full h-10">{message}</li>
        ))}
      </ul>
      <InputBar
        messageList={messageList}
        setMessageList={setMessageList}
        socket={socket}
      />
    </div>
  );
}
