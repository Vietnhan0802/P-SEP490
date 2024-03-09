import React from "react";
import "./projectDetail.scss";
import { IoPersonAdd } from "react-icons/io5";
import { IoPersonRemove } from "react-icons/io5";
import { Row, Col } from "react-bootstrap";
import projectImage from "../../images/common/projectImage.png";
import avatar from "../../images/common/Avatar.png";
import { LuDot } from "react-icons/lu";
import MultiStepProgressBar from "../../components/MultiStepProgressBar";
import { BsSendPlus } from "react-icons/bs";
import FormMember from "./formMember";
import FormApply from "./FormApply";
function ProjectDetail() {
  const project = {
    description: `Lorem ipsum dolor sit amet consectetur. 
        Dignissim dui amet elementum commodo dictumst fermentum. Orci auctor imperdiet ultrices netus ullamcorper sapien aliquet purus enim. Bibendum aliquam eu luctus dignissim porttitor mattis rhoncus. Venenatis tristique integer dolor venenatis at in. Ultricies rhoncus eget scelerisque nec consectetur consequat purus at. Varius sem eu pulvinar parturient nunc tellus. Duis id ut etiam ac. Ut vel amet amet sit.
       Malesuada est nisi dignissim in etiam adipiscing. Lacus diam ultrices interdum faucibus quam cursus sit. Morbi ac interdum elementum iaculis est ornare placerat nunc arcu. Dui bibendum odio id elementum quis ut quis porttitor eget. Suspendisse tortor donec vestibulum odio nulla. Odio est nec etiam vivamus amet. Arcu id odio vestibulum est vitae. Cursus eleifend tortor arcu diam facilisi facilisis vel ut. Et suspendisse venenatis tincidunt nunc pellentesque massa nam ullamcorper cras. Sit molestie sapien interdum nunc amet pretium convallis ornare.
       Felis libero varius maecenas tellus ultricies fermentum purus amet. Viverra dui tincidunt et sapien pulvinar quis. Tempor aliquam tempus magnis ut vel morbi tellus eros. Semper egestas suspendisse quis eget tempus condimentum. Erat in non nulla varius porttitor eros. Fermentum morbi aliquet sed a id feugiat feugiat. Adipiscing viverra nullam risus non metus netus a. Adipiscing pellentesque cursus in scelerisque id risus euismod commodo. Arcu cursus aliquam tincidunt sed lectus id.
       Amet amet amet aliquet id nulla a aenean ut. Massa orci nunc ultrices maecenas vulputate ut. Tincidunt felis accumsan semper luctus vivamus mi commodo in. Iaculis quis vivamus est malesuada neque mi sagittis. Praesent risus enim ullamcorper vestibulum odio volutpat adipiscing. Felis nulla vulputate justo tortor est. Gravida bibendum molestie eu fringilla lectus. Dignissim faucibus massa dis quis. Neque feugiat adipiscing ipsum pulvinar at eget ut.
       Cursus libero tristique quam commodo lectus eget a praesent malesuada. Nulla sed bibendum donec tellus urna porttitor. Elementum dictumst faucibus quis vestibulum vitae blandit tincidunt. Id quam sollicitudin in egestas nec et. Vitae eleifend integer quam consequat aliquet ipsum id. Nunc elit tortor convallis aliquet id. Est convallis elit urna habitant tellus viverra scelerisque tristique placerat. Orci sollicitudin non cursus erat facilisis lacus.
       Interdum ut dui sapien et massa suspendisse lacus. Nec cras vestibulum at quisque nisi quam. Aliquam sit viverra sit vulputate. Sed posuere posuere diam nec in. Arcu at vulputate elit sed amet diam.`,
  };
  return (
    <div id="projectDetail" className="bg-white bor-rad-8 p-2">
      <h1 className="header fw-bold text-center pt-2  mb-4">
        UX review presentations
      </h1>
      <Row className="pb-4 justify-content-between">
        <Col md={6}>
          <img
            src={projectImage}
            alt="project"
            className="w-100 mx-2 bor-rad-8 shadow"
          />
        </Col>
        <Col md={6} className="px-4">
          <div className="d-flex project">
            <div className="width-auto">
              <img src={avatar} alt="avatar" className="avatar" />
            </div>
            <div className="width-auto ps-3">
              <p className="owner-name fw-bold">Olivia Rhye</p>
              <p className="project-start-date">20 Jan 2024</p>
            </div>
          </div>
          <div className="status-block size-18">
            <label htmlFor="" className="">
              Project Status:
              <div class="status preparing">Preparing</div>
              <div class="status process">Process</div>
              <div class="status pending">Pending</div>
              <div class="status done">Done</div>
            </label>
          </div>
          <div className="status-block size-18">
            <label htmlFor="" className="">
              Access Visibility:
              <div class="visibility public">Public</div>
              <div class="visibility private">Private</div>
              <div class="visibility hidden">Hidden</div>
            </label>
          </div>

          <div className="process-bar">
            <MultiStepProgressBar />
          </div>
        </Col>
      </Row>
      <div className="description-cover">
        <p className="description fw-bold ps-3">Description</p>
        <p className="description-text ps-3">{project.description}</p>
      </div>
      <div className="member px-3">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-end">
            <p className="title fw-bold">Member</p>
            <p className="view">View all</p>
          </div>
          <div className="d-flex align-items-center">
            {" "}
            <FormMember/>
            
            <FormApply/>
          </div>
        </div>
        <table className="w-100">
          <tr>
            <th className="w-20 py-3">User Name</th>
            <th className="w-10 py-3 text-center">Date</th>
            <th className="w-60 py-3">Description</th>
            <th className="w-10 py-3 text-center">Remove</th>
          </tr>
          <tr>
            <td className="w-20 py-3">
              <div className="d-flex align-items-center">
                <img src={avatar} className="member-img" alt="avatar" />
                <p className="ps-3">Olivia Rhye</p>
              </div>
            </td>
            <td className="w-20 py-3 text-center">21 Jan 2024</td>
            <td className="w-60 py-3">
              Lack of relevant and substantial information
            </td>
            <td className="w-10 py-3 text-center  yellow-icon">
              <IoPersonRemove />
            </td>
          </tr>
          <tr>
            <td className="w-20 py-3">
              <div className="d-flex align-items-center">
                <img src={avatar} className="member-img" alt="avatar" />
                <p className="ps-3">Olivia Rhye</p>
              </div>
            </td>
            <td className="w-20 py-3 text-center">21 Jan 2024</td>
            <td className="w-60 py-3">
              Lack of relevant and substantial information
            </td>
            <td className="w-10 py-3 text-center  yellow-icon">
              <IoPersonRemove />
            </td>
          </tr>

          <tr>
            <td className="w-20 py-3">
              <div className="d-flex align-items-center">
                <img src={avatar} className="member-img" alt="avatar" />
                <p className="ps-3">Olivia Rhye</p>
              </div>
            </td>
            <td className="w-20 py-3 text-center">21 Jan 2024</td>
            <td className="w-60 py-3">
              Lack of relevant and substantial information
            </td>
            <td className="w-10 py-3 text-center  yellow-icon">
              <IoPersonRemove />
            </td>
          </tr>
          <tr>
            <td className="w-20 py-3">
              <div className="d-flex align-items-center">
                <img src={avatar} className="member-img" alt="avatar" />
                <p className="ps-3">Olivia Rhye</p>
              </div>
            </td>
            <td className="w-20 py-3 text-center">21 Jan 2024</td>
            <td className="w-60 py-3">
              Lack of relevant and substantial information
            </td>
            <td className="w-10 py-3 text-center  yellow-icon">
              <IoPersonRemove />
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default ProjectDetail;
