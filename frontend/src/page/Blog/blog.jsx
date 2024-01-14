import React from "react";
import { useState } from "react";
import "../Blog/blog.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import avatar from "../../images/common/Avatar.png";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
function Blog() {
  const [inputValue, setInputValue] = useState("");

  // Handler function to update the state when the input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <div>
      <div id="blog">
        <div className="blog-item mt-2 p-2">
          <div className="d-flex align-items-center">
            <img src={avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">John Doe</h6>
              <p className="mb-0">10 min ago</p>
            </div>
          </div>

          <p className="mt-2">
            Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis
            nulla interdum porta et. Massa purus nulla sit curabitur volutpat a.
            Magna nulla placerat nullam magna adipiscing cras euismod sed odio.
            Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet
            cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est
            pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor
            ullamcorper nulla odio sagittis in. Volutpat vel integer lacus
            lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit
            amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae
            pellentesque urna donec in. Vitae pretium consequat tortor pharetra.
            Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis
            elementum et ornare tristique pharetra. Metus sed nisl ipsum proin
            imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium
            dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit
            pellentesque viverra metus arcu. Turpis tempus aliquam magnis
            volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et
            nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis.
            Ultrices molestie faucibus sit non. Diam quisque elit tempus
            porttitor. Pellentesque laoreet dolor erat dolor sit urna elit
            consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed
            lacus. Quam lectus id odio amet enim amet eget viverra urna. At
            aliquet vitae sapien faucibus urna tempus in..
          </p>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> 12
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> 123
              </div>

            </div>
            <button className="view-btn btn">View Detail</button>
          </div>
        </div>
        <div className="blog-item mt-2 p-2">
          <div className="d-flex align-items-center">
            <img src={avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">John Doe</h6>
              <p className="mb-0">10 min ago</p>
            </div>
          </div>
          <p className="mt-2">
            Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis
            nulla interdum porta et. Massa purus nulla sit curabitur volutpat a.
            Magna nulla placerat nullam magna adipiscing cras euismod sed odio.
            Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet
            cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est
            pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor
            ullamcorper nulla odio sagittis in. Volutpat vel integer lacus
            lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit
            amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae
            pellentesque urna donec in. Vitae pretium consequat tortor pharetra.
            Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis
            elementum et ornare tristique pharetra. Metus sed nisl ipsum proin
            imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium
            dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit
            pellentesque viverra metus arcu. Turpis tempus aliquam magnis
            volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et
            nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis.
            Ultrices molestie faucibus sit non. Diam quisque elit tempus
            porttitor. Pellentesque laoreet dolor erat dolor sit urna elit
            consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed
            lacus. Quam lectus id odio amet enim amet eget viverra urna. At
            aliquet vitae sapien faucibus urna tempus in..
          </p>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> 12
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> 123
              </div>

            </div>
            <button className="view-btn btn">View Detail</button>
          </div>
        </div>{" "}
        <div className="blog-item mt-2 p-2">
          <div className="d-flex align-items-center">
            <img src={avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">John Doe</h6>
              <p className="mb-0">10 min ago</p>
            </div>
          </div>
          <p className="mt-2">
            Lorem ipsum dolor sit amet consectetur. Adipiscing malesuada mattis
            nulla interdum porta et. Massa purus nulla sit curabitur volutpat a.
            Magna nulla placerat nullam magna adipiscing cras euismod sed odio.
            Maecenas augue sagittis pellentesque rhoncus eget morbi. Nisl amet
            cursus mauris mi viverra elit scelerisque lobortis in. Facilisis est
            pellentesque consectetur nunc. Dictum lacus aliquam nunc auctor
            ullamcorper nulla odio sagittis in. Volutpat vel integer lacus
            lorem. Nunc ipsum urna egestas gravida a. Id fames mus amet suscipit
            amet tellus ipsum sit viverra. Quisque neque nibh imperdiet vitae
            pellentesque urna donec in. Vitae pretium consequat tortor pharetra.
            Lobortis sed id convallis imperdiet est. Odio pulvinar amet mattis
            elementum et ornare tristique pharetra. Metus sed nisl ipsum proin
            imperdiet. Tortor consectetur scelerisque vivamus purus amet pretium
            dui. Fringilla vulputate vel nec tellus ac. Etiam nunc ante sit
            pellentesque viverra metus arcu. Turpis tempus aliquam magnis
            volutpat. Ipsum amet ipsum enim vitae. Donec id dui venenatis et
            nisi viverra. Pulvinar aliquam viverra ac ultricies euismod mattis.
            Ultrices molestie faucibus sit non. Diam quisque elit tempus
            porttitor. Pellentesque laoreet dolor erat dolor sit urna elit
            consequat nulla. Nullam ut enim magna nibh pretium non faucibus sed
            lacus. Quam lectus id odio amet enim amet eget viverra urna. At
            aliquet vitae sapien faucibus urna tempus in..
          </p>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> 12
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> 123
              </div>

            </div>
            <button className="view-btn btn">View Detail</button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

export default Blog;
