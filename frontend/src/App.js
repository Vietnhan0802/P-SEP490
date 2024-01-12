import "./scss/font.scss";
import "./scss/size.scss";
import "./scss/color.scss";
import "./scss/App.scss"
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import {Routes, Route } from "react-router-dom";
import Homepage from "./page/BusHomepage/homepage";
function App() {
  return (
    <div className="App" style={{ backgroundColor: '#1C2B3A'}}>
    <Routes>
      <Route path="/" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/home" element={<Homepage/>}/>
    </Routes>
    </div>
  );
}

export default App;
