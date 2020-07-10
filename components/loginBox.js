import React, { useState } from "react";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "react-spinners/PulseLoader";

export default function LoginBox() {
  const dispatch = useDispatch();
  const AUTHEN = "AUTHEN";

  const fetchDataLogin = async () => {
    setIsLoaded(true);
    try {
      const result = await axios({
        method: "post",
        url: "http://localhost:8080/api/v1/customer/login",
        data: {
          username: userName,
          password: password,
        },
      });
      console.log(result.data.Authorization);
      dispatch({
        type: AUTHEN,
        authen: true,
        token: result.data.Authorization,
      });
      setIsLoaded(false);
      Router.push({
        pathname: "/dashboard",
      });
    } catch (err) {
      console.log(err.message);
      setIsLoaded(false);
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="loginBox">
      <div className="loginText">
        <p>Sign in</p>
      </div>

      <p className="label">username</p>
      <input
        className="inputlogin"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <p className="label">password</p>
      <input
        type="password"
        className="inputlogin"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="btnBox">
        <a href="#forgot" className="forgot">
          Forgot Password ?
        </a>
        <button
          className="btnLogin"
          onClick={() => {
            fetchDataLogin();
          }}
        >
          {isLoaded ? (
            <div className="loadingBox">
              <Loader
                size={8}
                margin={2}
                // width={10}
                color={"#fff"}
                loading={true}
              />
            </div>
          ) : (
            "Enter"
          )}
        </button>
      </div>
    </div>
  );
}
