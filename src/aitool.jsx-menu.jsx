import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/home";
import Translator from "./pages/translator";
import VoiceAgent from "./pages/voiceagent";
import AgentWithSDK from "./pages/agentwithsdk";
import ClaudeCodeTypeAgentic from "./pages/claudecodetypeagentic";
import MultiModel from "./pages/multimodel";
import StructuredOutputAgent from "./pages/structuredoutputagent";
import WeatherTool from "./pages/weathertool";
import LangChainSingleFile from "./pages/langchain/langchain-readfile";
import LangChainMultipleFile from "./pages/langchain/langchain-multiplereadfile";
import LangGraphChat2 from "./pages/langgraph/chat2";
import MemoryAgent from "./pages/memoryAgent/memory";
import COT from "./pages/prompts/chainOfThought";
import JsonPrompts from "./pages/prompts/jsonPrompts";
import ZeroPrompts from "./pages/prompts/zeroPrompts";
import PersonaPrompts from "./pages/prompts/personaPrompts";
function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Menu */}
        {/* <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>
            Home
          </Link>

          <Link to="/transaltor" style={{ marginRight: "10px" }}>
            Translator
          </Link>

          <Link to="/voiceagent">
            VoiceAgent
          </Link>
          <Link to="/agentwithsdk">
            Agent With SDK
          </Link>
           <Link to="/claudecodetypeagentic">
            Claude Code Agentic
          </Link>
           <Link to="/multimodel">
            MultiModel
          </Link>
           <Link to="/structuredoutputagent">
            Structured Output Agent
          </Link>
           <Link to="/weathertool">
            Weather Tool
          </Link>
            <Link to="/langchain-readfile">
            Lang Chain Single File
          </Link>
            <Link to="/langchain-multiplereadfile">
            Lang Chain Multiple File
          </Link>
            <Link to="/chat2">
           LangGraph Chat2
          </Link>
          <Link to="/memory">
           Memory Agent
          </Link>
          <Link to="/chainOfThought">
           chain of Thoughts
          </Link>
          <Link to="/JsonPrompts">
           Json Prompts
          </Link>
           <Link to="/zeroPrompts">
           Zero Prompts
          </Link>
           <Link to="/personaPrompts">
           Persona Prompts
          </Link>
           
          
        </nav> */}

        <nav style={{ marginBottom: "20px" }}>
  <ul
   style={{
    listStyleType: "disc",   // show dots
    paddingLeft: "20px",     // left alignment for bullets
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "flex-start" // keep items left aligned
    }}
  >
    
    <li>
      <Link to="/">Home</Link>
    </li>

    <li>
      <Link to="/translator">Translator</Link>
    </li>

    <li>
      <Link to="/voiceagent">VoiceAgent</Link>
    </li>

    <li>
      <Link to="/agentwithsdk">Agent With SDK</Link>
    </li>

    <li>
      <Link to="/claudecodetypeagentic">Claude Code Agentic</Link>
    </li>

    <li>
      <Link to="/multimodel">MultiModel</Link>
    </li>

    <li>
      <Link to="/structuredoutputagent">
        Structured Output Agent
      </Link>
    </li>

    <li>
      <Link to="/weathertool">Weather Tool</Link>
    </li>

    <li>
      <Link to="/langchain-readfile">
        Lang Chain Single File
      </Link>
    </li>

    <li>
      <Link to="/langchain-multiplereadfile">
        Lang Chain Multiple File
      </Link>
    </li>

    <li>
      <Link to="/chat2">LangGraph Chat2</Link>
    </li>

    <li>
      <Link to="/memory">Memory Agent</Link>
    </li>

    <li>
      <Link to="/chainOfThought">
        chain of Thoughts
      </Link>
    </li>

    <li>
      <Link to="/JsonPrompts">Json Prompts</Link>
    </li>

    <li>
      <Link to="/zeroPrompts">Zero Prompts</Link>
    </li>

    <li>
      <Link to="/personaPrompts">Persona Prompts</Link>
    </li>

  </ul>
</nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transaltor" element={<Translator />} />
          <Route path="/voiceagent" element={<VoiceAgent />} />
          <Route path="/agentwithsdk" element={<AgentWithSDK />} />
          <Route path="/claudecodetypeagentic" element={<ClaudeCodeTypeAgentic />} />
           <Route path="/multimodel" element={<MultiModel />} />
           <Route path="/structuredoutputagent" element={<StructuredOutputAgent />} />
          <Route path="/weathertool" element={<WeatherTool />} />
           <Route path="/langchain-readfile" element={<LangChainSingleFile />} />
          <Route path="/langchain-multiplereadfile" element={<LangChainMultipleFile />} />
           <Route path="/chat2" element={<LangGraphChat2 />} />
           <Route path="/memory" element={<MemoryAgent />} />
            <Route path="/chainOfThought" element={<COT />} />
             <Route path="/jsonPrompts" element={<JsonPrompts />} />
            <Route path="/zeroPrompts" element={<ZeroPrompts />} />
             <Route path="/zeroPrompts" element={<ZeroPrompts />} />
               <Route path="/personaPrompts" element={<PersonaPrompts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;