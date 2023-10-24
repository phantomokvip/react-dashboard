import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";

const DeleteModal = ({ show, onDeleteClick, onCloseClick }) => {

    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Enter') {
            if(show && onDeleteClick){
                onDeleteClick()
            }
          }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, onDeleteClick]);
    
    return (
        <Modal isOpen={show} toggle={onCloseClick} centered={true}>
            <ModalBody className="py-3 px-5" >
                <div className="mt-2 text-center">
                    <div className="mt-4 pt-2 fs-15 mx-4">
                        <h4>Bạn có chắc không ?</h4>
                        <p className="text-muted mx-4 mb-0">
                            Bạn có chắc chắn muốn xóa bản ghi này?
                        </p>
                    </div>
                </div>
                <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                    <button
                        type="button"
                        className="btn w-sm btn-light"
                        data-bs-dismiss="modal"
                        onClick={onCloseClick}
                    >
                        Quay lại
                    </button>
                    <button
                        type="button"
                        className="btn w-sm btn-danger "
                        id="delete-record"
                        onClick={onDeleteClick}
                    >
                        Xác nhận
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

DeleteModal.propTypes = {
    onCloseClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    show: PropTypes.any,
};

export default DeleteModal;