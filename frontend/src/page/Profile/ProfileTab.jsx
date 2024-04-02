import React, { useEffect, useState } from 'react'
import DegreePu from "./degreePu";
import defaultProject from "../../images/common/default_project.webp";
import degree from "../../images/common/degree.png";
import { useNavigate } from 'react-router-dom';

function ProfileTab(props) {
    const { tabs, user, currentUserId, userDegree, userPost, userBlog, userProject, formatDateString, projectStatus } = props;
    const navigate = useNavigate();
    const [tab, setTab] = useState("");
    const [showAllItems, setShowAllItems] = useState(false);
    const hanldeSetTab = (tab) => {
        setTab(tab);
        setShowAllItems(!showAllItems);
    };
    const handleNavigate = (id, type) => {
        switch (type) {
            case ('post'):
                return navigate('/postdetail', { state: { idPost: id } });
            case ('blog'):
                return navigate('/blogdetail', { state: { idBlog: id } });
            case ('project'):
                return navigate('/projectdetail', { state: { idProject: id } });
            default:
                return "";
        }
    }
    useEffect(() => {
        if (user.role === "Admin") {
            setTab("blog");
        } else if (user.role === "Business") {
            setTab("post");
        } else {
            setTab("degree");
        }
    }, [user])
    return (
        <>
            <div className="btn-swtich d-flex flex-row justify-content-between mb-2">
                <div className="action-swap tabs">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={index}>
                            <input
                                type="radio"
                                id={`radio-${index + 1}`}
                                name="tabs"
                                defaultChecked={index === 0}
                                onClick={() => hanldeSetTab(tab.action)}
                            />
                            <label className="tab" htmlFor={`radio-${index + 1}`}>
                                {tab.title}
                            </label>
                        </React.Fragment>
                    ))}
                    <span className="glider"></span>
                </div>
                <div className="action-user d-flex flex-row align-items-center justify-content-end">
                    {user.role === "Member" && tab === "degree" && (
                        <DegreePu user={currentUserId} />
                    )}
                    {user.role === "Member" && tab === "degree" && (
                        <button
                            className={`height-50 text-white btn-info btn ${tab === "degree" ? "active" : ""
                                }`}
                            onClick={() => hanldeSetTab("degree")}
                        >
                            {showAllItems ? "Show Less" : "View All"}
                        </button>
                    )}

                    {user.role === "Admin" && tab === "blog" && (
                        <button
                            className={`height-50 text-white btn-info btn ${tab === "blog" ? "active" : ""
                                }`}
                            onClick={() => hanldeSetTab("blog")}
                        >
                            {" "}
                            {showAllItems ? "Show Less" : "View All"}
                        </button>
                    )}
                    {user.role === "Business" && tab === "post" && (
                        <button
                            className={`height-50 text-white btn-info btn ${tab === "post" ? "active" : ""
                                }`}
                            onClick={() => hanldeSetTab("post")}
                        >
                            {" "}
                            {showAllItems ? "Show Less" : "View All"}
                        </button>
                    )}
                    {user.role !== "Admin" && tab === "project" && (
                        <button
                            className={`height-50 text-white btn-info btn ${tab === "project" ? "active" : ""
                                }`}
                            onClick={() => hanldeSetTab("project")}
                        >
                            {" "}
                            {showAllItems ? "Show Less" : "View All"}
                        </button>
                    )}
                </div>
            </div>
            <div>
                {user.role === "Member" && tab === "degree" && (
                    <div className={`degree tab-content ${showAllItems ? "scrollable" : ""}`}>
                        {userDegree?.length !== 0 ? userDegree
                            .slice(0, showAllItems ? userDegree?.length : 3)
                            .map((item) => (
                                <div className="row mb-4" key={item.idDegree}>
                                    <div className="col-2 d-flex justify-content-center img-contain">
                                        <img src={degree} alt="" className="image" />
                                    </div>
                                    <div className="col-7 d-flex flex-column justify-content-center">
                                        <p className="degree-title ellipsis">
                                            Degree title:
                                            {item.name}
                                        </p>
                                        <p className="degree-description ellipsis">
                                            Degree institution:
                                            {item.institution}
                                        </p>
                                    </div>
                                    <div className="col-3 d-flex justify-content-center align-items-center">
                                        <a
                                            href={item.fileSrc} // Link to the PDF file
                                            target="_blank" // Open in a new tab
                                            rel="noopener noreferrer" // Security best practice
                                            className="btn degree-detail btn-info text-white"
                                        >
                                            View Detail
                                        </a>
                                        {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                  <div
                                    style={{
                                      border: '1px solid rgba(0, 0, 0, 0.3)',
                                      height: '750px',
                                    }}
                                  >
                                    <Viewer fileUrl={item.fileSrc}
                                     />
                                  </div>
                                </Worker> */}
                                    </div>
                                </div>
                            )) : <p>There is no degree</p>}
                    </div>
                )}
                {/* DegreeTab */}
                {user.role === "Business" && tab === "post" && (
                    <div className={`post tab-content ${showAllItems ? "scrollable" : ""
                        }`}>
                        {userPost?.length !== 0 ?
                            userPost.slice(0, showAllItems ? userPost?.length : 3)
                                .map((post) => (
                                    <div className="row">
                                        <div className="col-3 d-flex justify-content-center img-contain">
                                            <img
                                                src={
                                                    post.viewPostImages.length > 0
                                                        ? post.viewPostImages[0].imageSrc
                                                        : defaultProject
                                                }
                                                alt=""
                                                className="image"
                                            />
                                        </div>
                                        <div className="col-7 d-flex flex-column justify-content-start">
                                            <div className="d-flex items-center">
                                                <div className="avatar-contain me-2">
                                                    <img
                                                        src={post.avatar}
                                                        alt="Instructor Cooper Bator"
                                                    />
                                                </div>
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
                                            <button className="btn degree-detail" onClick={() => handleNavigate(post.idPost, 'post')}>
                                                View Detail
                                            </button>
                                        </div>
                                    </div>
                                ))
                            : (
                                <p>There is no post </p>
                            )}
                    </div>
                )}
                {/* Posttab of business profile*/}
                {user.role === "Admin" && tab === "blog" && (
                    <div className="blog tab-content">
                        {userBlog?.length !== 0 ?
                            userBlog.slice(0, showAllItems ? userBlog?.length : 3).map((blog) => (
                                <div
                                    className="row align-items-center mb-3"
                                    key={blog.idBlog}
                                >
                                    <div className="col-3 d-flex justify-content-center img-contain">
                                        <img
                                            src={
                                                blog?.viewBlogImages?.length > 0
                                                    ? blog?.viewBlogImages[0].imageSrc
                                                    : defaultProject
                                            }
                                            alt=""
                                            className="image"
                                        />
                                    </div>
                                    <div className="col-7 d-flex flex-column justify-content-start">
                                        <div className="d-flex items-center">
                                            <div className="avatar-contain me-2">
                                                <img
                                                    src={blog.avatar}
                                                    alt="Instructor Cooper Bator"
                                                />
                                            </div>

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
                                        <button className="btn degree-detail" onClick={() => handleNavigate(blog.idBlog, 'blog')}>
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                            : (
                                <p>There is no blog</p>
                            )}
                    </div>
                )}
                {user.role !== "Admin" && tab === "project" && (
                    <div className="project tab-content">
                        <div className="row" id="all-projects">
                            {userProject?.length > 0 ? (
                                userProject?.map((project) => (
                                    <div className="col-md-6" id="project-items-1" onClick={() => handleNavigate(project.idProject, 'project')}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex mb-3">
                                                    <div className="flex-grow-1 align-items-start">
                                                        <div>
                                                            <h6 className="mb-0 text-muted">
                                                                <i className="mdi mdi-circle-medium text-danger fs-3 align-middle"></i>
                                                                <span className="team-date">
                                                                    {formatDateString(project.createdDate)}
                                                                </span>
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <h5 className="mb-1 font-size-17 team-title ellipsis">
                                                        {project.name}
                                                    </h5>
                                                    <p className="text-muted mb-0 team-description ellipsis">
                                                        {project.description}
                                                    </p>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="avatar-group float-start flex-grow-1 task-assigne">
                                                        {/* Clone from */}
                                                        <div className="avatar-group-item">
                                                            <img
                                                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                alt=""
                                                                className="rounded-circle avatar-sm"
                                                            />
                                                        </div>
                                                        {/* to THis */}
                                                        <div className="avatar-group-item">
                                                            <img
                                                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                alt=""
                                                                className="rounded-circle avatar-sm"
                                                            />
                                                        </div>
                                                        <div className="avatar-group-item">
                                                            <img
                                                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                alt=""
                                                                className="rounded-circle avatar-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="align-self-end">
                                                        <span className="badge badge-soft-danger p-2 team-status">
                                                            {projectStatus(project.process)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>There is no project</p>
                            )}
                        </div>
                    </div>
                )}

                {/* PrijectTab of business profile */}
            </div>
        </>
    )
}

export default ProfileTab