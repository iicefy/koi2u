import Head from "next/head";
import Header from "../components/header";
import SideNav3 from "../components/sidenav3";
import NoteBox from "../components/noteBox";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import useSWR from "swr";

export default function Farmservice() {
  const token = useSelector((state) => state.user.token);
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dataBooking, setDataBooking] = useState();

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
      setDataBooking(result.data.list_booking);
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
        </div>

        <div className="confirmBooking">
          <div className="confirmBookingBtn" onClick={() => {}}>
            Confirm Booking
          </div>
        </div>
      </div>
    );
  };

  const testSWR = () => {
    let url = `http://dummy.restapiexample.com/api/v1/employees`;
    useSWR([url, term], () =>
      axios({
        method: "GET",
        url,
        // params: { term },
      }).then((res) => res.data)
    );
    console.log(res.data);
  };

  useEffect(() => {
    setIsLoaded(false);
    // testSWR();
    fetchDataBooking().then(() => {
      setIsLoaded(true);
    });
    return () => {};
  }, []);

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
                      <div></div>
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
