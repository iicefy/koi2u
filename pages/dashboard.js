import { useState, useEffect, useRef } from "react";
import Router from "next/router";
import Head from "next/head";

import Header from "../components/header";
import PondBox from "../components/pondBox";
import SideNav from "../components/sidenav";
import NoteBox from "../components/noteBox";
import FactorData from "../data/PondData";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import useSWR from "swr";
import Loader from "react-spinners/PulseLoader";

export default function Dashboard() {
  const FARM = "FARM";
  const POND = "POND";
  const FARM_SELECT = "FARM_SELECT";
  const ISFARMLOADED_INNAVBAR = "ISFARMLOADED_INNAVBAR";
  const ISPONDLOADED_INDASHBOARD = "ISPONDLOADED_INDASHBOARD";
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const pondlist = useSelector((state) => state.user.pond);
  const selectedFarm = useSelector((state) => state.user.selectFarm);
  const isPondLoaded = useSelector((state) => state.user.isPondLoaded);
  const [isShowing, setIsShowing] = useState(false);
  const [passingIDFromPondBox, setPassingIDFromPondBox] = useState("");
  const [modalData, setModalData] = useState();
  const [isModalLoaded, setisModalLoaded] = useState(false);
  const [isFactorShowing, setIsFactorShowing] = useState(false);
  const [passingFactorFromPondBox, setPassingFactorFromPondBox] = useState("");
  const [modalDataFactor, setModalDataFactor] = useState();
  const [isModalFactorLoaded, setisModalFactorLoaded] = useState(false);
  const [date, setdate] = useState("7");
  const [FactorName, setFactorName] = useState("");

  const dateList = [
    { date: "7" },
    { date: "14" },
    { date: "30" },
    { date: "60" },
  ];

  const fetchPondList = async () => {
    let url = `http://localhost:8080/api/v1/customer/dashboard-select`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          farm_id: selectedFarm,
        },
      });
      // console.log(result.data.pond_list);

      dispatch({
        type: POND,
        PondData: result.data.pond_list,
      });
      dispatch({
        type: ISPONDLOADED_INDASHBOARD,
        isPondLoaded: true,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFarmList = async () => {
    let url = `http://localhost:8080/api/v1/farm/lists`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "get",
        url,
        headers: {
          Authorization,
        },
      });
      // console.log(result.data);
      dispatch({
        type: FARM,
        FarmData: result.data.farmlist,
      });
      dispatch({
        type: ISFARMLOADED_INNAVBAR,
        isFarmLoaded: true,
      });
      // console.log(result.data.farmlist[0].farm_id);
      dispatch({
        type: FARM_SELECT,
        selectFarm: result.data.farmlist[0].farm_id,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFishData = async () => {
    let url = `http://localhost:8080/api/v1/fishpond/pond-info`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          fishpond_id: passingIDFromPondBox,
        },
      });
      console.log(result.data);
      setModalData(result.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFactorHistory = async () => {
    let url = `http://localhost:8080/api/v1/equipment/select-history-iot`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          list_factor_id: passingFactorFromPondBox,
          date: date,
        },
      });
      console.log(result.data);
      setModalDataFactor(result.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchFarmList();
  }, []);

  useEffect(() => {
    dispatch({
      type: ISPONDLOADED_INDASHBOARD,
      isPondLoaded: false,
    });
    fetchPondList();
  }, [selectedFarm]);

  const RenderFactorHistory = (props) => {
    // console.log(props.list);
    const factorData = props.list;
    const listItems = factorData.map((data, index) => (
      <FactorList list={data} key={index} />
    ));
    return <div>{listItems}</div>;
  };

  const FactorList = ({ list }) => {
    const createDate = new Date(list.equipment_factor_save_date).toLocaleString(
      undefined,
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    return (
      <div>
        <div className="listFacror">
          <div className="rowModal">
            <div className="fishName">{list.factor_facterType}</div>
            <div>{createDate}</div>
          </div>
          <div>Max factor : {list.equipment_factor_max}</div>
          <div>Average factor : {list.equipment_factor_average}</div>
          <div>Min factor : {list.equipment_factor_min}</div>
        </div>
      </div>
    );
  };

  const RenderDateDropDown = (props) => {
    const DateData = props.list;
    const listItems = DateData.map((data) => (
      <DateList key={data.date} date={data} />
    ));
    return <div>{listItems}</div>;
  };

  const DateList = ({ date }) => {
    return (
      <div
        className="dropdownList"
        onClick={() => {
          setdate(date.date);
        }}
      >
        {date.date}
      </div>
    );
  };

  const RenderCard = (props) => {
    const pondData = props.ponds;
    const listItems = pondData.map((pond) => (
      <PondBox
        key={pond.fish_pond_id}
        pondData={pond}
        setModal={setIsShowing}
        pondID={setPassingIDFromPondBox}
        setFactorModal={setIsFactorShowing}
        factorID={setPassingFactorFromPondBox}
        factorName={setFactorName}
      />
    ));
    return <div className="align">{listItems}</div>;
  };

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const RenderFish = (props) => {
    const fishData = props.fish;
    const listItems = fishData.map((data) => (
      <FishList key={data.fish_id} fish={data} />
    ));
    return <div>{listItems}</div>;
  };

  const FishList = ({ fish }) => {
    return (
      <div>
        <div className="listFish">
          <div className="fishName">{fish.fish_specie_fishspecie}</div>
          <div>fish id :{fish.fish_id}</div>
        </div>
      </div>
    );
  };

  const DropdownDate = () => {
    return <div></div>;
  };

  useDidMountEffect(() => {
    setisModalLoaded(false);
    fetchFishData();
    return () => {};
  }, [passingIDFromPondBox]);

  useDidMountEffect(() => {
    setisModalLoaded(true);
  }, [modalData]);

  useDidMountEffect(() => {
    setisModalFactorLoaded(false);
    fetchFactorHistory();
    return () => {};
  }, [passingFactorFromPondBox]);

  useDidMountEffect(() => {
    setisModalFactorLoaded(false);
    fetchFactorHistory();
    return () => {};
  }, [date]);

  useDidMountEffect(() => {
    setisModalFactorLoaded(true);
  }, [modalDataFactor]);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mainApp">
          <div className="page3">
            <SideNav />
          </div>
          <div className="page2">
            {isShowing ? (
              <div className="modalDashboard">
                <div className="modalContentDashboard">
                  <div>
                    {isModalLoaded ? (
                      <div>
                        <div className="modalHead">
                          <div className="rowModal">
                            <div className="headModalDashboard">
                              {modalData.fishponddata.fishpond_name}
                            </div>
                            <div
                              className="close"
                              onClick={() => {
                                setIsShowing(false);
                              }}
                            >
                              Close
                            </div>
                          </div>
                          <div className="descriptionDashboard">
                            {modalData.fishponddata.fishpond_description}
                          </div>
                        </div>
                        <div className="modalFish">
                          <RenderFish fish={modalData.fishlist} />
                        </div>
                      </div>
                    ) : (
                      <Loader
                        size={8}
                        margin={2}
                        // width={10}
                        color={"#444"}
                        loading={true}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            {isFactorShowing ? (
              <div className="modalDashboard">
                <div className="modalContentDashboard">
                  {isModalFactorLoaded ? (
                    <div>
                      <div className="modalHead">
                        <div className="rowModal">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <div className="headModalDashboard">
                              {FactorName}
                            </div>
                            <div className="dropDownBox">
                              <div className="dropDownContainer">
                                <div className="dropDown">{date} วัน</div>
                                <div className="dropdownContent">
                                  <RenderDateDropDown list={dateList} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="close"
                            onClick={() => {
                              setIsFactorShowing(false);
                            }}
                          >
                            Close
                          </div>
                        </div>
                        <div className="descriptionDashboard"></div>
                      </div>
                      <div className="modalFish">
                        <RenderFactorHistory
                          list={modalDataFactor.history_iot}
                        />
                      </div>
                    </div>
                  ) : (
                    <Loader
                      size={8}
                      margin={2}
                      // width={10}
                      color={"#444"}
                      loading={true}
                    />
                  )}
                </div>
              </div>
            ) : null}

            <div className="headTextDashboard">Your Ponds</div>
            {isPondLoaded ? (
              <RenderCard ponds={pondlist} />
            ) : (
              <div className="loadingBox">
                <Loader
                  size={8}
                  margin={2}
                  // width={10}
                  color={"#444"}
                  loading={true}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
