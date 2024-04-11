import React, { useEffect, useState } from 'react'
import DegreePu from "./degreePu";
import './profile.scss'
import defaultProject from "../../images/common/images-empty.png";
import degree from "../../images/common/degree.png";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Dropdown from "react-bootstrap/Dropdown";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import DeleteDegree from './DeleteDegree';
import { Rating } from 'react-simple-star-rating'

function ProfileTab(props) {
    const { tabs, user, currentUserId, userDegree, userPost, userBlog, userProject, formatDateString, projectStatus, resetTab } = props;
    const navigate = useNavigate();
    const [tab, setTab] = useState("");
    const [showDegreeItems, setShowDegreeItems] = useState(false);
    const [showPostItems, setShowPostItems] = useState(false);
    const [showBlogItems, setShowBlogItems] = useState(false);
    const [showProjectItems, setShowProjectItems] = useState(false);
    const [showDeleteDegreeForId, setShowDeleteDegreeForId] = useState(null);
    const hanldeSetTab = (tab) => {
        setTab(tab);
    };
    const handleDegreeViewAll = () => {
        setShowDegreeItems(!showDegreeItems);
    };

    const handlePostViewAll = () => {
        setShowPostItems(!showPostItems);
    };

    const handleBlogViewAll = () => {
        setShowBlogItems(!showBlogItems);
    };

    const handleProjectViewAll = () => {
        setShowProjectItems(!showProjectItems);
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
    console.log(userProject)
    return (
        <>
            <div className="btn-swtich d-flex flex-row justify-content-between mb-2">
                <div className="action-swap tabs switch-custom">
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
                    <span className="glider glider-custom"></span>
                </div>
                <div className="action-user d-flex flex-row align-items-center justify-content-end">
                    {user.role === "Member" && tab === "degree" && currentUserId === user.id && (
                        <DegreePu user={currentUserId} resetTab={resetTab} />
                    )}
                    {user.role === "Member" && tab === "degree" && userDegree.length > 3 && (
                        <button
                            className={`height-50 text-white btn-primary btn ${tab === "degree" ? "active" : ""
                                }`}
                            onClick={() => handleDegreeViewAll()}
                        >
                            {showDegreeItems ? "Show Less" : "View All"}
                        </button>
                    )}

                    {user.role === "Admin" && tab === "blog" && userBlog.length > 3 && (
                        <button
                            className={`height-50 text-white btn-primary btn ${tab === "blog" ? "active" : ""
                                }`}
                            onClick={() => handleBlogViewAll()}
                        >
                            {" "}
                            {showBlogItems ? "Show Less" : "View All"}
                        </button>
                    )}
                    {user.role === "Business" && tab === "post" && userPost.length > 3 && (
                        <button
                            className={`height-50 text-white btn-primary btn ${tab === "post" ? "active" : ""
                                }`}
                            onClick={() => handlePostViewAll()}
                        >
                            {" "}
                            {showPostItems ? "Show Less" : "View All"}
                        </button>
                    )}
                    {user.role !== "Admin" && tab === "project" && (
                        <button
                            className={`height-50 text-white btn-primary btn ${tab === "project" ? "active" : ""
                                }`}
                            onClick={() => handleProjectViewAll()}
                        >
                            {" "}
                            {showProjectItems ? "Show Less" : "View All"}
                        </button>
                    )}
                </div>
            </div>
            <div>
                {user.role === "Member" && tab === "degree" && (
                    <div className={`degree tab-content ${showDegreeItems ? "scrollable" : ""}`}>
                        {userDegree?.length !== 0 ?
                            userDegree?.slice(0, showDegreeItems ? userDegree?.length : 3)
                                .map((item) => (
                                    <>
                                        <div className="row mb-4 position-relative" key={item.idDegree}>
                                            <div className="col-2 d-flex justify-content-center img-contain-degree">
                                                <img src={degree} alt="" className="image" />
                                            </div>
                                            <div className="col-6 d-flex flex-column justify-content-center">
                                                <p className="degree-title ellipsis">
                                                    Degree title:
                                                    {item.name}
                                                </p>
                                                <p className="degree-description ellipsis">
                                                    Degree institution:
                                                    {item.institution}
                                                </p>
                                            </div>
                                            <div className="col-4 d-flex justify-content-center align-items-center">
                                                <a
                                                    href={item.fileSrc} // Link to the PDF file
                                                    target="_blank" // Open in a new tab
                                                    rel="noopener noreferrer" // Security best practice
                                                    className="btn btn-promary border degree-detail"
                                                >
                                                    View Detail
                                                </a>
                                            </div>
                                            <div className='position-absolute top-0 end-0 w-auto'>
                                                <Dropdown id='degree-tab'>
                                                    <Dropdown.Toggle
                                                        as={Button}
                                                        variant="white"
                                                        className="border-none text-body"

                                                    >
                                                        <BsThreeDots size={20} />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu style={{ minWidth: "auto", top: '10px !important', left: '20px' }}>
                                                        <Dropdown.Item
                                                            className="d-flex justify-content-center"
                                                            onClick={() => setShowDeleteDegreeForId(item.idDegree)}
                                                        >
                                                            <MdDelete size={20} />
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </>
                                )) : <p className='bg-white'>There is no degree</p>}
                    </div>
                )}
                {showDeleteDegreeForId && (
                    <DeleteDegree idDegree={showDeleteDegreeForId} show={showDeleteDegreeForId !== null} onClose={() => setShowDeleteDegreeForId(null)} resetTab={resetTab} />
                )}

                {/* DegreeTab */}
                {user.role === "Business" && tab === "post" && (
                    <div className={`post tab-content ${showPostItems ? "scrollable" : ""
                        }`}>
                        {userPost?.length !== 0 ?
                            userPost?.slice(0, showPostItems ? userPost?.length : 3)
                                .map((post) => (
                                    <div className="row px-3">
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
                                        <div className="col-6 d-flex flex-column justify-content-start">
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
                                            <p className="degree-description ellipsis mt-2">
                                                Title: {post.title}
                                            </p>
                                        </div>
                                        <div className="col-3 d-flex justify-content-end align-items-center" style={{ width: '30%' }}>
                                            <button className="btn btn-primary degree-detail border" onClick={() => handleNavigate(post.idPost, 'post')}>
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
                    <div className={`blog tab-content  p-3  ${showBlogItems ? "scrollable" : ""
                        }`}>
                        {userBlog?.length !== 0 ?
                            userBlog?.slice(0, showBlogItems ? userBlog?.length : 3).map((blog) => (

                                <div
                                    className="row align-items-center mb-3 px-3"
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
                                    <div className="col-6 d-flex flex-column justify-content-start">
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
                                            Blog Title: {blog.title}
                                        </p>
                                    </div>
                                    <div className="col-3 d-flex justify-content-end align-items-center" style={{ width: '30% !important' }}>
                                        <button className="btn btn-primary degree-detail border" onClick={() => handleNavigate(blog.idBlog, 'blog')}>
                                            View Detail
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
                    <div className={`project tab-content  ${showProjectItems ? "scrollable" : ""
                        }`}  >
                        <div className="row" id="all-projects">
                            {userProject?.length > 0 ? (
                                userProject?.slice(0, showProjectItems ? userProject?.length : 4).map((project) => (
                                    <div className="col-md-6" id="project-items-1" onClick={() => handleNavigate(project.idProject, 'project')}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex mb-3">
                                                    <div className="flex-grow-1 align-items-start">
                                                        <div className='d-flex justify-content-between'>
                                                            <h6 className="mb-0 text-muted">
                                                                <i className="mdi mdi-circle-medium text-danger fs-3 align-middle"></i>
                                                                <span className="team-date">
                                                                    {formatDateString(project.createdDate)}
                                                                </span>
                                                            </h6>
                                                            <Rating initialValue={project.ratingAvg} size={20} allowFraction={true} readonly={true}/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <h5 className="mb-1 font-size-17 team-title ellipsis">
                                                        {project.name}
                                                    </h5>
                                                    {/* <p className="text-muted mb-0 team-description ellipsis">
                                                        {project.description}
                                                    </p> */}
                                                </div>
                                                <div className="d-flex">
                                                    <div className="avatar-group float-start flex-grow-1 task-assigne">
                                                        {project?.memberViews?.slice(0, 5).map((member, index) => ( // Only show the first five members
                                                            <div className="avatar-group-item" key={index}>
                                                                <img
                                                                    src={member.avatarMember}
                                                                    alt=""
                                                                    className="rounded-circle avatar-sm"
                                                                />
                                                            </div>
                                                        ))}
                                                        {project?.memberViews?.length > 5 && ( // If there are more than five members, display a circle indicating the count
                                                            <div className="avatar-group-item rounded-circle avatar-sm">
                                                                +{project.memberViews.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="align-self-end">
                                                        <span className="p-2 team-status">
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
