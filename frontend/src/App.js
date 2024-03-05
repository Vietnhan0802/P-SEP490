import "./scss/font.scss";
import "./scss/size.scss";
import "./scss/color.scss";
import "./scss/App.scss";
import { useEffect, useRef, useState } from "react";
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Homepage from "./page/Homepage/homepage";
import Chat from "./page/Chat/chat";
import Header from "./components/header";
import Profile from "./page/Profile/profile";
import Notify from "./page/Notify/notify";
import ForgetPassword from "./page/Password/forgetPassword";
import ResetPassword from "./page/Password/resetPassword";
import { ToastContainer } from "react-toastify";
import '../src/i18n/i18n';
function App() {
  const location = useLocation();
  const appRef = useRef(null);
  const navigate = useNavigate(); // Hook to handle navigation
  const [changeImage, setChangeImage] = useState(false);
  useEffect(() => {
    // Kiểm tra chiều cao của .App và nếu lớn hơn 100vh thì chuyển về 100%
    const appElement = appRef.current;
    if (appElement) {
      const appHeight = appElement.clientHeight;
      if (appHeight > window.innerHeight) {
        appElement.style.height = "100%";
      }
    }
  }, []);
  const handleHeaderItemClick = (itemId) => {
    // Navigate to the corresponding route based on the clicked item
    switch (itemId) {
      case "home":
        navigate("/home");
        break;
      case "chat":
        navigate("/chat");
        break;
      case "dashboard":
        navigate("/dashboard");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/");
    }
  };
  const isHeaderVisible = !(
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgetpassword" ||
    location.pathname === "/resetpassword"
  );

  const handleChangeImg = (value) => {
    if (value === "ok") {
      setChangeImage(!changeImage);
    }
  };
  
  return (
    <div
      className="App"
      ref={appRef}
      style={{ backgroundColor: "var(--body_background)", minHeight: "100vh" }}
    >
      {isHeaderVisible && (
        <Header onItemClick={handleHeaderItemClick} changeImage={changeImage} />
      )}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/profile"
          element={<Profile handleChangeImg={handleChangeImg} />}
        />
        <Route path="/notify" element={<Notify />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
