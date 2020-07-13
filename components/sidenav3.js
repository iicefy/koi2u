import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "react-spinners/PulseLoader";

export default function SideNav3({ description }) {
  const dispatch = useDispatch();
  const SETBOOKING_REFRESH = "SETBOOKING_REFRESH";
  const isLogin = useSelector((state) => state.user.isLogin);
  const token = useSelector((state) => state.user.token);
  const farmData = useSelector((state) => state.user.farm);
  const [serviceList1, setServiceList1] = useState();
  const [serviceList2, setServiceList2] = useState();
  const [isLoaded1, setIsLoaded1] = useState(false);
  const [isLoaded2, setIsLoaded2] = useState(false);
  const [isValue, setIsValue] = useState(false);
  const [selectedListData, setSelectedListData] = useState([]);
  const [selectedListDataID, setSelectedListDataID] = useState([]);
  const [valueResult, setValueResult] = useState();
  const [valueResultID, setValueResultID] = useState();

  const [selectFarmText, setselectFarmText] = useState("Farm");
  const [selectFarmValue, setselectFarmValue] = useState("");
  const [selectPondText, setselectPondText] = useState("Pond");
  const [selectPondValue, setselectPondValue] = useState("");
  const [DataPond, setDataPond] = useState();
  const [isPondLoaded, setIsPondLoaded] = useState(false);

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
      // setDataPond(result.data.pond_list);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataServiceList1 = async () => {
    let url = `http://localhost:8080/api/v1/service/service-list-customer`;
    let Authorization = token;
    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          type_id: 1,
        },
      });
      setServiceList1(result.data.serviceList);
      // console.log(result.data.serviceList);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataServiceList2 = async () => {
    let url = `http://localhost:8080/api/v1/service/service-list-customer`;
    let Authorization = token;
    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          type_id: 11,
        },
      });
      setServiceList2(result.data.serviceList);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataCreateBooking = async () => {
    console.log("valueResultID");
    console.log(valueResultID);
    console.log("description");
    console.log(description);
    console.log("selectPondValue");
    console.log(selectPondValue);
    let url = `http://localhost:8080/api/v1/booking/create-by-customer`;
    let Authorization = token;
    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          service: valueResultID,
          description: description,
          fishpond_id: selectPondValue,
        },
      }).then(() => {
        dispatch({
          type: SETBOOKING_REFRESH,
          isBookingRefresh: true,
        });
        toggle();
        console.log(result);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setIsLoaded1(false);
    fetchDataServiceList1().then(() => setIsLoaded1(true));
    return () => {};
  }, []);
  useEffect(() => {
    setIsLoaded2(false);
    fetchDataServiceList2().then(() => setIsLoaded2(true));
    return () => {};
  }, []);

  const RenderSelectedService = (props) => {
    const ServiceData = props.list;
    const listItems = ServiceData.map((data) => (
      <ServiceSelectList key={data.id} data={data} />
    ));
    return <div className="serviceList">{listItems}</div>;
  };

  const ServiceSelectList = ({ data }) => {
    return (
      <div className="serviceBox">
        <div>{data.name}</div>
      </div>
    );
  };

  const RenderListService1 = (props) => {
    const ServiceData = props.list;
    // console.log(ServiceData);
    const listItems = ServiceData.map((data) => (
      <ServiceList key={data.id} data={data} />
    ));
    return <div className="serviceList">{listItems}</div>;
  };

  const ServiceList = ({ data }) => {
    return (
      <div className="serviceBox">
        <div>{data.name}</div>
        <div
          className="addPush"
          onClick={() => {
            selectedListData.push(data);
            selectedListDataID.push(data.id);
            // console.log(selectedListData);
            const convertToSet = new Set(selectedListData);
            const convertToSetID = new Set(selectedListDataID);

            const convertToArray = [...convertToSet];
            const convertToArrayID = [...convertToSetID];

            // console.log(convertToArray);
            setValueResult(convertToArray);
            setValueResultID(convertToArrayID);
            // console.log(valueResult);
            setIsValue(true);

            // console.log(description);

            // setIsValue(true);
            // const y = new Set(selectedListData);
            // const z = [...y];
            // console.log(z);
          }}
        >
          Add
        </div>
      </div>
    );
  };

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);
    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  useDidMountEffect(() => {
    fetchPondList().then(() => {
      setIsPondLoaded(true);
      setselectPondText("Select");
    });
    return () => {};
  }, [selectFarmValue]);

  useDidMountEffect(() => {
    setSelectedListData(convertToArray);
    return () => {};
  }, [selectedListData]);

  useDidMountEffect(() => {
    setSelectedListDataID(convertToArrayID);
    return () => {};
  }, [selectedListDataID]);

  useDidMountEffect(() => {
    console.log(valueResultID);
    return () => {};
  }, [valueResultID]);

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
        <div className="headTextDashboard-white">Choose Pond</div>
        <div className="farmHead-row">
          <div className="row">
            <div className="dropDownBox">
              <div className="dropDownContainer">
                <div className="dropDown">{selectFarmText}</div>
                <div className="dropdownContent">
                  <RenderFarmDropDown list={farmData} />
                </div>
              </div>
            </div>
            <div className="dropDownBox">
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
        </div>
        <div className="headTextDashboard-white">Farm Service</div>
        {isLoaded1 ? (
          <RenderListService1 list={serviceList1} />
        ) : (
          <div className="loadingBox">
            <Loader
              size={8}
              margin={2}
              // width={10}
              color={"#fff"}
              loading={true}
            />
          </div>
        )}
        <div className="headTextDashboard-white">IoT Service</div>
        {isLoaded2 ? (
          <RenderListService1 list={serviceList2} />
        ) : (
          <div className="loadingBox">
            <Loader
              size={8}
              margin={2}
              // width={10}
              color={"#fff"}
              loading={true}
            />
          </div>
        )}
        <div className="row">
          <div className="headTextDashboard-white">Choosed</div>
          <div className="dropDownBox">
            <div className="dropDownContainer">
              <div
                className="dropDown"
                onClick={() => {
                  selectedListData.splice(0, 999);
                  selectedListDataID.splice(0, 999);
                  // console.log(selectedListData);
                  const convertToSet = new Set(selectedListData);
                  const convertToSetID = new Set(selectedListDataID);
                  const convertToArray = [...convertToSet];
                  const convertToArrayID = [...convertToSetID];
                  // console.log(convertToArray);
                  // console.log("convertToArray");
                  setValueResult(convertToArray);
                  setValueResultID(convertToArrayID);
                  // console.log("valueResult");
                  // console.log(valueResult);
                  setIsValue(false);
                }}
              >
                Clear
              </div>
            </div>
          </div>
        </div>
        {isValue ? <RenderSelectedService list={valueResult} /> : <div></div>}
        <div className="serviceList">
          <div
            className="createBookingContainer"
            onClick={() => {
              fetchDataCreateBooking();
            }}
          >
            Create Booking
          </div>
        </div>
      </div>
    </div>
  );
}
