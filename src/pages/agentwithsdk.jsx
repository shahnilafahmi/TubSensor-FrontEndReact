import "../assets/css/prompt.css";
import { useEffect, useState } from "react";

function AgentWithSDK() {

  const [data, setData] = useState([]);
   const [text, setText] = useState("");

  useEffect(() => {

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setData(result);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      alert('key');
      console.log("Enter key pressed");
      // call API or function here
    }
  };

  return (
    <>


      <nav>
        <div className="nav-brand"></div>

        <div className="fab-scroll">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3v10M3 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="input-bar-wrap">
          <div className="input-bar">

            <button className="input-bar-attach">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 8v8M8 12h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <input type="text"
              onKeyDown={handleKeyDown}
               onChange={(e) => setText(e.target.value)}
             placeholder="Ask anything" />

            <div className="input-bar-actions">

              <button className="icon-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="9"
                    y="2"
                    width="6"
                    height="12"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M5 10a7 7 0 0 0 14 0"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="21"
                    x2="12"
                    y2="17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button className="voice-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12h2l2-6 2 12 2-10 2 8 2-4h2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Voice
              </button>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AgentWithSDK;