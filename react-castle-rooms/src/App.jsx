import Castle from "./components/01_Castle";
import { useContext } from "react";
import { MessageContext } from "./context/messageContext/MessageContext";

export default function App() {

  const { question, answer, handleQuestion } = useContext(MessageContext);

  return (
    // card ห้อง secret room
    <div className="flex flex-col justify-center items-center min-h-screen bg-[url('/bg.gif')] bg-repeat bg-gray-300 p-4">

      {/* ข้อความจากกล่อง input */}
      <p className="text-purple-800 text-center">
        Message to Cooper:{" "}
        <span>{question ? `🛰️ ${question}` : "⌛ Waiting for a message"}</span>
      </p>

      <p className="text-purple-800 text-center">
        Message from Cooper:{" "}
        <span className="text-yellow-800">
          {answer
          ? `🛰️ ${answer}`
          : "⌛ Waiting for a message..."}
        </span>
      </p>

      {/* กล่อง input */}
      <textarea
        value={question}
        onChange={handleQuestion}
        placeholder="Type your message here..."
        className="bg-white text-black rounded px-2 py-1 text-center my-2"
      />

      <Castle />
    </div>
  );
}
