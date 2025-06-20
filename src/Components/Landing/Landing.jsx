import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from "../../Images/chatterlyIcon.png";
// import './ChatPage.css';
import "./Landing.scss";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://promptly-backend-5.onrender.com/chats/user/${sessionStorage.getItem('userId')}`);
        console.log(response,"response");
        const chatPairs = response.data.flatMap(msg => ([
        { message: msg.question, user: true },
        { message: msg.answer, user: false }
      ]));
      setMessages(chatPairs);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const logOut = () =>{
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    window.location.reload();
  }

  const deleteSearch = (props) =>{
    console.log(props,"search props");
  }

  const sendMessage = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput) return;

    const newUserMessage = { message: trimmedInput, user: true };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    scrollToBottom();

    const botLoadingMsg = { message: '.', user: false };
    setMessages(prev => [...prev, botLoadingMsg]);

    let dotCount = 1;
    const loadingInterval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        const dots = '.'.repeat(dotCount);
        updated[updated.length - 1].message = dots;
        return updated;
      });

      dotCount = dotCount < 3 ? dotCount + 1 : 1;
      scrollToBottom();
    }, 500);

    try {
      const response = await axios.post("https://promptly-backend-5.onrender.com/chats/chat", {
        question: trimmedInput,
        user_id: sessionStorage.getItem("userId"),
      });

      clearInterval(loadingInterval);

      if (response.data?.success !== false && response.data?.chat?.answer) {
        const botResponse = response.data.chat.answer;
        let botMessage = "";
        let index = 0;

        const typingInterval = setInterval(() => {
          if (index < botResponse.length) {
            botMessage += botResponse[index];
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].message = botMessage;
              return updated;
            });
            scrollToBottom();
            index++;
          } else {
            clearInterval(typingInterval);
          }
        }, 10);
      } else {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].message = "Sorry, I couldn't understand that.";
          return updated;
        });
      }
    } catch (error) {
      clearInterval(loadingInterval);
      console.error("Error sending message:", error);
      // toast.error("Something went wrong while sending the message.");
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].message = "Error occurred. Try again.";
        return updated;
      });
    }
  };

  return (
    <div className="row vh-100 p-0 m-0">
      {/* Sidebar */}
      <div className="col-md-3 d-none d-md-flex flex-column sidebar vh-100">
        <div className="p-0">
          <img src={logo} width="80" height="80" alt="Logo" />
          <b className="text-white fs-2"> Promptly </b>
        </div>
        <hr className="text-white" size="16" />
        <h5 className="text-light text-center">Recent Searches</h5>
        <ul className="list-group overflow-auto">
          {messages.slice().reverse().filter(msg => msg.user).map((search, index) => (
            <li key={index} className="list-group-item">
              <i className="bi bi-search text-warning"></i> {search.message}
              <span style={{float:"inline-end"}} class="bi bi-trash" onClick={()=>deleteSearch(search)}></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="col-12 col-md-9 m-auto align-items-center">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/"> Promptly </Link>
            
            {/* Toggle Button */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Collapsible Menu */}
            <div className="collapse navbar-collapse" id="navbarNav">
              
              <ul className="navbar-nav ms-auto">
                {sessionStorage.getItem('userName')?
                <li className="nav-item">
                  {/* <Link to="/login" className="nav-link"> */}
                  <span>Hi {sessionStorage.getItem('userName')} </span>
                    <button onClick={logOut} className="btn btn-outline-warning btn-sm">Logout</button>
                  {/* </Link> */}
                </li>
                :<>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <button className="btn btn-outline-warning btn-sm">Login</button>
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link to="/signup" className="nav-link">
                    <button className="btn btn-primary btn-sm text-white">SignUp</button>
                  </Link>
                </li>
                </>}
              </ul>
            </div>
          </div>
        </nav>


        {/* Chat Container */}
        <div className="col-sm-11 col-md-11 col-lg-11 col-xl-11 m-auto card shadow-lg chat-container rounded border-0">
          {messages.length === 0 && (
            <div className="start-chat-popup">
              <p>Start a conversation!</p>
            </div>
          )}
          <div className="card-body chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.user ? 'user-message' : 'bot-message'}`}>
                <div className="d-flex align-items-center">
                  <i className={`bi ${msg.user ? 'bi-person-circle user-icon' : 'bi-robot bot-icon'}`}></i>
                  <span className="ms-2">{msg.message}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="card-footer border-top-0 p-3 bg-light">
            <div className="row g-2 align-items-center">
              <div className="col-10">
                <input
                  type="text"
                  className="form-control form-control-lg rounded-pill"
                  style={{border:"solid"}}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                />
              </div>
              <div className="col-2 text-center">
                <button className="btn btn-primary btn-lg rounded-pill px-3" onClick={sendMessage}>
                  <i className="bi bi-send fs-5"></i>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
