import { Children } from "react";
import { MessageContext } from "./MessageContext";
import { useState } from "react";
export const MessageProvider = ({ children }) => {
      // declare React's state variable
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // จัดการเปลี่ยนค่าคำภาม
  const handleQuestion = (e) => {
    console.log(e);
    setQuestion(e.target.value);
  }
  // จัดการเปลี่ยนค่าคำตอบ
    const handleAnswer = (e) => {
    console.log(e);
    setAnswer(e.target.value);
  }

    return  <MessageContext.Provider
                value= {{ question, answer, handleQuestion, handleAnswer }}
            >
                {children}
            </MessageContext.Provider>

};
