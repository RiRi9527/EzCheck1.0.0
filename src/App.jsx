import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./Home";
import Check from "./Check";
import Table from "./Table";
import { Route, Routes, useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "EzCheckData";

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedData) setData(savedData);
    console.log(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const [userData, setUserData] = useState("");
  const navigate = useNavigate();

  const userShow = data.find((user) => user.username === userData);

  const handleSignUp = (username) => {
    // 检查是否存在相同的用户名
    const isUsernameExists = data.some((user) => user.username === username);

    if (isUsernameExists) {
      alert("该用户名已存在，请选择一个不同的用户名。");
      return;
    }

    setData((prevData) => [
      ...prevData,
      {
        id: data.length,
        username: username,
      },
    ]);
    alert("注册成功");
  };

  const handleSignIn = (username) => {
    // 检查用户名是否存在
    const user = data.find((user) => user.username === username);
    if (!user) {
      alert("用户名不存在，请检查输入。");
    } else {
      alert("登入成功！");
      const user = data.find((item) => item.username === username).username;
      setUserData(user);
      navigate("/check");
    }
  };

  const handleCheckIn = (username, date, time) => {
    const newData = data.map((user) => {
      if (user.username === username) {
        if (!user.schedule) {
          user.schedule = {};
        }
        if (!user.schedule[date]) {
          user.schedule[date] = [];
        }
        if (!user.schedule[date].some((entry) => entry.checkedIn)) {
          alert("签到成功");
          user.schedule[date].push({
            checkIn: time,
            checkOut: "",
            checkedIn: true,
          });
          navigate("/table");
        } else {
          alert("你已经签到了");
        }
      }
      return user;
    });
    setData(newData);
  };
  const handleCheckOut = (username, date, time) => {
    const newData = data.map((user) => {
      if (
        user.username === username &&
        user.schedule?.[date]?.length > 0 &&
        user.schedule[date][user.schedule[date].length - 1]?.checkedIn
      ) {
        alert("签退成功");
        navigate("/table");
        const lastIndex = user.schedule[date].length - 1;
        return {
          ...user,
          schedule: {
            ...user.schedule,
            [date]: user.schedule[date].map((entry, index) => {
              if (index === lastIndex) {
                return {
                  ...entry,
                  checkOut: time,
                  checkedIn: false,
                };
              }
              return entry;
            }),
          },
        };
      }
      if (
        user.username === username &&
        user.schedule?.[date]?.length > 0 &&
        !user.schedule[date][user.schedule[date].length - 1]?.checkedIn
      ) {
        alert("你未签到或已签退");
      }
      return user;
    });
    setData(newData);
  };

  const handleAdminChange = (id, date, checkIn, checkOut) => {
    if (
      userShow.schedule[date] &&
      id < userShow.schedule[date].length &&
      id !== -1
    ) {
      // 创建一个新的 userShow 对象以确保不修改原对象
      const updatedUserShow = {
        ...userShow,
        schedule: {
          ...userShow.schedule,
          [date]: [
            ...userShow.schedule[date].slice(0, id), // 复制前面的对象
            {
              ...userShow.schedule[date][id], // 复制第 id 个对象
              checkIn: checkIn, // 更新 checkIn
              checkOut: checkOut, // 更新 checkOut
              checkedIn: false, // 更新 checkedIn
            },
            ...userShow.schedule[date].slice(id + 1), // 保持剩余对象不变
          ],
        },
      };

      // 创建一个新的 data 数组来保存更新后的 userShow
      const newData = data.map((user) =>
        user.username === userShow.username ? updatedUserShow : user
      );
      setData(newData);
    }
    if (id === -1) {
      const updatedUserShow = {
        ...userShow,
        schedule: {
          ...userShow.schedule,
          [date]: [
            {
              checkIn: checkIn,
              checkOut: checkOut,
              checkedIn: false,
            },
          ],
        },
      };

      const newData = data.map((user) =>
        user.username === userShow.username ? updatedUserShow : user
      );

      setData(newData);
    }

    if (id === 99) {
      const updatedSchedule = { ...userShow.schedule };
      delete updatedSchedule[date];

      const updatedUserShow = {
        ...userShow,
        schedule: updatedSchedule,
      };

      const newData = data.map((user) =>
        user.username === userShow.username ? updatedUserShow : user
      );

      setData(newData);
    }
  };

  const handleClean = () => {
    const clearData = { ...userShow, schedule: {} };
    const newData = data.map((user) =>
      user.username === userShow.username ? clearData : user
    );
    setData(newData);
  };

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <Home handleSignUp={handleSignUp} handleSignIn={handleSignIn} />
          }
        />
        <Route
          path="/check"
          element={
            <Check
              userData={userData}
              handleCheckIn={handleCheckIn}
              handleCheckOut={handleCheckOut}
            />
          }
        />
        <Route
          path="/table"
          element={
            <Table
              userShow={userShow}
              handleAdminChange={handleAdminChange}
              handleClean={handleClean}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
