import React from "react";
import "./detail.scss";
import avatar from "../../images/common/Avatar.png";
import img1 from "../../images/common/post-img-1.png";
import img2 from "../../images/common/post-img-3.png";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
function PostDetail(id) {
  return (
    <div id="postDetail" className="p-3">
      <div className="d-flex align-items-center mb-2">
        <img src={avatar} alt="profile" className="profile" />
        <div className="ms-2">
          <h6 className="mb-0">Luna Verse</h6>
          <p className="mb-0">20 Jan 2024</p>
        </div>
      </div>
      <img src={img1} alt="" className="w-100 my-3" />
      <p className="fs-4 fw-bold">Lorem ipsum dolor sit amet consectetur. </p>
      <p>
        Dignissim dui amet elementum commodo dictumst fermentum. Orci auctor
        imperdiet ultrices netus ullamcorper sapien aliquet purus enim. Bibendum
        aliquam eu luctus dignissim porttitor mattis rhoncus. Venenatis
        tristique integer dolor venenatis at in. Ultricies rhoncus eget
        scelerisque nec consectetur consequat purus at. Varius sem eu pulvinar
        parturient nunc tellus. Duis id ut etiam ac. Ut vel amet amet sit.
        Malesuada est nisi dignissim in etiam adipiscing. Lacus diam ultrices
        interdum faucibus quam cursus sit. Morbi ac interdum elementum iaculis
        est ornare placerat nunc arcu. Dui bibendum odio id elementum quis ut
        quis porttitor eget. Suspendisse tortor donec vestibulum odio nulla.
        Odio est nec etiam vivamus amet. Arcu id odio vestibulum est vitae.
        Cursus eleifend tortor arcu diam facilisi facilisis vel ut. Et
        suspendisse venenatis tincidunt nunc pellentesque massa nam ullamcorper
        cras. Sit molestie sapien interdum nunc amet pretium convallis ornare.
        Felis libero varius maecenas tellus ultricies fermentum purus amet.
        Viverra dui tincidunt et sapien pulvinar quis. Tempor aliquam tempus
        magnis ut vel morbi tellus eros. Semper egestas suspendisse quis eget
        tempus condimentum. Erat in non nulla varius porttitor eros. Fermentum
        morbi aliquet sed a id feugiat feugiat. Adipiscing viverra nullam risus
        non metus netus a. Adipiscing pellentesque cursus in scelerisque id
        risus euismod commodo. Arcu cursus aliquam tincidunt sed lectus id. Amet
        amet amet aliquet id nulla a aenean ut. Massa orci nunc ultrices
        maecenas vulputate ut. Tincidunt felis accumsan semper luctus vivamus mi
        commodo in. Iaculis quis vivamus est malesuada neque mi sagittis.
        Praesent risus enim ullamcorper vestibulum odio volutpat adipiscing.
        Felis nulla vulputate justo tortor est. Gravida bibendum molestie eu
        fringilla lectus. Dignissim faucibus massa dis quis. Neque feugiat
        adipiscing ipsum pulvinar at eget ut. Cursus libero tristique quam
        commodo lectus eget a praesent malesuada. Nulla sed bibendum donec
        tellus urna porttitor. Elementum dictumst faucibus quis vestibulum vitae
        blandit tincidunt. Id quam sollicitudin in egestas nec et. Vitae
        eleifend integer quam consequat aliquet ipsum id. Nunc elit tortor
        convallis aliquet id. Est convallis elit urna habitant tellus viverra
        scelerisque tristique placerat. Orci sollicitudin non cursus erat
        facilisis lacus. Interdum ut dui sapien et massa suspendisse lacus. Nec
        cras vestibulum at quisque nisi quam. Aliquam sit viverra sit vulputate.
        Sed posuere posuere diam nec in. Arcu at vulputate elit sed amet diam.
      </p>
      <img src={img2} alt="" className="w-100 my-3" />
      <p>
        Dignissim dui amet elementum commodo dictumst fermentum. Orci auctor
        imperdiet ultrices netus ullamcorper sapien aliquet purus enim. Bibendum
        aliquam eu luctus dignissim porttitor mattis rhoncus. Venenatis
        tristique integer dolor venenatis at in. Ultricies rhoncus eget
        scelerisque nec consectetur consequat purus at. Varius sem eu pulvinar
        parturient nunc tellus. Duis id ut etiam ac. Ut vel amet amet sit.
        Malesuada est nisi dignissim in etiam adipiscing. Lacus diam ultrices
        interdum faucibus quam cursus sit. Morbi ac interdum elementum iaculis
        est ornare placerat nunc arcu. Dui bibendum odio id elementum quis ut
        quis porttitor eget. Suspendisse tortor donec vestibulum odio nulla.
        Odio est nec etiam vivamus amet. Arcu id odio vestibulum est vitae.
        Cursus eleifend tortor arcu diam facilisi facilisis vel ut. Et
        suspendisse venenatis tincidunt nunc pellentesque massa nam ullamcorper
        cras. Sit molestie sapien interdum nunc amet pretium convallis ornare.
        Felis libero varius maecenas tellus ultricies fermentum purus amet.
        Viverra dui tincidunt et sapien pulvinar quis. Tempor aliquam tempus
        magnis ut vel morbi tellus eros. Semper egestas suspendisse quis eget
        tempus condimentum. Erat in non nulla varius porttitor eros. Fermentum
        morbi aliquet sed a id feugiat feugiat. Adipiscing viverra nullam risus
        non metus netus a. Adipiscing pellentesque cursus in scelerisque id
        risus euismod commodo. Arcu cursus aliquam tincidunt sed lectus id. Amet
        amet amet aliquet id nulla a aenean ut. Massa orci nunc ultrices
        maecenas vulputate ut. Tincidunt felis accumsan semper luctus vivamus mi
        commodo in. Iaculis quis vivamus est malesuada neque mi sagittis.
        Praesent risus enim ullamcorper vestibulum odio volutpat adipiscing.
        Felis nulla vulputate justo tortor est. Gravida bibendum molestie eu
        fringilla lectus. Dignissim faucibus massa dis quis. Neque feugiat
        adipiscing ipsum pulvinar at eget ut. Cursus libero tristique quam
        commodo lectus eget a praesent malesuada. Nulla sed bibendum donec
        tellus urna porttitor. Elementum dictumst faucibus quis vestibulum vitae
        blandit tincidunt. Id quam sollicitudin in egestas nec et. Vitae
        eleifend integer quam consequat aliquet ipsum id. Nunc elit tortor
        convallis aliquet id. Est convallis elit urna habitant tellus viverra
        scelerisque tristique placerat. Orci sollicitudin non cursus erat
        facilisis lacus. Interdum ut dui sapien et massa suspendisse lacus. Nec
        cras vestibulum at quisque nisi quam. Aliquam sit viverra sit vulputate.
        Sed posuere posuere diam nec in. Arcu at vulputate elit sed amet diam.
      </p>
      <div className="d-flex align-items-center border-bottom pb-3 mt-2 border-dark">
        <div className="d-flex align-items-center me-3">
          <FiEye className="me-2" /> 12
        </div>
        <div className="d-flex align-items-center me-3">
          <BsChat className="me-2" /> 123
        </div>
        <div
          className="d-flex align-items-center me-3"
          // onClick={() => handleReportClick(item.id)}
        >
          <IoFlagOutline />{" "}
        </div>
      </div>
      <p className="cmt fw-bold my-3">COMMENT</p>
      <div className="cmt-input d-flex ">
        <img src={avatar} alt="" className="profile" />
        <input
          type="text"
          className="w-100 ps-3"
          placeholder="Type your comment"
        />
      </div>
      <div className="cmt-block"></div>
    </div>
  );
}

export default PostDetail;
