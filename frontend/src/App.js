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
import Confirmemail from "./page/Password/confirmemail";
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
import ProjectInviation from "./page/ProjectApplication/projectInviation";
import NotFound from "./components/NotFound";
function App() {
  const location = useLocation();
  const appRef = useRef(null);
  const navigate = useNavigate(); // Hook to handle navigation
  const [changeImage, setChangeImage] = useState(false);
  const [follow, setFollow] = useState(true);
  const [following, setFollowing] = useState([]);
  const [color, setColor] = useState();
  const [resetPopup, setResetPopup] = useState(false);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};

  const { currentUserId, role } = sessionData;

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/forgetpassword" ||
      location.pathname === "/confirmemail" ||
      location.pathname === "/notfound" ||
      location.pathname === "/resetpassword"
    ) {
      return;
    } else if (currentUserId === undefined || role === undefined) {
      navigate("/");
    }
  }, [location.pathname]);
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
    location.pathname === "/confirmemail" ||
    location.pathname === "/notfound" ||
    location.pathname === "/resetpassword"
  );
  const resetFollowing = (value) => {
    if (value === "Success") {
      setFollow(!follow);
    }
  };
  const handleChangeImg = (value) => {
    if (value === "ok") {
      setChangeImage(!changeImage);
    }
  };
  useEffect(() => {
    followInstance
      .get(`GetAllFollowings/${currentUserId}`)
      .then((res) => {
        setFollowing(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId, follow]);
  const changeThemeHeader = (value) => {
    setColor(value);
  };
  const onSidebarClick = () => {
    setResetPopup(!resetPopup);
  };
  return (
    <div
      className="App"
      ref={appRef}
      style={{ backgroundColor: "var(--body_background)", minHeight: "100vh" }}
    >
      {isHeaderVisible && (
        <Header
          onItemClick={handleHeaderItemClick}
          changeImage={changeImage}
          changeThemeHeader={changeThemeHeader}
          resetPopup={resetPopup}
        />
      )}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/postdetail" element={<PostDetail value={following} onSidebarClick={onSidebarClick} />} />
        <Route path="/blogdetail" element={<BlogDetail value={following} onSidebarClick={onSidebarClick}/>} />
        <Route path="/projectdetail" element={<ProjectDetail onSidebarClick={onSidebarClick} />} />
        <Route path="/dashboard" element={<DashBoard onSidebarClick={onSidebarClick} />} />
        <Route
          path="/post"
          element={<Post value={following} onSidebarClick={onSidebarClick} />}
        />
        <Route
          path="/blog"
          element={<Blog value={following} onSidebarClick={onSidebarClick} />}
        />
        <Route path="/project" element={<Project value={following} onSidebarClick={onSidebarClick}/>} />
        <Route path="/ownproject" element={<OwnProject value={following} onSidebarClick={onSidebarClick}/>} />
        <Route path="/ownpost" element={<OwnPost value={following} onSidebarClick={onSidebarClick} />} />
        <Route path="/projectapplication" element={<ProjectApplication onSidebarClick={onSidebarClick}/>} />
        <Route path="/invitation" element={<ProjectInviation onSidebarClick={onSidebarClick}/>} />
        <Route
          path="/currentproject"
          element={<OwnProject value={following} onSidebarClick={onSidebarClick}/>}
        />
        <Route path="/statistic" element={<Statistic color={color} onSidebarClick={onSidebarClick}/>} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/profile"
          element={
            <Profile
              handleChangeImg={handleChangeImg}
              value={following}
              resetFollowing={resetFollowing}
            />
          }
        />
        <Route path="/notify" element={<Notify />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/confirmemail" element={<Confirmemail />} />
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
