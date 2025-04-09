import React from "react";

const Nofound = () => {
  return (
    <div>
      <div className="p-7">
        <div
          className="alert alert-dismissible bg-light-danger border border-dashed border-danger d-flex flex-column flex-sm-row p-5 fw-bold text-gray-600"
          id="booking_chart_error"
        >
          <i className="ki-duotone ki-search-list fs-2hx text-danger me-4 mb-5 mb-sm-0">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>

          <div className="d-flex flex-column pe-0 pe-sm-10">
            <h5 className="mb-1">Record Not Found</h5>
            <span className="alert_msg">
              There are no bookings for this period.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nofound;
