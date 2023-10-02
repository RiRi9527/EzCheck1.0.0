import React, { useState } from "react";

const Table = ({ userShow, handleAdminChange, handleClean }) => {
  // const userShow = {
  //   id: 0,
  //   username: "Hao",
  //   schedule: {
  //     "2023-9-5": [
  //       {
  //         checkIn: "8:55",
  //         checkOut: "12:05",
  //         checkedIn: false, // Add this property
  //       },
  //       {
  //         checkIn: "12:10",
  //         checkOut: "17:04",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-6": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-7": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-8": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-11": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-12": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-13": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-14": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //     "2023-9-15": [
  //       {
  //         checkIn: "9:05",
  //         checkOut: "17:05",
  //         checkedIn: false, // Add this property
  //       },
  //     ],
  //   },
  // };
  const [payCheck, setPayCheck] = useState("");
  const [visible, setVisible] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [adminChange, setAdminChange] = useState({
    id: "",
    date: "",
    checkIn: "",
    checkOut: "",
  });

  const [password, setPassword] = useState("");
  const [adminVisible, setAdminVisible] = useState(false);

  const adminPassword = "2366298";

  const handlePayCheckChange = (e) => {
    setPayCheck(e.target.value);
  };

  const handleVisible = (e) => {
    e.preventDefault();
    setVisible(!visible);
  };

  const handleAdminChangePlus = (e) => {
    e.preventDefault();
    handleAdminChange(
      adminChange.id - 1,
      adminChange.date,
      adminChange.checkIn,
      adminChange.checkOut
    );
  };

  const handleAdminVisible = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setPassword(""), setAdminVisible(!adminVisible), setAdmin(!admin);
    } else {
      alert("密码错误");
    }
  };

  function calculateWorkHours(userShow) {
    const workHours = {};
    if (userShow && userShow.schedule) {
      for (const date in userShow.schedule) {
        const shifts = userShow.schedule[date];
        let totalWorkHours = 0;

        for (const shift of shifts) {
          const [checkInHour, checkInMinute] = shift.checkIn
            .split(":")
            .map(Number);
          const [checkOutHour, checkOutMinute] = shift.checkOut
            .split(":")
            .map(Number);

          const checkInTime = checkInHour * 60 + checkInMinute;
          const checkOutTime = checkOutHour * 60 + checkOutMinute;

          const workDuration = checkOutTime - checkInTime;

          totalWorkHours += workDuration;
        }

        workHours[date] = totalWorkHours / 60; // Convert minutes to hours
      }
      return workHours;
    }
  }
  const workHours = calculateWorkHours(userShow);

  function totalWorkHoursForDays(workHours) {
    let totalWorkHoursForDays = "";
    if (workHours) {
      totalWorkHoursForDays = Object.values(workHours).reduce(
        (acc, curr) => acc + curr,
        0
      );
    }

    return totalWorkHoursForDays;
  }

  const totalWorkHoursForDaysValue = totalWorkHoursForDays(workHours);

  return (
    <>
      {userShow && (
        <div className="box table">
          <h1>{userShow.username}</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {userShow.schedule &&
                Object.entries(userShow.schedule).map(([date, appointments]) =>
                  appointments.map((appointment, index) => (
                    <tr key={`${date}-${index}`}>
                      {index === 0 ? (
                        <td rowSpan={appointments.length}>{date}</td>
                      ) : null}
                      <td>{appointment.checkIn}</td>
                      <td>{appointment.checkOut}</td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
          <div className="bottom">
            <h3>
              Total Hours:{" "}
              {totalWorkHoursForDaysValue
                ? totalWorkHoursForDaysValue.toFixed(2)
                : 0}{" "}
              hr
            </h3>
            <h3>
              Total Paycheck: $
              {!visible ? (
                <span>{payCheck}</span>
              ) : (
                <form
                  onSubmit={handleVisible}
                  style={{ display: "inline-block" }}
                >
                  <input
                    type="text"
                    value={payCheck}
                    placeholder="xxxx.xx"
                    style={{
                      width: "80px",
                      fontSize: "20px",
                      borderRadius: " 5px",
                    }}
                    onChange={handlePayCheckChange}
                  />
                </form>
              )}
            </h3>
          </div>
          <div className="print">
            <button
              onClick={() => {
                window.print();
                handleClean();
              }}
            >
              Print
            </button>
          </div>
          <div className="admin">
            <button onClick={() => setAdmin(!admin)}>Admi</button>
          </div>
          {admin ? (
            <div className="password">
              <form onSubmit={handleAdminVisible}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button>Submit</button>
              </form>
            </div>
          ) : (
            ""
          )}

          {adminVisible ? (
            <div className="admin-page">
              <form onSubmit={handleAdminChangePlus}>
                <input
                  type="text"
                  required
                  placeholder="id"
                  value={adminChange.id}
                  onChange={(e) =>
                    setAdminChange({ ...adminChange, id: e.target.value })
                  }
                />
                <input
                  type="text"
                  required
                  placeholder="2023-1-1"
                  value={adminChange.date}
                  onChange={(e) =>
                    setAdminChange({ ...adminChange, date: e.target.value })
                  }
                />
                <input
                  type="text"
                  required
                  placeholder="9:00"
                  value={adminChange.checkIn}
                  onChange={(e) =>
                    setAdminChange({ ...adminChange, checkIn: e.target.value })
                  }
                />
                <input
                  type="text"
                  required
                  placeholder="17:00"
                  value={adminChange.checkOut}
                  onChange={(e) =>
                    setAdminChange({ ...adminChange, checkOut: e.target.value })
                  }
                />
                <button>Submit</button>
                <button onClick={() => setAdminVisible(false)}>All Done</button>
              </form>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Table;
