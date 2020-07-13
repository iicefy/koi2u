import Head from "next/head";
import SideNav2 from "../components/sidenav2";
import NoteBox from "../components/noteBox";
import NoteBox2 from "../components/noteBox2";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "react-spinners/PulseLoader";

export default function Note() {
  const token = useSelector((state) => state.user.token);
  const farmData = useSelector((state) => state.user.farm);
  const factorList = useSelector((state) => state.user.factorList);
  const isFactorLoaded = useSelector((state) => state.user.isFactorLoaded);
  const [isLoaded, setisLoaded] = useState(true);
  const [noteByPond, setNoteByPond] = useState();
  const dispatch = useDispatch();
  const SELECT_PONDID = "SELECT_PONDID";
  const SELECT_FACTOR = "SELECT_FACTOR";

  const [selectFarmText, setselectFarmText] = useState("Farm");
  const [selectFarmValue, setselectFarmValue] = useState("");
  const [selectPondText, setselectPondText] = useState("Pond");
  const [selectPondValue, setselectPondValue] = useState("");
  const [selectFactorText, setselectFactorText] = useState("Factor");
  const [selectFactorValue, setselectFactorValue] = useState("");
  const [DataPond, setDataPond] = useState();
  const [isPondLoaded, setIsPondLoaded] = useState(false);
  const [isfilter, setIsfilter] = useState(false);

  // this func to useEffect not initial render
  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const RenderFactorDropDown = (props) => {
    const factorData = props.list;
    const listItems = factorData.map((data) => (
      <DropDownFactorContent key={data.factor_facterType} factor={data} />
    ));

    return <div className="dropdownContent">{listItems}</div>;
  };

  const DropDownFactorContent = ({ factor }) => {
    return (
      <div
        className="dropdownList"
        onClick={() => {
          setselectFactorText(factor.factor_facterType);
          setselectFactorValue(factor.factor_id);
          setIsfilter(true);
          dispatch({
            type: SELECT_FACTOR,
            selectFactor: selectFactorValue,
          });
        }}
      >
        {factor.factor_facterType}
      </div>
    );
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
          dispatch({
            type: SELECT_PONDID,
            selectPond: pond.fishpond_id,
          });
        }}
      >
        {pond.fishpond_name}
      </div>
    );
  };

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
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mainApp">
          <div className="page3">
            <SideNav2 />
          </div>
          <div className="page2">
            <div className="textNoteBoxContainer">
              <div className="textNoteBox">
                <div className="headTextDashboard">Factor Note</div>
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
                <div className="filter">filter</div>
                <div className="dropDownBox">
                  <div className="dropDownContainer">
                    <div className="dropDown">{selectFactorText}</div>
                    <div className="dropdownContent">
                      {isFactorLoaded ? (
                        <RenderFactorDropDown list={factorList} />
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
                </div>
                <div className="dropDownBox">
                  <div className="dropDownContainer">
                    <div
                      className="dropDown"
                      onClick={() => {
                        setselectFactorText("Factor");
                        setselectFactorValue("");
                        setIsfilter(false);
                      }}
                    >
                      Reset Filter
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="noteBoxContainer">
              {isfilter ? (
                <div>
                  {isLoaded ? (
                    <NoteBox2 />
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
              ) : (
                <div>
                  {isLoaded ? (
                    <NoteBox />
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
