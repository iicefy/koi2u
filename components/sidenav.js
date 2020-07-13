import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import axios from "axios";
import Loader from "react-spinners/PulseLoader";

export default function SideNav() {
  //variable
  const AUTHEN = "AUTHEN";
  const FARM_SELECT = "FARM_SELECT";
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const farmData = useSelector((state) => state.user.farm);
  const selectFarm = useSelector((state) => state.user.selectFarm);
  const isFarmLoaded = useSelector((state) => state.user.isFarmLoaded);

  //render function
  const RenderCard = (props) => {
    const farmData = props.farmData;
    const listItems = farmData.map((data) => (
      <FarmCard key={data.farm_id} farm={data} />
    ));

    return <div>{listItems}</div>;
  };

  //CardRender
  const FarmCard = ({ farm }) => {
    const setSelectFarm = () => {
      dispatch({
        type: FARM_SELECT,
        selectFarm: farm.farm_id,
      });
    };

    return (
      <div className="farmBox">
        <div className="farmHead">
          <div className="farmName">{farm.farm_name}</div>
          <div className="farmPond">Pond {farm.pond_count}</div>
        </div>
        <div className="farmBtn">
          <button className="btnLogin" onClick={setSelectFarm}>
            Data
          </button>
        </div>
      </div>
    );
  };

  //UserMenu
  const signOut = () => {
    dispatch({
      type: AUTHEN,
      isLogin: false,
      token: "",
    });
    Router.push({
      pathname: "/login",
    });
  };

  //checkLogin
  const Login = () => {
    return (
      <div>
        {isLogin ? (
          <div className="dropdown">
            <a href="#" className="name">
              John Dou
            </a>
            <div className="dropdown-content">
              <a href="#">Profile Setting</a>
              <a href="#" onClick={signOut}>
                Sign Out
              </a>
            </div>
          </div>
        ) : (
          <div className="authen">
            <Link href="/login">
              <a className="authenbtn">Sign in</a>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sideContainer">
      <div className="sidenav">
        <div className="logo">
          <img
            src="/assets/logos/logo-trans.png"
            style={{ width: "110px", height: "43px" }}
          />
          <div className="logoText">Koi2u</div>
        </div>

        <div className="sidemenu">
          <Link href="/dashboard">
            <a className="menubtn">Dashboard</a>
          </Link>
          <Link href="/note">
            <a className="menubtn">Factor Note</a>
          </Link>
          <Link href="/farmservice">
            <a className="menubtn">Farm Service</a>
          </Link>
          <a
            className="menubtn"
            href="https://www.koi2u.com/%e0%b8%aa%e0%b8%b4%e0%b8%99%e0%b8%84%e0%b9%89%e0%b8%b2/"
            target="_blank"
          >
            Product
          </a>
          <a
            className="menubtn"
            href="https://www.koi2u.com/%e0%b8%95%e0%b8%b4%e0%b8%94%e0%b8%95%e0%b9%88%e0%b8%ad%e0%b9%80%e0%b8%a3%e0%b8%b2/"
            target="_blank"
          >
            Contact
          </a>
        </div>
        <div className="sideUser">
          <Login />
        </div>
      </div>

      <div className="sideBar">
        <div className="headTextDashboard-white">Your Farm</div>
        {isFarmLoaded ? (
          <RenderCard farmData={farmData} />
        ) : (
          <div className="loadingBoxWithMarginTop">
            <Loader
              size={8}
              margin={2}
              // width={10}
              color={"#fff"}
              loading={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
