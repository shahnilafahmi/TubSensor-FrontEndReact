import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/home";
import TubSensorTest from "./pages/tubsensor/tubsensortest";

function App() {
  return (
    <BrowserRouter>
      <div>
      

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
      <Link to="/tubsensortest">Tub Sensor Test</Link>
    </li>

  

  </ul>
</nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tubsensortest" element={<TubSensorTest />} />
          
             
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;