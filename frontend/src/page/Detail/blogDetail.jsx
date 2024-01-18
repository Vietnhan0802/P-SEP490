import React from "react";
import "./detail.scss";
import avatar from "../../images/common/Avatar.png";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import Corey from "../../images/cmt/Corey.png";
import Emerson from "../../images/cmt/Emerson.png";
import Jordyn from "../../images/cmt/Jordyn.png";
import Terry from "../../images/cmt/Terry.png";
import Zaire from "../../images/cmt/Zaire.png";
function BlogDetail(id) {
  const blogContent = [
    {
      id: 1,
      type: "comment",
      img: Corey,
      name: "Corey Septimus",
      content:
        "Lorem ipsum dolor sit amet consectetur. Tortor commodo faucibus scelerisque cursus. Mi interdum ultricies lectus amet viverra aliquet mattis gravida adipiscing. Sit proin non blandit quis euismod dignissim vestibulum pellentesque. Porttitor sem lorem maecenas sit.",
    },
    {
      id: 2,
      type: "comment",
      img: Emerson,
      name: "Emerson Dorwart",
      content:
        "Lorem ipsum dolor sit amet consectetur. Augue sit vitae sem nibh turpis. In facilisi eget fringilla euismod lacus vulputate tellus. Eu nisi neque magna id. Ut bibendum ut mi aliquet malesuada mauris purus vulputate nulla. Etiam leo scelerisque quam ultrices purus odio vitae facilisi neque. Habitant non suspendisse lectus fringilla pulvinar et mattis. Vel orci libero eu malesuada nec eget orci orci senectus. Interdum risus arcu ut vitae tincidunt ut mauris sit.",
    },
    {
      id: 3,
      type: "reply-comment",
      img: Jordyn,
      name: "Jordyn Bergson",
      content:
        "Lorem ipsum dolor sit amet consectetur. Augue sit vitae sem nibh turpis. In facilisi eget fringilla euismod lacus vulputate tellus. Eu nisi neque magna id. Ut bibendum ut mi aliquet malesuada mauris purus vulputate nulla. Etiam leo scelerisque quam ultrices purus odio vitae facilisi neque. Habitant non suspendisse lectus fringilla pulvinar et mattis. Vel orci libero eu malesuada nec eget orci orci senectus. Interdum risus arcu ut vitae tincidunt ut mauris sit.",
    },
    {
      id: 4,
      type: "reply-comment",
      img: Terry,
      name: "Terry Schleifer",
      content:
        "Lorem ipsum dolor sit amet consectetur. Aliquet aliquet senectus urna ornare auctor proin amet.",
    },
    {
      id: 5,
      type: "comment",
      img: Zaire,
      name: "Zaire Workman",
      content:
        "Lorem ipsum dolor sit amet consectetur. Ornare dictumst id lorem faucibus sit quam. Tincidunt penatibus neque varius elit natoque ut. Nulla duis odio et sem in tortor ipsum lobortis.",
    },
  ];
  return (
    <div id="BlogDetail" className="p-3">
      <div className="d-flex align-items-center mb-2">
        <img src={avatar} alt="profile" className="profile" />
        <div className="ms-2">
          <h6 className="mb-0">Luna Verse</h6>
          <p className="mb-0">20 Jan 2024</p>
        </div>
      </div>
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
      <div className="cmt-block">
        {blogContent.map((item) => (
          <div
            className={`d-flex pb-3 mt-2 cmt-item ${
              item.type === "reply-comment" ? "ms-5" : ""
            }`}
          >
            <img src={item.img} alt="" className="profile" />
            <div className="ms-3">
              <h6 className="mb-2 d-flex align-items-center h-40">
                {item.name}
              </h6>
              <p className="mb-0">{item.content}</p>
              <div
                className={`rep d-flex mt-3 fs-bold ${
                  item.type === "reply-comment"
                    ? "justify-content-end"
                    : "justify-content-between"
                }`}
              >
                {item.type !== "reply-comment" ? (
                  <>
                    <div>View comment</div> <div>Reply</div>{" "}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogDetail;
