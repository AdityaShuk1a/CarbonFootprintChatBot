import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { GoogleGenAI } from "@google/genai";
import SendIcon from "@mui/icons-material/Send";
import NavBar from "../Components/NavBar";


function LandingPage() {
  const [startChatting, setStartChatting] = useState(false);
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState("");
  const [chatNumber, setChatNumber] = useState(0);
  const [chats, setChats] = useState([
    {
      id: 0,
      title: "",
      messages: [],
    },
  ]);


  const setNewChatNumber = (number) => {
    setChatNumber(number);
  }
  useEffect(() => {
    if (input.length === 0) return;

    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_API_KEY,
    });

    const AI = async () => {
      setStartChatting(true);

      const currentChat = chats.find((chat) => chat.id === chatNumber);

      const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: currentChat.messages.map((message) => ({
          role: message.person,
          parts: [{ text: message.text }],
        })),
      });

      const response = await chat.sendMessage({
        message: `🌱 You are EcoTrackBot, a smart and friendly Carbon Footprint Chatbot. Your mission is to help users understand, calculate, and offset their carbon emissions. You have four core responsibilities:
1. Calculating Emissions
If the user provides activity details (e.g., travel, electricity use, or food habits), respond with:

An estimate of carbon emissions (in kg or tons of CO₂).

A brief breakdown of the calculation using known emission factors.

Optional suggestions for reducing or offsetting those emissions.

2. Answering Questions
If the user asks about anything related to carbon footprint, carbon offsets, or eco-living:

Give concise, accurate, and helpful explanations.

Use simple language, but sound smart and confident.

Always tie the answer back to personal impact or sustainability when possible.

3. Suggesting Eco Tips
If the user asks how to reduce their carbon footprint, or seems eco-curious:

Offer practical, actionable tips (e.g., "Switch to LED lighting" or "Bike instead of driving").

Keep suggestions short and friendly.

Bonus: Add fun eco-facts when relevant.

4. Handling Casual Chit-Chat
If the user greets you or makes small talk (e.g., “hello”, “what’s up”, “hey bot”), respond with:

A short, eco-themed greeting or fun fact.

Then offer help: “Want to check your footprint or learn how to shrink it?”

💬 Examples:
User: “I drove 100 km last week.”

EcoTrackBot: “That’s roughly 19.2 kg of CO₂ if it was a petrol car. Want to offset it with trees or cut it down next time?”

User: “How do carbon offsets work?”

EcoTrackBot: “They balance out your emissions by funding projects that reduce CO₂ — like planting forests or capturing methane. Cool, right?”

User: “hello”

EcoTrackBot: “Hey, green thinker! Want to see how much CO₂ you’ve been kicking out lately?” ` + input,
      });

      const botReply = response.text;

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatNumber
            ? {
                ...chat,
                title: chat.title || botReply.split(".")[0], // Use 1st sentence as title
                messages: [
                  ...chat.messages,
                  { text: input, person: "user" },
                  { text: botReply, person: "model" },
                ],
              }
            : chat
        )
      );

      setInput("");
      setUserInput("");
    };

    AI();
  }, [input]);

  useEffect(() => {
    console.log(chats)
  }, [chats])

  // Create new chat only if current chat has messages
  const startNewChat = () => {
    const currentChat = chats.find((chat) => chat.id === chatNumber);
    if (currentChat && currentChat.messages.length > 0) {
      const newChatId = chatNumber + 1;
      setChats((prev) => [
        ...prev,
        { id: newChatId, title: "", messages: [] },
      ]);
      setChatNumber(newChatId);
      setInput("");
      setUserInput("");
      setStartChatting(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        setInput(userInput);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [userInput]);
  const currentChat = chats.find((chat) => chat.id === chatNumber);

  return (
    <>
    <NavBar />
    <div className="h-screen w-screen bg-black flex">
      
      <SideBar chats={chats} chatNumber={chatNumber} setNewChatNumber={setNewChatNumber} startNewChat={startNewChat}   />
      <div className="h-full w-full flex justify-center items-center text-white text-3xl">
        <div
          className="w-full h-full flex items-center justify-center flex-col"
          style={{ padding: "1vh" }}
        >
          {!startChatting ? (
            <>
              <h1 className="text-center"  style={{ marginBottom: "2vh" }}>
                Chat to know about carbon footprint buddy!
              </h1>
              <div className="text w-full flex justify-center ">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Search"
                  className="w-[60%] h-10 rounded-3xl text-xl text-white border-white border-[0.5px] bg-transparent"
                  style={{
                    padding: "1vh",
                    marginRight: "0.5vh",
                  }}
                />
                <SendIcon
                  className="text-8xl rounded-3xl cursor-pointer flex justify-center items-center"
                  style={{ fontSize: "4vh" }}
                  onClick={() => setInput(userInput)}
                />
              </div>
            </>
          ) : (
            <>
              {/* Chat Display */}
              <div className="w-full h-[70%]  justify-center flex " style={{
                marginTop: "-12vh"
              }} >
                <div className="overflow-y-auto w-[60%] h-full">
                 
                  {currentChat?.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 ${
                        msg.person === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <p
                        className="inline-block rounded-2xl text-lg md:text-xl"
                        style={{
                          padding: "2vh",
                          backgroundColor:
                            msg.person === "user" ? "#333" : "",
                        }}
                      >
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="text w-full bottom-[7vh] fixed flex justify-center mt-4">
                  <input
                    type="text"
                    placeholder="Type a riddle..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-[60%] h-10 rounded-3xl text-xl border-white border-[0.5px] bg-transparent text-white"
                    style={{
                      padding: "1vh",
                      marginRight: "0.5vh",
                    }}
                  />
                  <SendIcon
                    className="rounded-3xl h-10 cursor-pointer px-4 flex justify-center items-center"
                    style={{ fontSize: "4vh" }}
                    onClick={() => setInput(userInput)}
                  />
                  
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
    
  );
}

export default LandingPage;
