import { CSSTransition } from "react-transition-group";

import styles from "./ChatBox.module.css";

type MessageProps = {
  message: string;
  sender: string;
  key: any;
};

const Message = ({ key, sender, message }: MessageProps) => {
  if (sender === "bot") {
    return (
      <CSSTransition key={key} timeout={150} classNames={{ ...styles }}>
        <div className="self-start px-4 py-3 bg-white border border-gray-100 rounded-bl-sm rounded-2xl w-max">
          {message}
        </div>
      </CSSTransition>
    );
  } else {
    return (
      <CSSTransition key={key} timeout={150} classNames={{ ...styles }}>
        <div className="self-end px-4 py-3 text-white bg-orange-600 border border-transparent rounded-br-sm rounded-2xl w-max">
          {message}
        </div>
      </CSSTransition>
    );
  }
};

export default Message;
