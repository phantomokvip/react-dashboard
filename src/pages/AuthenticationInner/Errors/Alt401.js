import React from 'react';
import { Link } from 'react-router-dom';

const Alt401 = () => {
document.title ="Xin lỗi! Bạn không có quyền truy cập.";
    return (
        <>
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <div className="text-center">
                        <lord-icon className="avatar-xl"
                            src="https://cdn.lordicon.com/spxnqpau.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#0ab39c"
                            style={{ width: "120px", height: "120px" }}>
                        </lord-icon>
                        <h1 className="text-primary mb-4">Oops !</h1>
                        <h4 className="text-uppercase">Xin lỗi! Bạn không có quyền truy cập 😭</h4>
                        <p className="text-muted mb-4">Tài khoản phản là admin mới có quyền truy cập!</p>
                        <Link to="/login" className="btn btn-success"><i className="mdi mdi-home me-1"></i>Thoát</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Alt401;