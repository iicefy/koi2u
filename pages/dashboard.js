import { useState, useEffect } from "react";
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

export default function Dashboard() {
  const FARM = "FARM";
  const POND = "POND";
  const FARM_SELECT = "FARM_SELECT";
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const pondlist = useSelector((state) => state.user.pond);
  const selectedFarm = useSelector((state) => state.user.selectFarm);
  const [isLoaded, setisLoaded] = useState();
  const [text, settext] = useState("Loading");
  console.log(token);

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
      // console.log(result.data.farmlist[0].farm_id);
      dispatch({
        type: FARM_SELECT,
        selectFarm: result.data.farmlist[0].farm_id,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchFarmList();
  }, []);

  useEffect(() => {
    settext("Loading");
    setisLoaded(false);
    fetchPondList().then(() => {
      settext("Loaded");
      setisLoaded(true);
    });
  }, [selectedFarm]);

  const RenderCard = (props) => {
    const pondData = props.ponds;
    const listItems = pondData.map((pond) => (
      <PondBox key={pond.fish_pond_id} pondData={pond} />
    ));
    return <div className="align">{listItems}</div>;
  };

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
            <div className="headTextDashboard">Your Ponds</div>
            {isLoaded ? <RenderCard ponds={pondlist} /> : <div>Loading</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
