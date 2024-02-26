import React, { useRef } from "react";
import "./ownProject.scss";
import avatar from "../../images/common/Avatar.png";
import sender from "../../images/common/send-01.png";
import p1 from "../../images/project/Pro-1.png";
import p2 from "../../images/project/Pro-2.png";
import p3 from "../../images/project/Pro-3.png";
import { GrAddCircle } from "react-icons/gr";
import Cookies from "js-cookie";
import { useState } from "react";
import { CiCircleChevRight } from "react-icons/ci";

function OwnProject() {
  const role = JSON.parse(Cookies.get("role"));

  const [inputs, setInputs] = useState({});
  const handleInputChange = (event) => {};
  const handleCreateProject = () => {};
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  console.log(inputs);
  return (
    <div id="own_project">
      {role === "Business" ? (
        <div className="blog-form p-2 mb-3">
          <div className="d-flex flex-column">
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleInputChange}
              className="input-text width-100"
              placeholder="Enter Project Name"
            />
            <textarea
              type="text"
              value={inputs.content}
              name="content"
              onChange={handleInputChange}
              className="input-text width-100"
              placeholder="Enter Project Description..."
            />
          </div>

          <div className="d-flex  justify-content-between">
            <div>
              <select
                value={inputs.visibility}
                name="visibility"
                onChange={handleInputChange}
                className="input-text width-200 me-3"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Hidden">Hidden</option>
              </select>
              <button className="btn btn-outline-primary" onClick={handleClick}>
                Add Image
              </button>
            </div>
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              className="form-control"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the input
            />
            <button className="btn p-0 width-45" onClick={handleCreateProject}>
              <GrAddCircle className="width-100 height-100"/>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="p-2 card bg-white p-6 rounded-lg w-96 mb-4">
        <div className="image-container d-flex justify-content-center">
          <img
            className="rounded-t-lg bor-8"
            src={p1}
            alt="Laptop with developer items spread around"
          />
        </div>

        <div className="mt-2 ">
          <h2 className="text-xl SFU-bold">BigData Insights</h2>
          <p className="text-gray-600 SFU-reg">
            BigData Insights là một hệ thống phân tích dữ liệu lớn được thiết kế
            để giúp doanh nghiệp hiểu rõ hơn về dữ liệu của mình thông qua các
            công cụ trực quan hóa và phân tích mạnh mẽ. Dự án tập trung vào việc
            xử lý và phân tích lượng lớn dữ liệu không cấu trúc từ nhiều nguồn
            khác nhau, cung cấp cái nhìn sâu sắc về xu hướng thị trường, hành vi
            người dùng, và hiệu suất kinh doanh.
          </p>
          <hr />
          <div className="d-flex items-center justify-content-between mt-2">
            <div className="d-flex items-center">
              <img
                className="avata-s mr-4"
                src={avatar}
                alt="Instructor Cooper Bator"
              />
              <div className="left-30 d-flex flex-column justify-content-center">
                <div className="size-20 SFU-heavy d-flex">Cooper Bator</div>
                <div className="size-14 SFU-reg text-gray-600 d-flex">
                  Date Create: 01/06/2023
                </div>
              </div>
            </div>
            <div className="d-flex flex-row gap-2">
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                Detail
              </button>
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                <img src={sender} alt="sender"></img>
                <div className="ms-3">Apply</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 card bg-white p-6 rounded-lg w-96 mb-4">
        <div className="image-container d-flex justify-content-center">
          <img
            className="rounded-t-lg bor-8"
            src={p2}
            alt="Laptop with developer items spread around"
          />
        </div>
        <div className="mt-2">
          <h2 className="text-xl SFU-bold">EduFlex</h2>
          <p className="text-gray-600 SFU-reg">
            EduFlex là một nền tảng e-learning độc đáo, cho phép tổ chức giáo
            dục và doanh nghiệp tùy chỉnh các khóa học trực tuyến của mình để
            phù hợp với nhu cầu cụ thể của học viên và tổ chức. Nền tảng này
            tích hợp công nghệ AI để cung cấp trải nghiệm học tập cá nhân hóa,
            tăng cường hiệu quả học tập thông qua các phương pháp đánh giá và
            phản hồi tự động.
          </p>
          <hr />
          <div className="d-flex items-center justify-content-between mt-2">
            <div className="d-flex items-center">
              <img
                className="avata-s mr-4"
                src={avatar}
                alt="Instructor Cooper Bator"
              />
              <div className="left-30 d-flex flex-column justify-content-center">
                <div className="size-20 SFU-heavy d-flex">Cooper Bator</div>
                <div className="size-14 SFU-reg text-gray-600 d-flex">
                  Date Create: 15/08/2023
                </div>
              </div>
            </div>
            <div className="d-flex flex-row gap-2">
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                Detail
              </button>
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                <img src={sender} alt="sender"></img>
                <div className="ms-3">Apply</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 card bg-white p-6 rounded-lg w-96 mb-4">
        <div className="image-container d-flex justify-content-center">
          <img
            className="rounded-t-lg bor-8"
            src={p3}
            alt="Laptop with developer items spread around"
          />
        </div>
        <div className="mt-2">
          <h2 className="text-xl SFU-bold">HealthCompanion</h2>
          <p className="text-gray-600 SFU-reg">
            HealthCompanion là một ứng dụng di động thông minh giúp người dùng
            theo dõi và cải thiện sức khỏe của mình thông qua việc phân tích dữ
            liệu sức khỏe cá nhân. Ứng dụng cung cấp tính năng theo dõi hoạt
            động thể chất, chế độ ăn uống, giấc ngủ và tư vấn sức khỏe dựa trên
            AI. Nó cũng cho phép người dùng kết nối với các chuyên gia y tế và
            tận dụng cộng đồng người dùng để chia sẻ kinh nghiệm và hỗ trợ lẫn
            nhau.
          </p>
          <hr />
          <div className="d-flex items-center justify-content-between mt-2">
            <div className="d-flex items-center">
              <img
                className="avata-s mr-4"
                src={avatar}
                alt="Instructor Cooper Bator"
              />
              <div className="left-30 d-flex flex-column justify-content-center">
                <div className="size-20 SFU-heavy d-flex">Cooper Bator</div>
                <div className="size-14 SFU-reg text-gray-600 d-flex">
                  Date Create: 30/09/2023
                </div>
              </div>
            </div>
            <div className="d-flex flex-row gap-2">
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                Detail
              </button>
              <button className="d-flex flex-row align-items-center btn bg-white text-dark px-4 py-2 rounded btn-light border border-dark">
                <img src={sender} alt="sender"></img>
                <div className="ms-3">Apply</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnProject;
