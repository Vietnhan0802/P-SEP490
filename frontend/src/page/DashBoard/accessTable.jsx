import React, { useState, useEffect, useMemo } from "react";
import PaginationComponent from "./paginationComponent";
import useFullPageLoader from "../hooks/useFullPageLoader";
import TableHeaderCus from "./tableHeaderCus";
import DbSearch from "./dbSearch";

const AccessTable = () => {
  const [comments, setComments] = useState([]);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const thContent = [
    { name: "UserName", field: "id" },
    { name: "Type", field: "name" },
    { name: "Describe", field: "email" },
    { name: "Action", field: "body" },
  ];

  useEffect(() => {
    const getData = () => {
      showLoader();

      fetch("https://jsonplaceholder.typicode.com/comments")
        .then((response) => response.json())
        .then((json) => {
          hideLoader();
          setComments(json);
        });
    };

    getData();
  }, []);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    return computedComments;
  }, [comments]);

  return (
    <>
      <div className="row w-100">
        <div className="col mb-3 col-12 text-center">
          <div className="row">
            <div className="col-md-6">
              <PaginationComponent />
            </div>
            <div className="col-md-6 d-flex flex-row-reverse">
              <DbSearch />
            </div>
          </div>

          <table className="table table-striped">
            <TableHeaderCus thContent={thContent} />
            <tbody>
              {commentsData.map((comments) => (
                <tr>
                  <th scope="row" key={comments.id}>
                    {comments.id}
                  </th>
                  <td>{comments.name}</td>
                  <td>{comments.email}</td>
                  <td>{comments.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {loader}
    </>
  );
};
export default AccessTable;
