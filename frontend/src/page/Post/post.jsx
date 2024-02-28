import React, { useEffect } from "react";
import { useState } from "react";
import "../Post/post.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import defaultAvatar from "../../images/common/default.png";
import ReportPopup from "../../components/Popup/reportPopup";
import Cookies from "js-cookie";
import {
  postInstance,
  projectInstance,
  reportInstance,
} from "../../axios/axiosConfig";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function calculateTimeDifference(targetDate) {
  // Convert the target date string to a Date object
  const targetTime = new Date(targetDate).getTime();

  // Get the current time
  const currentTime = new Date().getTime();

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - targetTime;

  // Calculate the difference in seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return an object with the time difference values
  if (minutes < 60) {
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else {
    return days === 1 ? `${days} day ago` : `${hours} days ago`;
  }
}

function Post({ postId, onPostClick, activeItem, onItemClick }) {
  const role = JSON.parse(Cookies.get("role"));
  const userId = JSON.parse(Cookies.get("userId"));
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    CreateUpdatePostImages: [], // new state for managing multiple images
    project: "",
  });
  const [popupContent, setPopupContent] = useState("");
  const [project, setProject] = useState();
  const [blogPopups, setBlogPopups] = useState({});
  const [postList, setPostList] = useState([]);
  const [resetPage, setResetPage] = useState(false);
  //______________________________//

  const createData = (
    id,
    createdDate,
    avatar,
    title,
    content,
    view,
    like,
    viewPostImages,
    fullName
  ) => {
    return {
      id,
      createdDate,
      avatar,
      title,
      content,
      view,
      like,
      viewPostImages,
      fullName,
    };
  };

  const handlePopupContent = (event, postId) => {
    setPopupContent((prev) => ({ ...prev, [postId]: event.target.value }));
    console.log(popupContent);
  };
  const handleCreateReport = (userId, postId, content) => {
    reportInstance
      .post(`/CreatePostReport/${userId}/${postId}/${content}`)
      .then((res) => {
        console.log(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    postInstance
      .get(`GetAllPosts/${userId}`)
      .then((res) => {
        const postList = res?.data?.result;
        setPostList([]);
        postList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setPostList((prevData) => [
            ...prevData,
            createData(
              element.idPost,
              time,
              element.avatar,
              element.title,
              element.content,
              element.view,
              element.like,
              element.viewPostImages,
              element.fullName
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [resetPage]);

  useEffect(() => {
    projectInstance
      .get("GetAllProjects")
      .then((res) => {
        setProject(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleCreatePost = () => {
    const notifysuccess = (noti) => {
      toast.success(noti, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
    const notifyerror = (noti) => {
      toast.error(noti, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
    if (inputs.project === "") {
      alert("Plase choose a project");
    }
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("content", inputs.content);

    inputs.CreateUpdatePostImages.forEach((imageInfo, index) => {
      formData.append(
        `CreateUpdatePostImages[${index}].image`,
        imageInfo.image
      );
      formData.append(
        `CreateUpdatePostImages[${index}].imageFile`,
        imageInfo.imageFile
      );
      formData.append(
        `CreateUpdatePostImages[${index}].imageSrc`,
        imageInfo.imageSrc
      );
    });

    postInstance.post(`/CreatePost/${userId}/${inputs.project}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setResetPage(!resetPage);
        setInputs({
          title: "",
          content: "",
          CreateUpdatePostImages: [], // new state for managing multiple images
          project: "",
        });
        notifysuccess("Create post successfully!");
      })
      .catch((err) => {
        console.log(err);
        notifyerror("Create post failed!");
      });
  };

  const hanldeViewDetail = (postId) => {
    onPostClick(postId);
    onItemClick("post_detail");
  };
  const handleReportClick = (postId) => {
    setBlogPopups((prev) => ({ ...prev, [postId]: true }));
  };
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  // Handler function to update the state when the input changes
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const files = Array.from(event.target.files);

      // Use FileReader to convert each file to base64
      const newImages = files.map(async (element) => {
        const base64String = await readFileAsDataURL(element);
        return {
          image: element.name,
          imageFile: element,
          imageSrc: base64String,
        };
      });
      Promise.all(newImages).then((convertedImages) => {
        setInputs((values) => ({
          ...values,
          CreateUpdatePostImages: [
            ...values.CreateUpdatePostImages,
            ...convertedImages,
          ],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  return (
    <div id="post">
      {role === "Business" ? (
        <div className="post-form p-2">
          <div className=" flex-column">
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleInputChange}
              className="input-text"
              placeholder="Enter the title"
            />
            <textarea
              type="text"
              value={inputs.content}
              name="content"
              onChange={handleInputChange}
              className="input-text"
              placeholder="Enter your content..."
            />
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              className="form-control"
              multiple
            />
            <label>Select a project(optional):</label>
            <select
              id="dropdown"
              name="project"
              value={inputs.project}
              onChange={handleInputChange}
            >
              <option value="">Select a project</option>
              {project?.map((item) => (
                <option key={item.idProject} value={item.idProject}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex  justify-content-end mt-2">
            <button className="btn" onClick={handleCreatePost}>
              <CiCircleChevRight className=" fs-3" />
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      {postList.map((item) => (
        <div
          key={item.id}
          className={`pos-rel post-item mt-2 p-2 ${
            blogPopups[item.id] ? "position-relative" : ""
          }`}
        >
          <div className="d-flex align-items-center">
            <img
              className="avata-s mr-4"
              src={item.avatar === 'https://localhost:7006/Images/' ? defaultAvatar : item.avatar}
              alt="Instructor Cooper Bator"
            />
            <div className="left-30 d-flex flex-column justify-content-center">
              <div className="size-20 SFU-heavy d-flex">{item.fullName}</div>
              <div className="size-14 SFU-reg text-gray-600 d-flex">
                {item.createdDate}
              </div>
            </div>
          </div>
          <h4 className="mt-2">{item.title}</h4>

          <p className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
            {item.content}
          </p>

          <div className="d-flex post-imgs">
            {item.viewPostImages?.map((items) => (
              <img src={items.imageSrc} alt="" className="w-50 p-2" />
            ))}
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> {item.view}
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> {item.comment}
              </div>
              <div
                className="d-flex align-items-center me-3 pos-abs flag-icon"
                onClick={() => handleReportClick(item.id)}
              >
                <IoFlagOutline className="full-div" />{" "}
              </div>
            </div>
            <button
              className="view-btn btn"
              onClick={() => hanldeViewDetail(item.id)}
            >
              View Detail
            </button>
          </div>
          {blogPopups[item.id] && (
            <ReportPopup
              trigger={blogPopups[item.id]}
              setTrigger={(value) =>
                setBlogPopups((prev) => ({ ...prev, [item.id]: value }))
              }
            >
              <div className="bg-white h-100 post-report">
                <h3 className="text-center border-bottom pb-2">Report</h3>
                <p>
                  <b>Please fill in your feedback</b>
                </p>
                <textarea
                  type="text"
                  placeholder="What's wrong with this post"
                  value={popupContent[item.id]}
                  className="w-100 p-3"
                  onChange={(event) => handlePopupContent(event, item.id)}
                />
                <div className="d-flex justify-content-end mt-2">
                  <button
                    className="btn btn-secondary "
                    onClick={() =>
                      handleCreateReport(userId, item.id, popupContent[item.id])
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </ReportPopup>
          )}
        </div>
      ))}
    </div>
  );
}

export default Post;
