import "./css/font.css";
import "./css/size.css";
import "./css/color.css";
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import {Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
    </div>
  );
}

export default App;
