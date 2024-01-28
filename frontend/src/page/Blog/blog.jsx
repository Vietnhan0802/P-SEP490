import React from "react";
import { useState } from "react";
import "../Blog/blog.scss";
import avatar from "../../images/common/Avatar.png";
import { CiCircleChevRight } from "react-icons/ci";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import ReportPopup from "../../components/Popup/reportPopup";
import { userInstance } from "../../axios/axiosConfig";
function Blog({ blogId, onBlogClick, activeItem, onItemClick }) {
  const blogContent = [
    {
      id: 1,
      name: "Admin",
      img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis nulla interdum porta et. Massa purus nulla sit curabitur volutpat a. Magna nulla placerat nullam magna adipiscing cras euismod sed odio. Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor ullamcorper nulla odio sagittis in. Volutpat vel integer lacus lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae pellentesque urna donec in. Vitae pretium consequat tortor pharetra. Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis elementum et ornare tristique pharetra. Metus sed nisl ipsum proin imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit pellentesque viverra metus arcu. Turpis tempus aliquam magnis volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis. Ultrices molestie faucibus sit non. Diam quisque elit tempus porttitor. Pellentesque laoreet dolor erat dolor sit urna elit consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed lacus. Quam lectus id odio amet enim amet eget viverra urna. At aliquet vitae sapien faucibus urna tempus in..",
      view: 12,
      comment: 123,
    },
    {
      id: 2,
      name: "Admin",
      img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis nulla interdum porta et. Massa purus nulla sit curabitur volutpat a. Magna nulla placerat nullam magna adipiscing cras euismod sed odio. Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor ullamcorper nulla odio sagittis in. Volutpat vel integer lacus lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae pellentesque urna donec in. Vitae pretium consequat tortor pharetra. Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis elementum et ornare tristique pharetra. Metus sed nisl ipsum proin imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit pellentesque viverra metus arcu. Turpis tempus aliquam magnis volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis. Ultrices molestie faucibus sit non. Diam quisque elit tempus porttitor. Pellentesque laoreet dolor erat dolor sit urna elit consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed lacus. Quam lectus id odio amet enim amet eget viverra urna. At aliquet vitae sapien faucibus urna tempus in..",
      view: 12,
      comment: 123,
    },
    {
      id: 3,
      name: "Admin",
      img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis nulla interdum porta et. Massa purus nulla sit curabitur volutpat a. Magna nulla placerat nullam magna adipiscing cras euismod sed odio. Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor ullamcorper nulla odio sagittis in. Volutpat vel integer lacus lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae pellentesque urna donec in. Vitae pretium consequat tortor pharetra. Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis elementum et ornare tristique pharetra. Metus sed nisl ipsum proin imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit pellentesque viverra metus arcu. Turpis tempus aliquam magnis volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis. Ultrices molestie faucibus sit non. Diam quisque elit tempus porttitor. Pellentesque laoreet dolor erat dolor sit urna elit consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed lacus. Quam lectus id odio amet enim amet eget viverra urna. At aliquet vitae sapien faucibus urna tempus in..",
      view: 12,
      comment: 123,
    },
    {
      id: 4,
      name: "Admin",
      img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis nulla interdum porta et. Massa purus nulla sit curabitur volutpat a. Magna nulla placerat nullam magna adipiscing cras euismod sed odio. Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor ullamcorper nulla odio sagittis in. Volutpat vel integer lacus lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae pellentesque urna donec in. Vitae pretium consequat tortor pharetra. Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis elementum et ornare tristique pharetra. Metus sed nisl ipsum proin imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit pellentesque viverra metus arcu. Turpis tempus aliquam magnis volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis. Ultrices molestie faucibus sit non. Diam quisque elit tempus porttitor. Pellentesque laoreet dolor erat dolor sit urna elit consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed lacus. Quam lectus id odio amet enim amet eget viverra urna. At aliquet vitae sapien faucibus urna tempus in..",
      view: 12,
      comment: 123,
    },
    {
      id: 5,
      name: "Admin",
      img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis nulla interdum porta et. Massa purus nulla sit curabitur volutpat a. Magna nulla placerat nullam magna adipiscing cras euismod sed odio. Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor ullamcorper nulla odio sagittis in. Volutpat vel integer lacus lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae pellentesque urna donec in. Vitae pretium consequat tortor pharetra. Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis elementum et ornare tristique pharetra. Metus sed nisl ipsum proin imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit pellentesque viverra metus arcu. Turpis tempus aliquam magnis volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis. Ultrices molestie faucibus sit non. Diam quisque elit tempus porttitor. Pellentesque laoreet dolor erat dolor sit urna elit consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed lacus. Quam lectus id odio amet enim amet eget viverra urna. At aliquet vitae sapien faucibus urna tempus in..",
      view: 12,
      comment: 123,
    },
  ];
  const [inputs, setInputs] = useState({})
  const [blogPopups, setBlogPopups] = useState({});
  const hanldeViewDetail = (blogId) => {
    onBlogClick(blogId);
    onItemClick("blog_detail");
  }
  const handleReportClick = (blogId) => {
    setBlogPopups((prev) => ({ ...prev, [blogId]: true }));
  };
  const handleCreateBlog = () => {
    userInstance.post("/create-blog", {

    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }
  // Handler function to update the state when the input changes
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(inputs)
    setInputs((values) => ({ ...values, [name]: value }));
  };
  return (
    <div>
      <div id="blog">
        <div className="blog-form p-2">
          <div className="d-flex align-items-center flex-column">
            <input type="text" name="title" value={inputs.title}
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
          </div>
          <div className="d-flex  justify-content-between mt-2">
            <button className="btn btn-outline-primary">Add Image</button>
            <button className="btn">
              <CiCircleChevRight className=" fs-3" onClick={handleCreateBlog} />
            </button>
          </div>

        </div>
        {blogContent.map((item) => (
          <div
            key={item.id}
            className={`blog-item p-2 ${blogPopups[item.id] ? "position-relative" : ""
              }`}
          >
            <div className="d-flex align-items-center">
              <div alt="profile" className="profile">
                {item.img}
              </div>
              <div className="ms-2">
                <h6 className="mb-0">{item.name}</h6>
                <p className="mb-0">{item.time}</p>
              </div>
            </div>

            <p className="mt-2">{item.content}</p>
            <div className="d-flex justify-content-between mt-2">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-3">
                  <FiEye className="me-2" />
                  {item.view}
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
