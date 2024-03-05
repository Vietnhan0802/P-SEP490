import React, { useEffect } from "react";
import { useState } from "react";
import "../Profile/profile.scss";
import "../Profile/check-box.scss";
import "../Profile/switch-btn.scss";
import "../Profile/project.scss";
import degree from "../../images/common/degree.png";
import project1 from "../../images/project/Pro-1.png";
import avatar from "../../images/common/Avatar.png";
import Follow from "../../components/follow";
import { Col, Row } from "react-bootstrap";
import ProfileReport from "../../components/Popup/ProfileReport";
import defaultImage from "../../images/common/default.png";
import { blogInstance, followInstance, postInstance, projectInstance, userInstance } from "../../axios/axiosConfig";
import { FiEdit } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { FiFlag } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import defaultProject from '../../images/common/default_project.webp'
function formatDateString(dateString) {
  // Check if the dateString is not empty
  if (dateString) {
    // Split the date string to separate date and time parts
    const [datePart] = dateString.split('T');
    // Return the formatted date string in yyyy-mm-dd format
    return datePart;
  }
  // If dateString is empty, return an empty string
  return '';
}
function Profile({ handleChangeImg }) {
  const initialValue = {
    avatar: "default",
    imageSrc: defaultImage,
    imageFile: null,
  };
  const location = useLocation();
  // ````````````````````````````
  const [value, setValue] = useState(initialValue);
  const [user, setUser] = useState({});
  const [tab, setTab] = useState('');


  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { role, currentUserId } = sessionData;
  const { userId } = location.state || {};
  const [activePopup, setActivePopup] = useState(false);
  const [display, setDisplay] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [inputs, setInputs] = useState({
    userName: '',
    fullName: '',
    isMale: true,
    phoneNumber: '',
    tax: '',
    address: '',
    description: "Hello",
    imageSrc: "",
    follower:0,
    following:0
  });
  const [userPost, setUserPost] = useState([]);
  const [userProject, setUserProject] = useState([]);
  const [userBlog, setUserBlog] = useState([]);
  
  useEffect(() => {
    userInstance.get(`GetUserById/${currentUserId}?idAccount=${userId}`)
      .then((res) => {
        console.log(res?.data?.result)
        setUser(res?.data?.result);
        const user = res?.data?.result;
        if (user.role === 'Admin') {
          setTab('blog');
        } else if (user.role === 'Business') {
          setTab('post');
        } else {
          setTab('degree')
        }
        console.log("User1: "+currentUserId)
        console.log("User2: "+userId)
        // Update inputs here after user is fetched
        setInputs({
          userName: user?.username || '',
          fullName: user?.fullName || '',
          date: formatDateString(user?.date) || '',
          isMale: user?.isMale, // Assuming isMale is returned as "True" or "False" string
          phoneNumber: user?.phoneNumber || '',
          tax: user?.tax || '',
          address: user?.address || '',
          description: user?.description || "Hope you will give us some description about yourselves",
          imageSrc: user?.imageSrc,
          follower:user?.follower,
          following: user?.following
        });
        if (res?.data?.result.imageSrc === "https://localhost:7006/Images/")
          return;
        setValue({
          ...value,
          imageSrc: res?.data?.result.imageSrc,
        });
        if (user.role === 'Business') {
          postInstance.get(`GetPostByUser/${userId}`)
            .then((res) => {
              setUserPost(res?.data?.result);
              console.log(userPost)
            })
            .catch((error) => {
              console.error(error);
            });
          projectInstance.get(`GetProjectByUser/${userId}`)
            .then((res) => {
              setUserProject(res?.data?.result);
              console.log(userProject);
            })
            .catch((error) => {
              console.error(error)
            })
        }
        if (user.role === 'Admin') {
          blogInstance.get(`GetBlogByUser/${userId}`)
            .then((res) => {
              setUserBlog(res?.data?.result);
            })
            .catch((error) => {
              console.log(error)
            })
        }
        console.log(userBlog);
      })
  }, [userId])
  console.log(user)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const projectStatus = process => {
    switch (process) {
      case 0:
        return <p>Preparing</p>
      case 1:
        return <p>Processing</p>
      case 2:
        return <p>Pending</p>
      case 3:
        return <p>Done</p>
      default: return ''
    }
  }
  const handleUpdateUser = () => {
    setIsEdit(!isEdit);
    userInstance.put(`/UpdateUser/${userId}`, inputs, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err?.data);
      });
  };
  const hanldeEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateAppear = () => {
    setDisplay(true);
  };
  const handleUpdateAvatar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", value.avatar);
    formData.append("ImageFile", value.imageFile);
    formData.append("ImageSrc", value.imageSrc);
    userInstance.put(`/UpdateAvatar/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure Content-Type is set to multipart/form-data
      },
    })
      .then((res) => {
        setDisplay(false);
        if (res?.data?.status === "OK") {
          handleChangeImg("ok");
        }
        console.log(res?.data?.status);
      })
      .catch((err) => {
        console.log(err?.response?.data);
      });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValue({
          ...value,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValue({
        ...value,
        imageFile: null,
        imageSrc: defaultImage,
      });
    }
  };
  const hanldeSetTab = (tab) => {
    setTab(tab);
  }
  const handleReportPopup = () => {
    setActivePopup(!activePopup);
  };
  const handleFollow = () => {
    followInstance.post(`/FollowOrUnfollow/${currentUserId}/${userId}`,{},{
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res?.data?.result);
      })
      .catch((error) => { console.error(error); })
  }
  return (
    <>
      <Row className="mx-0 mt-3">
        <Col md={3}>
          <div id="sidebar-profile" className="bg-white p-5 position-relative ">
            <div className="text-center mb-3">
              <div className="person-name fs-3 fw-bold">{inputs.fullName}</div>
              <div className="account">{inputs.userName}</div>
            </div>
            <div className="information position-relative d-flex flex-column justify-content-center">
              <img
                src={inputs.imageSrc === "https://localhost:7006/Images/" ? defaultImage : inputs.imageSrc}
                alt=""
                className="w-100 rounded avatar m-auto"
              />
              {display ? (
                <div className="d-flex flex-column ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={showPreview}
                    className="my-2"
                  />
                  <button
                    onClick={handleUpdateAvatar}
                    className="btn btn-primary m-auto"
                  >
                    {" "}
                    Submit
                  </button>
                </div>
              ) : (
                currentUserId !== userId ?
                  <button
                    className="btn edit-btn mt-3 w-75 m-auto"
                    onClick={() => handleFollow()}
                  >
                    Follow
                  </button> :
                  <button
                    className="btn edit-btn mt-3 w-75 m-auto"
                    onClick={handleUpdateAppear}
                  >
                    Edit Avatar
                  </button> 
              )}
              <div className="w-100 text-center">
                <div className="personal-information-text mt-4"></div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <CgProfile className="me-3" /> {inputs.follower} followers · {inputs.following} following
                </div>
              </div>
            </div>
            <div className="fs-3 position-absolute top-0 end-0">
              <ProfileReport trigger={activePopup} setTrigger={setActivePopup}>
                <div className="bg-white profile-feedback">
                  <h4 className="mt-2 mb-3 border-bottom">Submit feedback</h4>
                  <p>Please enter your feedback below</p>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Is there something wrong with this user?"
                    className="mt-2"
                  ></textarea>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary">Submit</button>
                  </div>
                </div>
              </ProfileReport>
              <FiFlag onClick={() => handleReportPopup()} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div id="profile">
            {currentUserId === userId ? <div className="edit-btn-infor">
              {!isEdit && (
                <FiEdit
                  onClick={() => hanldeEdit()}
                  className="edit-icon mb-2 fs-2"
                />
              )}
              {isEdit && (
                <MdOutlineFileDownloadDone
                  onClick={() => handleUpdateUser()}
                  className="edit-icon mb-2 fs-2"
                />
              )}
            </div> : ''}


            <div class="bg-secondary-soft px-4 py-5 rounded">
              <div class="row g-3">
                <h4 class="mb-4 mt-0">Contact detail</h4>

                <div class="col-md-6">
                  <label class="form-label">Full Name:</label>
                  <input
                    type="text"
                    class="form-control bg-text"
                    name="fullName"
                    value={inputs.fullName}
                    disabled={!isEdit}
                    onChange={handleChange}
                    aria-label="Full name"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Birthday</label>
                  <input
                    type="date"
                    name="date"
                    value={inputs.date}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control bg-text"
                    aria-label="Birthday"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Phone number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control bg-text"
                    aria-label="Phone number"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Gender:</label>
                  <div class="form-control bg-text">
                    {!isEdit ? (
                      user.isMale ? (
                        <p>Male</p>
                      ) : (
                        <p>Female</p>
                      )
                    ) : (
                      <div className="checkbox-wrapper-13 bg-text">
                        <label>
                          <input
                            id="c1-13"
                            className="me-1"
                            type="checkbox"
                            checked={inputs.isMale}
                            name="isMale"
                            onChange={() =>
                              handleChange({
                                target: { name: "isMale", value: true },
                              })
                            }
                          />
                          Male
                        </label>

                        <label className="ps-4">
                          <input
                            id="c1-13"
                            className="me-1"
                            type="checkbox"
                            checked={!inputs.isMale}
                            name="isMale"
                            onChange={() =>
                              handleChange({
                                target: { name: "isMale", value: false },
                              })
                            }
                          />
                          Female
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Address:</label>
                  <input
                    type="text"
                    name="address"
                    class="form-control bg-text"
                    value={inputs.address}
                    disabled={!isEdit}
                    onChange={handleChange}
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label ">Tax:</label>
                  <input
                    type="number"
                    name="tax"
                    value={inputs.tax}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control bg-text"
                    aria-label="Tax"
                  />
                </div>

                <div class="col-md-12 ">
                  <label class="form-label">Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={inputs.description}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control bg-text"
                    aria-label="Description"
                  />
                </div>
              </div>
            </div>
            <section id="switch" className="bg-secondary-soft px-4 rounded">
              <div className="btn-swtich row pb-4">
                {user.role == 'Member' && <button class={`s-btn col height-50 ${tab === 'degree' ? 'active' : ''}`} onClick={() => hanldeSetTab('degree')}> Degree</button>}
                {user.role === 'Admin' && <button class={`s-btn col height-50 ${tab === 'blog' ? 'active' : ''}`} onClick={() => hanldeSetTab('blog')}> Blog</button>}
                {user.role === 'Business' && <button class={`s-btn col height-50 ${tab === 'post' ? 'active' : ''}`} onClick={() => hanldeSetTab('post')}> Post</button>}
                {user.role !== 'Admin' && <button class={`s-btn col height-50 ${tab === 'project' ? 'active' : ''}`} onClick={() => hanldeSetTab('project')}> Project</button>}
              </div>
              {user.role === 'Member' && tab === 'degree' && <div className="degree">
                <div className="row">
                  <div className="col-2 d-flex justify-content-center img-contain">
                    <img src={degree} alt="" className="image" />
                  </div>
                  <div className="col-7 d-flex flex-column justify-content-center">
                    <p className="degree-title ellipsis">
                      Degree title:
                      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{" "}
                    </p>
                    <p className="degree-description ellipsis">
                      Degree information:
                      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{" "}
                    </p>
                  </div>
                  <div className="col-3 d-flex justify-content-center align-items-center">
                    <button className="btn degree-detail">View Detail</button>
                  </div>
                </div>
              </div>}
              {/* DegreeTab */}


              {user.role === 'Business' && tab === 'post' && <div className="post">
                {/* start Post */}
                {userPost.map((post) => (
                  <div className="row">
                    <div className="col-3 d-flex justify-content-center img-contain">
                      <img src={post.viewPostImages.length > 0 ? post.viewPostImages[0].imageSrc : defaultProject} alt="" className="image" />
                    </div>
                    <div className="col-7 d-flex flex-column justify-content-start">
                      <div className="d-flex items-center">
                        <img
                          className="avata-s mr-4"
                          src={post.avatar}
                          alt="Instructor Cooper Bator"
                        />
                        <div className="left-30 d-flex flex-column justify-content-center">
                          <div className="size-20 SFU-heavy d-flex ellipsis">
                            {post.fullName}
                          </div>
                          <div className="size-14 SFU-reg text-gray-600 d-flex ellipsis">
                            {formatDateString(post.createdDate)}
                          </div>
                        </div>
                      </div>
                      <p className="degree-description ellipsis">
                        Post Title: {post.title}
                      </p>
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <button className="btn degree-detail">View Detail</button>
                    </div>
                  </div>
                ))}
              </div>}
              {/* Posttab of business profile*/}

              {user.role === 'Admin' && tab === 'blog' && <div className="blog">
                {/* start Post */}
                {userBlog.map((blog) => (
                  <div className="row" key={blog.idBlog}>
                    <div className="col-3 d-flex justify-content-center img-contain">
                      <img src={blog.viewBlogImages.length > 0 ? blog.viewBlogImages[0].imageSrc : defaultProject} alt="" className="image" />
                    </div>
                    <div className="col-7 d-flex flex-column justify-content-start">
                      <div className="d-flex items-center">
                        <img
                          className="avata-s mr-4"
                          src={blog.avatar}
                          alt="Instructor Cooper Bator"
                        />
                        <div className="left-30 d-flex flex-column justify-content-center">
                          <div className="size-20 SFU-heavy d-flex ellipsis">
                            {blog.fullName}
                          </div>
                          <div className="size-14 SFU-reg text-gray-600 d-flex ellipsis">
                            {formatDateString(blog.createdDate)}
                          </div>
                        </div>
                      </div>
                      <p className="degree-description ellipsis">
                        Post Title:{blog.title}
                      </p>
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                      <button className="btn degree-detail">View Detail</button>
                    </div>
                  </div>
                ))}
              </div>}

              {user.role !== 'Admin' && tab === 'project' && <div className="project">
                <div class="row" id="all-projects">
                  {userProject.map((project) => (
                    <div class="col-md-6" id="project-items-1">
                      <div class="card">
                        <div class="card-body">
                          <div class="d-flex mb-3">
                            <div class="flex-grow-1 align-items-start">
                              <div>
                                <h6 class="mb-0 text-muted">
                                  <i class="mdi mdi-circle-medium text-danger fs-3 align-middle"></i>
                                  <span class="team-date">{formatDateString(project.createdDate)}</span>
                                </h6>
                              </div>
                            </div>
                          </div>

                          <div class="mb-4">
                            <h5 class="mb-1 font-size-17 team-title ellipsis">
                              {project.name}
                            </h5>
                            <p class="text-muted mb-0 team-description ellipsis">
                              {project.description}
                            </p>
                          </div>
                          <div class="d-flex">
                            <div class="avatar-group float-start flex-grow-1 task-assigne">
                              {/* Clone from */}
                              <div class="avatar-group-item">
                                <img
                                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                  alt=""
                                  class="rounded-circle avatar-sm"
                                />
                              </div>
                              {/* to THis */}
                              <div class="avatar-group-item">
                                <img
                                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                  alt=""
                                  class="rounded-circle avatar-sm"
                                />
                              </div>
                              <div class="avatar-group-item">
                                <img
                                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                  alt=""
                                  class="rounded-circle avatar-sm"
                                />
                              </div>
                            </div>
                            <div class="align-self-end">
                              <span class="badge badge-soft-danger p-2 team-status">
                                {projectStatus(project.process)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>}
              {/* PrijectTab of business profile */}

            </section>
          </div>
                    
        </Col >
        <Col md={3}>
          <Follow />
        </Col>
      </Row >
    </>
  );
}

export default Profile;
