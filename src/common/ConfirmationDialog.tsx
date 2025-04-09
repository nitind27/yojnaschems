import React from 'react';
import { confirmable } from 'react-confirm';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationDialog = ({ show, proceed, confirmation }: any) => {
    if (!show) return null; // Return null if not shown

    return (
        <div className="modal show" style={{ display: 'block', zIndex: 9999 }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirmation</h5>
                        <span
                            // type="button"
                            className="close position-absolute"
                            style={{ top: '13px', right: '15px', fontSize: '25px', cursor: "pointer" }}
                            onClick={() => proceed(false)}
                        >
                            <span>&times;</span>
                        </span>
                    </div>
                    <div className="modal-body">
                        <p style={{ fontSize: "15px" }}>{confirmation}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => proceed(false)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={() => proceed(true)}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default confirmable(ConfirmationDialog);