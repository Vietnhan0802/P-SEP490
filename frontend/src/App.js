import "./scss/font.scss";
import "./scss/size.scss";
import "./scss/color.scss";
import "./scss/App.scss";
import { useEffect, useRef, useState } from "react";
import SignIn from "./page/SignIn/signIn";
import SignUp from "./page/SignUp/signUp";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Chat from "./page/Chat/chat";
import Header from "./components/header";
import Profile from "./page/Profile/profile";
import Notify from "./page/Notify/notify";
import ForgetPassword from "./page/Password/forgetPassword";
import ResetPassword from "./page/Password/resetPassword";
import { ToastContainer } from "react-toastify";
import "../src/i18n/i18n";
import PostDetail from "./page/Detail/postDetail";
import BlogDetail from "./page/Detail/blogDetail";
import ProjectDetail from "./page/ProjectDetail/projectDetail";
import DashBoard from "./page/DashBoard/dashBoard";
import Post from "./page/Post/post";
import Blog from "./page/Blog/blog";
import Project from "./page/Project/project";
import OwnProject from "./page/OwnProject/ownProject";
import OwnPost from "./page/OwnPost/ownPost";
import ProjectApplication from "./page/ProjectApplication/projectApplication";
import Statistic from "./page/Statistic/statistic";
import { followInstance } from "./axios/axiosConfig";
import Follow from "./components/follow";
function App() {
  const location = useLocation();
  const appRef = useRef(null);
  const navigate = useNavigate(); // Hook to handle navigation
  const [changeImage, setChangeImage] = useState(false);
  const [following, setFollowing] = useState([]);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
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
  useEffect(() => {
    followInstance.get(`GetAllFollowings/${currentUserId}`)
      .then((res) => { setFollowing(res?.data?.result) })
      .catch((error) => { console.error(error) })
  }, [])
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
        <Route path="/" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/postdetail" element={<PostDetail value={following}/>} />
        <Route path="/blogdetail" element={<BlogDetail value={following}/>} />
        <Route path="/projectdetail" element={<ProjectDetail />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/post" element={<Post value={following}/>} />
        <Route path="/blog" element={<Blog value={following}/>} />
        <Route path="/project" element={<Project value={following} />} />
        <Route path="/ownproject" element={<OwnProject value={following} />} />
        <Route path="/ownpost" element={<OwnPost value={following}/>} />
        <Route path="/projectapplication" element={<ProjectApplication />} />
        <Route path="/currentproject" element={<OwnProject value={following}/>} />
        <Route path="/statistic" element={<Statistic />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/profile"
          element={<Profile handleChangeImg={handleChangeImg} value={following} />}
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
