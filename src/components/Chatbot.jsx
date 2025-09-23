import { useState } from "react";
import OpenAI from "openai";
import "./Chatbot.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";

export default function Chatbot({ darkMode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, 
      });

      const res = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a friendly sobriety coach AI." },
          ...[...messages, userMessage],
        ],
      });

      const aiMessage = { role: "assistant", content: res.choices[0].message.content };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Failed to get AI response." }]);
    }

    setLoading(false);
  };

  return (
    <div className={`chatbot-container ${darkMode ? "dark" : ""}`}>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
  {open ? "✖ Close" : (
    <>
      <FontAwesomeIcon icon={faComment} /> Chat with me
    </>
  )}
</button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="message assistant">...</div>}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your pal..."
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
