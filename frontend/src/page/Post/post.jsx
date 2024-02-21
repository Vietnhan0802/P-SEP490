import React, { useEffect } from "react";
import { useState } from "react";
import "../Post/post.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import avatar from "../../images/common/Avatar.png";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import ReportPopup from "../../components/Popup/reportPopup";
import Img1 from "../../images/common/post-img-1.png";
import Img2 from "../../images/common/post-img-2.png";
import Cookies from "js-cookie";
import { postInstance, projectInstance } from "../../axios/axiosConfig"
function Post({ postId, onPostClick, activeItem, onItemClick }) {
  const postContent = [
    {
      id: 1,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 2,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 3,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 4,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 5,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
  ];
  const role = JSON.parse(Cookies.get("role"));
  const userId = JSON.parse(Cookies.get("userId"));
  const [inputs, setInputs] = useState({
    title: '',
    content: '',
    CreateUpdatePostImages: [], // new state for managing multiple images
    project: ''
  });
  const [project, setProject] = useState();
  const [inputValue, setInputValue] = useState("");
  const [blogPopups, setBlogPopups] = useState({});
  const [selectedOption, setSelectedOption] = useState('');


  //______________________________//
  useEffect(() => {
    projectInstance.get('GetAllProjects')
      .then((res) => {
        setProject(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  const handleCreatePost = () => {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('content', inputs.content);

    inputs.CreateUpdateBlogImages.forEach((imageInfo, index) => {
      formData.append(`CreateUpdatePostImages[${index}].image`, imageInfo.image);
      formData.append(`CreateUpdatePostImages[${index}].imageFile`, imageInfo.imageFile);
      formData.append(`CreateUpdatePostImages[${index}].imageSrc`, imageInfo.imageSrc);
    });

    postInstance.post(`/CreateBlog/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hanldeViewDetail = (postId) => {
    onPostClick(postId);
    onItemClick("post_detail");
  }
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
    if (type === 'file') {
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
          CreateUpdatePostImages: [...values.CreateUpdatePostImages, ...convertedImages],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  console.log(inputs)
  return (
    <div id="post">
      {role === 'Business' ? <div className="post-form p-2">
        <div className=" flex-column">
          <input type="text" name="title"
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
          <select id="dropdown" name="project" value={inputs.project} onChange={handleInputChange}>
            {project.map((item) =>
              (<option key={item.idProject} value={item.idProject}>{item.name}</option>)
            )}
          </select>
        </div>

        <div className="d-flex  justify-content-end mt-2">
          {/* <button className="btn btn-outline-primary">Add Image</button> */}
          <button className="btn" onClick={handleCreatePost} >
            <CiCircleChevRight className=" fs-3" />
          </button>
        </div>

      </div> : ''}

      {postContent.map((item) => (
        <div
          key={item.id}
          className={`post-item mt-2 p-2 ${blogPopups[item.id] ? "position-relative" : ""
            }`}
        >
          <div className="d-flex align-items-center">
            <img src={avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">{item.name}</h6>
              <p className="mb-0">{item.time}</p>
            </div>
          </div>
          <div className="d-flex ">
            <img src={Img1} alt="post-img" className="w-50 " />
            <img src={Img2} alt="post-img" className="w-50 ps-1" />
          </div>
          <p className="mt-2">{item.content}</p>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> {item.view}
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> {item.comment}
              </div>
              <div
                className="d-flex align-items-center me-3"
                onClick={() => handleReportClick(item.id)}
              >
                <IoFlagOutline />{" "}
              </div>
            </div>
            <button className="view-btn btn" onClick={() => hanldeViewDetail(item.id)}>View Detail</button>
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
                  className="w-100 p-3"
                />
                <div className="d-flex justify-content-end mt-2">
                  <button className="btn btn-secondary ">Submit</button>
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
