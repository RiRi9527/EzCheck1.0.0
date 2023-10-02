import React from "react";
import { Link } from "react-router-dom";

const Check = ({ userData, handleCheckIn, handleCheckOut }) => {
  const handleCheckInPlus = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // 月份是从0开始的，所以要加1
    let day = currentDate.getDate();

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    let dateStr = year + "-" + month + "-" + day;
    let timeStr = hours + ":" + minutes;

    handleCheckIn(userData, dateStr, timeStr);
  };

  const handleCheckOutPlus = () => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // 月份是从0开始的，所以要加1
    let day = currentDate.getDate();

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    let dateStr = year + "-" + month + "-" + day;
    let timeStr = hours + ":" + minutes;

    handleCheckOut(userData, dateStr, timeStr);
  };

  return (
    <div className="box check">
      <h1>{userData}</h1>
      <h5>Paul Lee Agency, Inc.</h5>
      <div>
        <button onClick={handleCheckInPlus}>Check In</button>
        <button onClick={handleCheckOutPlus}>Check Out</button>
      </div>
      <div>
        <button>
          <Link to="/table">VIEW</Link>
        </button>
      </div>
    </div>
  );
};

export default Check;
