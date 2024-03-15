import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./popup.scss";
import { IoFlagOutline } from "react-icons/io5";
function BlogReport() {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const modelSubmit = (event) => {
    event.preventDefault();
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return; // Ngăn form không được submit nếu không có option nào được chọn
    }
    alert(`Report submitted for: ${selectedOption}`);
    modalClose();
  };

  return (
    <div className="p-1">
      <IoFlagOutline onClick={modalShow} className="ReportBtn" />

      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Content</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup" id="post-report-body">
          <div className="option hateAndHarassment">
            <input
              type="radio"
              id="hateAndHarassment"
              name="reportType"
              value="hateAndHarassment"
              onChange={handleChange}
              checked={selectedOption === "hateAndHarassment"}
            />
            <label htmlFor="hateAndHarassment">Thù ghét và quấy rối</label>
            {selectedOption === "hateAndHarassment" && (
              <p>
                *Chúng tôi không cho phép đăng nội dung:
                <br />
                ** Hành vi lăng mạ hoặc đe dọa người khác, bao gồm việc sử dụng
                lời lẽ tục tĩu để hạ bệ họ
                <br />
                ** Đe dọa thực hiện những hành vi như thu thập thông tin, tống
                tiền, tiết lộ
              </p>
            )}
          </div>

          {/* Repeat the div for each option, adjusting the className, id, value, and label as needed. 
             You can style each option individually using the className. */}

          <div className="option shockingContent">
            <input
              type="radio"
              id="shockingContent"
              name="reportType"
              value="shockingContent"
              onChange={handleChange}
              checked={selectedOption === "shockingContent"}
            />
            <label htmlFor="shockingContent">
              Nội dung gây sốc và phản cảm
            </label>
            {selectedOption === "shockingContent" && (
              <p>
                *Chúng tôi không cho phép đăng nội dung:
                <br />
                ** Hình ảnh tử vong, tai nạn
                <br />
                ** Bộ phận cơ thể người hoặc động vật bị cắt xẻ, hủy hoại, đốt
                hoặc bị thương nghiêm trọng
              </p>
            )}
          </div>

          <div className="option misinformation">
            <input
              type="radio"
              id="misinformation"
              name="reportType"
              value="misinformation"
              onChange={handleChange}
              checked={selectedOption === "misinformation"}
            />
            <label htmlFor="misinformation">Thông tin sai lệch</label>
            {selectedOption === "misinformation" && (
              <p>
                *Chúng tôi không cho phép đăng nội dung:
                <br />
                ** Thông tin sai lệnh gây ra nguy hiểm cho cộng đồng hoặc gây ra
                hoảng loạn
                <br />
                ** Ấm mưu cổ xúy bạo lực, lòng thù hận hoặc nhắm đến cá nhân
              </p>
            )}
          </div>
          <div className="option fraudAndScam">
            <input
              type="radio"
              id="fraudAndScam"
              name="reportType"
              value="fraudAndScam"
              onChange={handleChange}
              checked={selectedOption === "fraudAndScam"}
            />
            <label htmlFor="fraudAndScam">Gian lận và lừa đảo</label>
            {selectedOption === "fraudAndScam" && (
              <p>
                *Chúng tôi không cho phép đăng nội dung:
                <br />
                ** Lừa đảo tài chính, tuyển dụng hoặc lừa đảo giả mạo bao gồm
                trộm cắp danh tính
                <br />
                ** Thông đồng hoặc hỗ trợ lừa đảo hoặc hướng dẫn cách lừa đảo
              </p>
            )}
          </div>
          <div className="option others">
            <input
              type="radio"
              id="others"
              name="reportType"
              value="others"
              onChange={handleChange}
              checked={selectedOption === "others"}
            />
            <label htmlFor="others">Khác</label>
            {selectedOption === "others" && (
              <p>
                *Ưu tiên của chúng tôi là cung cấp một môi trường an toàn.
                Khuyến khích loại bỏ nội dung và tài khoản lừa đảo. Hãy chọn mục
                này nếu báo cáo của bạn không thuộc bất cứ danh mục nào.
              </p>
            )}
          </div>
          {/* Continue for other options... */}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default BlogReport;
