
import Home from "./pages/Home/Home.tsx";
import Trash from "./pages/Trash/Trash.tsx";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

export default function App(){

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/trash" element={<Trash />} />
      </Routes>
    </Router>
  );
}
   


