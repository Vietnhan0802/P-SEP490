import React, { useEffect, useRef } from "react";
import "../OwnProject/ownProject.scss";
import avatar from "../../images/common/default.png";
import sender from "../../images/common/send-01.png";
import { CiSearch } from "react-icons/ci";

import { useState } from "react";
import { projectInstance } from "../../axios/axiosConfig";
import CreateProject from "../OwnProject/createProject";

function Project({ projetcId, onProjectClick, activeItem, onItemClick }) {
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { role, userId } = sessionData;

  const [value, setValue] = useState({
    name: '',
    description: '',
    avatar: '',
    visibility: 1,
    ImageFile: '',
    ImageSrc: ''
  });
  const [projects, setProjects] = useState([]);
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];

      // Use FileReader to convert each file to base64
      const base64String = readFileAsDataURL(file);

      setValue((values) => ({
        ...values,
        avatar: file.name,
        ImageFile: file,
        ImageSrc: base64String,

      }));
      console.log(value);
      showPreview(event);
    } else {
      setValue((values) => ({ ...values, [name]: value }));
    }
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
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValue({
          ...value,
          avatar: imageFile.name,
          ImageFile: imageFile,
          ImageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValue({
        ...value,
        ImageFile: null,
        ImageSrc: '',
      });
    }
  };
  const hanldeViewDetail = (projectId) => {
    onProjectClick(projectId);
    onItemClick("projectDetail");
  };
  const handleCreateProject = () => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("description", value.description);
    formData.append("avatar", value.avatar);
    formData.append("visibility", value.visibility);
    formData.append("ImageFile", value.ImageFile);
    formData.append("ImageSrc", value.ImageSrc);
    projectInstance.post(`/CreateProject/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    }).then(() => {
      setValue({
        name: '',
        description: '',
        avatar: '',
        visibility: 1,
        ImageFile: '',
        ImageSrc: ''
      });
    })
  };
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    projectInstance.get('GetAllProjects')
      .then((res) => {
        console.log(res?.data?.result)
        setProjects(res?.data?.result)
      })
      .catch((error) => { console.error(error) })
  }, [])
  return (
    <div id="own_project">
      {role === "Business" ? (
        <div className="bg-white p-2 d-flex flex-grid align-items-center justify-content-between row m-0 form mb-3">
          <div className="d-flex project-search align-items-center position-relative col">
            <CiSearch className="" />
            <input
              type="text"
              placeholder={"Search"}
              className="search-box size-20"
            />
          </div>
          <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
            <CreateProject />
          </div>
        </div>

      ) : (
        ""
      )}
      {projects.map((item) => (
        <div className="p-2 card bg-white p-6 rounded-lg w-96 mb-4" key={item.idProject}>
          <div className="image-container d-flex justify-content-center">
            <img
              className="rounded-t-lg bor-8"
              src={item.avatar}
              alt="Laptop with developer items spread around"
            />
          </div>


          <div className="mt-2 ">
            <h2 className="text-xl SFU-bold">{item.name}</h2>
            <p className="text-gray-600 SFU-reg">
              {item.description}
            </p>
            <hr />
            <div className="d-flex items-center justify-content-between mt-2">
              <div className="d-flex items-center">
                <img
                  className="avata-s mr-4"
                  src={item.avatarUser === 'https://localhost:7006/Images/' ? avatar : item.avatarUser}
                  alt="Instructor Cooper Bator"
                />
                <div className="left-30 d-flex flex-column justify-content-center">
                  <div className="size-20 SFU-heavy d-flex">{item.fullName}</div>
                  <div className="size-14 SFU-reg text-gray-600 d-flex">
                    Date Create: {item.createdDate}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row gap-2">
                <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark"
                  onClick={() => hanldeViewDetail(item.idProject)}
                >
                  Detail
                </button>
                
              </div>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default Project;
