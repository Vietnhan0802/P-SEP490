import "./scss/font.scss";
import "./scss/size.scss";
import "./scss/color.scss";
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import {Routes, Route } from "react-router-dom";
import Homepage from "./page/Homepage/homepage";
import Chat from "./page/Chat/chat";
import DashBoard from "./page/DashBoard/dashBoard";
function App() {
  return (
    <div className="App" style={{ backgroundColor: '#1C2B3A', height: '100%' }}>
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/home" element={<Homepage/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/dashBoard" element={<DashBoard/>}/>
    </Routes>
    </div>
  );
}

export default App;
