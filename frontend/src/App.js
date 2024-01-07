import "./scss/font.scss";
import "./scss/size.scss";
import "./scss/color.scss";
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import {Routes, Route } from "react-router-dom";
import Homepage from "./page/Homepage/homepage";
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/home" element={<Homepage/>}/>
    </Routes>
    </div>
  );
}

export default App;
