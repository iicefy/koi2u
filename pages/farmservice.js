import Head from "next/head";
import Header from "../components/header";
import SideNav3 from "../components/sidenav3";
import NoteBox from "../components/noteBox";

import Loader from "react-spinners/PulseLoader";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import useSWR from "swr";

export default function Farmservice() {
  const dispatch = useDispatch();
  const SETBOOKING_REFRESH = "SETBOOKING_REFRESH";
  const token = useSelector((state) => state.user.token);
  const isBookingRefresh = useSelector((state) => state.user.isBookingRefresh);
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataBooking, setDataBooking] = useState();

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const fetchDataBooking = async () => {
    let url = `http://localhost:8080/api/v1/booking/list-booking`;
    let Authorization = token;
    try {
      const result = await axios({
        method: "get",
        url,
        headers: {
          Authorization,
        },
      });
      console.log(result.data.list_booking);
      setDataBooking(result.data.list_booking);
      dispatch({
        type: SETBOOKING_REFRESH,
        isBookingRefresh: false,
      });
      // console.log(result.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const RenderBookingList = (props) => {
    const bookingData = props.list;
    // console.log(bookingData);
    const listItems = bookingData.map((data) => (
      <BookingList key={data.booking_id} data={data} />
    ));
    return <div>{listItems}</div>;
  };

  const BookingList = ({ data }) => {
    const fetchDataConfirm = async () => {
      let url = `http://localhost:8080/api/v1/booking/confirm-booking-by-customer`;
      let Authorization = token;
      dispatch({
        type: SETBOOKING_REFRESH,
        isBookingRefresh: true,
      });
      try {
        const result = await axios({
          method: "post",
          url,
          headers: {
            Authorization,
          },
          data: {
            booking_id: data.booking_id,
          },
        });
        dispatch({
          type: SETBOOKING_REFRESH,
          isBookingRefresh: false,
        });
        console.log(result.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    return (
      <div className="bookingList">
        <div className="bookingData">
          <div className="text-row"></div>
          <div className="text-row">
            <div className="">Booking ID : </div>
            <div>{data.booking_id}</div>
          </div>
          <div className="text-row">
            <div className="">Booking Name : </div>
            <div>{data.booking_name}</div>
          </div>
          <div className="text-row">
            <div className="">Pond : </div>
            <div>{data.fish_pond_name}</div>
          </div>
          <div className="text-row">
            <div className="">Status : </div>
            <div>{data.status_booking_status}</div>
          </div>
          <div className="text-row">
            <div className="">Description : </div>
          </div>
          <div className="text-row">
            <div className="" style={{ marginTop: "10px" }}>
              {data.booking_description}
            </div>
          </div>
        </div>

        <div className="confirmBooking">
          <div
            className="confirmBookingBtn"
            onClick={() => {
              fetchDataConfirm();
            }}
          >
            Confirm Booking
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsLoaded(false);
    // testSWR();
    fetchDataBooking().then(() => {
      setIsLoaded(true);
    });
    return () => {};
  }, []);

  useDidMountEffect(() => {
    if (isBookingRefresh === false) {
      console.log("isBookingRefresh");
      console.log(isBookingRefresh);
    } else {
      setIsLoaded(false);
      fetchDataBooking().then(() => {
        setIsLoaded(true);
      });
    }
    return () => {};
  }, [isBookingRefresh]);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mainApp">
          <div className="page3">
            <SideNav3 description={description} />
          </div>
          <div className="page2">
            <div className="farmservicePage">
              <div className="farmserviceBox">
                <div className="headTextDashboard">Booking description</div>
                <div className="postBox">
                  <textarea
                    className="textarea"
                    placeholder="Some Details"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>
              <div>
                <div className="headTextDashboard">Booking List</div>
                <div className="postBox">
                  <div className="bookingBox">
                    {isLoaded ? (
                      <RenderBookingList list={dataBooking} />
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
