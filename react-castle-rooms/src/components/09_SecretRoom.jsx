import { useContext } from "react";
import { MessageContext } from "../context/messageContext/MessageContext"

export default function SecretRoom() {

    const { question, answer, handleAnswer } = useContext(MessageContext);
    console.log(MessageContext);


    return (
        <div className="rounded-[20px] flex flex-col justify-center items-center p-5 bg-[#FFD166] w-[95%] my-1">
            <div className="flex flex-col items-center text-center">
                <h2 className="font-bold text-3xl mb-2 text-purple-900 tracking-wide">Tesseract</h2>
            
                {/* ข้อความจากกล่อง input */}
                <p className="text-purple-800 text-center">
                    Message from Earth:{" "}
                    <span>{question
                        ? `🌏 ${question}` 
                        : "⌛ Waiting for a message..."}
                    </span>
                </p>
                <p className="text-purple-800 text-center">
                    Reply to Earth:{" "}
                    <span className="text-purple-800">
                        {answer 
                        ? `🌏 ${answer}` 
                        : "⌛ Waiting for a message..."}
                    </span>
                </p>

                {/* กล่อง input */}
                <textarea
                    value={answer} 
                    onChange={handleAnswer}
                    placeholder="Type your message here..."
                    className="bg-white text-black rounded px-2 py-1 text-center mt-2"
                />
            </div>
        </div>
    );
}