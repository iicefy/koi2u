import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Router from "next/router";

import { useDispatch } from "react-redux";
import axios from "axios";
import Loader from "react-spinners/PulseLoader";

export default function SideNav2() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);
  const FACTOR = "FACTOR";
  const ISFACTORLOADED_INNOTE = "ISFACTORLOADED_INNOTE";
  const token = useSelector((state) => state.user.token);
  const factorData = useSelector((state) => state.user.factorList);
  const farmData = useSelector((state) => state.user.farm);
  const isFactorLoaded = useSelector((state) => state.user.isFactorLoaded);
  const [isLoaded, setisLoaded] = useState(false);
  const [selectFarm, setselectFarm] = useState();
  const [selectFactor, setSelectFactor] = useState(false);

  const fetchDataFactor = async () => {
    let url = `http://localhost:8080/api/v1/factor/lists-by-customer`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "get",
        url,
        headers: {
          Authorization,
        },
      });
      dispatch({
        type: FACTOR,
        factorList: result.data.specielist,
      });
      dispatch({
        type: ISFACTORLOADED_INNOTE,
        isFactorLoaded: true,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const RenderFactor = (props) => {
    const factorData = props.factorData;
    const listItems = factorData.map((data) => (
      <FactorCard key={data.factor_id} list={data} />
    ));
    return <div>{listItems}</div>;
  };

  const FactorCard = ({ list }) => {
    const [selectFarmText, setselectFarmText] = useState("Select");
    const [selectFarmValue, setselectFarmValue] = useState("");
    const [selectPondText, setselectPondText] = useState("Select");
    const [selectPondValue, setselectPondValue] = useState("");
    const [DataPond, setDataPond] = useState();
    const [isPondLoaded, setIsPondLoaded] = useState(false);
    const [factorText, setFactorText] = useState("");

    // this func to useEffect not initial render
    const useDidMountEffect = (func, deps) => {
      const didMount = useRef(false);

      useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
      }, deps);
    };

    const RenderFarmDropDown = (props) => {
      const farmData = props.list;
      const listItems = farmData.map((data) => (
        <DropDownFarmContent key={data.farm_id} farm={data} />
      ));

      return <div className="dropdownContent">{listItems}</div>;
    };

    const DropDownFarmContent = ({ farm }) => {
      return (
        <div
          className="dropdownList"
          onClick={() => {
            setselectFarmText(farm.farm_name);
            setselectFarmValue(farm.farm_id);
            setIsPondLoaded(false);
            setselectPondText("Loading");
          }}
        >
          {farm.farm_name}
        </div>
      );
    };

    const RenderPondDropDown = (props) => {
      const farmData = props.list;
      const listItems = farmData.map((data) => (
        <DropDownPondContent key={data.fishpond_id} pond={data} />
      ));

      return <div className="dropdownContent">{listItems}</div>;
    };

    const DropDownPondContent = ({ pond }) => {
      return (
        <div
          className="dropdownList"
          onClick={() => {
            setselectPondText(pond.fishpond_name);
            setselectPondValue(pond.fishpond_id);
            // console.log(pond.fishpond_id);
          }}
        >
          {pond.fishpond_name}
        </div>
      );
    };

    //fetchDatafarm
    const fetchPondList = async () => {
      let url = `http://localhost:8080/api/v1/fishpond/lists`;
      let Authorization = token;
      // console.log(selectFarmValue);
      try {
        const result = await axios({
          method: "post",
          url,
          headers: {
            Authorization,
          },
          data: {
            farm_id: selectFarmValue,
          },
        });
        // console.log(result.data.farmlist);
        setDataPond(result.data.farmlist);
      } catch (err) {
        console.log(err.message);
      }
    };

    useDidMountEffect(() => {
      fetchPondList().then(() => {
        setIsPondLoaded(true);
        setselectPondText("Select");
      });
      return () => {};
    }, [selectFarmValue]);

    return (
      <div className="factorBox">
        <div className="farmHead">
          <div className="farmName">{list.factor_facterType}</div>
          <div className="dropDownBox">
            <div>Farm </div>
            <div className="dropDownContainer">
              <div className="dropDown">{selectFarmText}</div>
              <div className="dropdownContent">
                <RenderFarmDropDown list={farmData} />
              </div>
            </div>
          </div>
          <div className="dropDownBox">
            <div>Pond </div>
            <div className="dropDownContainer">
              <div className="dropDown">{selectPondText}</div>
              {isPondLoaded ? (
                <div className="dropdownContent">
                  <RenderPondDropDown list={DataPond} />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <div className="factorBtn">
          <input
            className="inputFactor"
            value={factorText}
            onChange={(e) => {
              setFactorText(e.target.value);
            }}
          ></input>
          <button
            className="btnLogin"
            onClick={() => {
              console.log(selectPondValue);
              console.log(factorText);
              console.log(list.factor_id);
              toggle();
            }}
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  const AUTHEN = "AUTHEN";
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

  const toggleModal = () => {
    const [isShowing, setIsShowing] = useState(false);

    function toggle() {
      setIsShowing(!isShowing);
    }
    return {
      isShowing,
      toggle,
    };
  };

  const { isShowing, toggle } = toggleModal();

  useEffect(() => {
    dispatch({
      type: ISFACTORLOADED_INNOTE,
      isFactorLoaded: false,
    });
    fetchDataFactor();
  }, []);

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
          {/* <Link href="/service">
            <a className="menubtn">Service</a>
          </Link> */}
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
        {isShowing ? (
          <div className="modalContainer">
            <div className="modalBox">
              <div className="modal">
                <div className="modalContent">Booking Created</div>
                <div
                  className="modalBtn"
                  onClick={() => {
                    toggle();
                  }}
                >
                  OK
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="headTextDashboard-white">Your Factor</div>
        {isFactorLoaded ? (
          <RenderFactor factorData={factorData} />
        ) : (
          <Loader
            size={8}
            margin={2}
            // width={10}
            color={"#fff"}
            loading={true}
          />
        )}
      </div>
    </div>
  );
}
