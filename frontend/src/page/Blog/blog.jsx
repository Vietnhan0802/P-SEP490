import React, { useEffect } from "react";
import { useState } from "react";
import "../Blog/blog.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import ReportPopup from "../../components/Popup/reportPopup";
import { blogInstance } from "../../axios/axiosConfig";
import Cookies from "js-cookie";
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
function Blog({ blogId, onBlogClick, activeItem, onItemClick }) {
  const createData = (id, createdDate, title, content, view, like, viewBlogImages, fullName) => {
    return {
      id, createdDate, title, content, view, like, viewBlogImages, fullName
    }
  }

  //_________________________________________________________//
  const [inputs, setInputs] = useState({
    title: '',
    content: '',
    CreateUpdateBlogImages: [], // new state for managing multiple images
  });
  const [blogPopups, setBlogPopups] = useState({});
  const [data, setData] = useState([]);
  const userId = JSON.parse(Cookies.get("userId"));
  const role = JSON.parse(Cookies.get("role"));

  //_________________________________________________________//

  const hanldeViewDetail = (blogId) => {
    onBlogClick(blogId);
    onItemClick("blog_detail");
  }
  const handleReportClick = (blogId) => {
    setBlogPopups((prev) => ({ ...prev, [blogId]: true }));
  };
  const handleCreateBlog = () => {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('content', inputs.content);

    inputs.CreateUpdateBlogImages.forEach((imageInfo, index) => {
      formData.append(`CreateUpdateBlogImages[${index}].image`, imageInfo.image);
      formData.append(`CreateUpdateBlogImages[${index}].imageFile`, imageInfo.imageFile);
      formData.append(`CreateUpdateBlogImages[${index}].imageSrc`, imageInfo.imageSrc);
    });

    blogInstance.post(`/CreateBlog/${userId}`, formData, {
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
          CreateUpdateBlogImages: [...values.CreateUpdateBlogImages, ...convertedImages],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  useEffect(() => {
    blogInstance.get('GetAllBlogs')
      .then((res) => {
        const blogList = res?.data?.result;
        setData([]);
        blogList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setData((prevData) => ([
            ...prevData,
            createData(
              element.idBlog,
              time,
              element.title,
              element.content,
              element.view,
              element.like,
              element.viewBlogImages,
              element.fullName)
          ]));
        })
      })
      .catch((error) => { console.error(error) });
  }, []);
  return (
    <div>
      <div id="blog">
        {role === 'Admin' ? <div className="blog-form p-2">
          <div className="d-flex align-items-center flex-column">
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
          </div>

          <div className="d-flex  justify-content-between mt-2">
            <button className="btn btn-outline-primary">Add Image</button>
            <button className="btn" onClick={handleCreateBlog} >
              <CiCircleChevRight className=" fs-3" />
            </button>
          </div>

        </div> : ""}

        {data.map((item) => (
          <div
            key={item.id}
            className={`blog-item p-2 ${blogPopups[item.id] ? "position-relative" : ""
              }`}
          >
            <div className="d-flex align-items-center">
              <div alt="profile" className="profile">
                <RiAdminLine />
              </div>
              <div className="ms-2">
                <h6 className="mb-0">{item.fullName}</h6>
                <p className="mb-0">{item.createdDate}</p>
              </div>
            </div>
            <h3 className="mt-2">{item.title}</h3>

            <p className="mt-2">{item.content}</p>
            <div className="d-flex">
              {item.viewBlogImages.map(items => (
                <img src={items.imageSrc} alt="" className="w-50 p-2" />
              ))}
            </div>
            <div className="d-flex justify-content-between mt-2">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-3">
                  <FiEye className="me-2" />
                  {item.view}
                </div>
                <div className="d-flex align-items-center me-3">
                  <CiHeart className="me-2" /> {item.like}
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
                <div className="bg-white h-100 blog-report">
                  <h3 className="text-center border-bottom pb-2">Report</h3>
                  <p>
                    <b>Please fill in your feedback</b>
                  </p>
                  <textarea
                    type="text"
                    placeholder="What's wrong with this blog"
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
    </div>
  );
}

export default Blog;
