import React from "react";
import "./projectApplication.scss";
import avatar from "../../images/common/Avatar.png";

const requests = [
  {
    name: "Olivia Rhye",
    email: "olivia@untitledui.com",
    avatar: "path-to-olivia-avatar.jpg",
    date: "21 Jan 2024",
    project: "Lack of relevant and substantial information.",
  },
  // Thêm các yêu cầu khác tại đây
];

function ProjectApplication() {
  return (
    <div id="project_application ">
      <div className="block p-2 bg-white border-8">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Date</th>
              <th>Project</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={avatar}
                      className="rounded-circle me-2"
                      alt={request.name}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                      <h2 className="size-16 SFU-bold mb-0">{request.name}</h2>
                      <p className="text-gray-600 SFU-reg text-muted">
                        {request.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{request.date}</td>
                <td className="size-16 SFU-bold">{request.project}</td>
                <td>
                  <button className="btn btn-outline-success btn-sm me-2">
                    Accept
                  </button>
                  <button className="btn btn-outline-danger btn-sm me-2">
                    Reject
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
           {requests.map((request, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={avatar}
                      className="rounded-circle me-2"
                      alt={request.name}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                      <h2 className="size-16 SFU-bold mb-0">{request.name}</h2>
                      <p className="text-gray-600 SFU-reg text-muted">
                        {request.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{request.date}</td>
                <td className="size-16 SFU-bold">{request.project}</td>
                <td>
                  <button className="btn btn-outline-success btn-sm me-2">
                    Accept
                  </button>
                  <button className="btn btn-outline-danger btn-sm me-2">
                    Reject
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {requests.map((request, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={avatar}
                      className="rounded-circle me-2"
                      alt={request.name}
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div>
                      <h2 className="size-16 SFU-bold mb-0">{request.name}</h2>
                      <p className="text-gray-600 SFU-reg text-muted">
                        {request.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>{request.date}</td>
                <td className="size-16 SFU-bold">{request.project}</td>
                <td>
                  <button className="btn btn-outline-success btn-sm me-2">
                    Accept
                  </button>
                  <button className="btn btn-outline-danger btn-sm me-2">
                    Reject
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectApplication;
