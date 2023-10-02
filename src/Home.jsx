import React, { useState } from "react";

const Home = ({ handleSignUp, handleSignIn }) => {
  const [userName, setUserName] = useState("");

  const handleUseName = (e) => {
    setUserName(e.target.value);
  };

  const handleSignUpPlus = (e) => {
    e.preventDefault();
    handleSignUp(userName);
  };

  const handleSignInPlus = (e) => {
    e.preventDefault();
    handleSignIn(userName);
  };

  return (
    <div className="box home">
      <h1>Easy Check</h1>
      <h5>Paul Lee Agency, Inc.</h5>
      <form onSubmit={handleSignInPlus}>
        <div>
          <label htmlFor="username">Name:</label>
          <br />
          <input
            type="text"
            name="username"
            id="username"
            value={userName}
            onChange={handleUseName}
          />
        </div>
        <div>
          <button className="sign_in" onClick={handleSignInPlus}>
            Sign in
          </button>
        </div>
        <div>
          <button className="sign_out" onClick={handleSignUpPlus}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
