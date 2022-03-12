import { useState } from "react";
import { Socket } from "socket.io-client";
import "../App.css";

export default function InputBar(props: {
  messageList: String[];
  setMessageList: Function;
  socket: Socket | undefined;
}) {
  const initialText = "Message this group";
  const [chatInput, setChatInput] = useState(initialText);
  const [showSendButton, setShowSendButton] = useState<boolean>();

  let handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(event?.target?.value);
    if (event.target.value !== initialText && event.target.value !== "") {
      setShowSendButton(true);
    }
    if (event.target.value === "") {
      setShowSendButton(false);
    }
    // event.target.style.height = "auto";
    // event.target.style.height = `${event.target.scrollHeight}px`;
  };

  let handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (chatInput == initialText) {
      setChatInput("");
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
    props.socket?.emit("message", chatInput);
    props.setMessageList((arr: string[]) => [...arr, chatInput]);
    // setChatInput(initialText);
    setChatInput("");
    setShowSendButton(false);
  };

  let handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  function sendButton() {
    function getShowClass() {
      if (showSendButton === true) {
        return "fade-in";
      }

      if (showSendButton === false) {
        return "fade-out";
      }
    }

    const btnClasses =
      "rounded-full w-0 collapse bg-dblurple " + getShowClass();

    // if showsendbutton == true: fade-in
    // if showSendbutton == false: fade-out
    // if undefined: nothing

    return (
      <button onClick={submit}>
        <img src="/arrowplane.png" className={btnClasses} />
      </button>
    );
  }
  return (
    <div
      id="inputBarWrapper"
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
  );
}
