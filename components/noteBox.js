import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "react-spinners/PulseLoader";

export default function NoteBox() {
  const dispatch = useDispatch();
  const SELECT_PONDID = "SELECT_PONDID";
  const pondID = useSelector((state) => state.user.selectPond);
  const token = useSelector((state) => state.user.token);

  const [noteData, setNoteData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const fetchNoteListFromPondID = async () => {
    let url = `http://localhost:8080/api/v1/manual/lists-manual`;
    let Authorization = token;

    try {
      const result = await axios({
        method: "post",
        url,
        headers: {
          Authorization,
        },
        data: {
          fishpond_id: pondID,
        },
      });
      setNoteData(result.data.lists_manual);
      // console.log(result.data);
      dispatch({
        type: SELECT_PONDID,
        selectPond: null,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const RenderNoteList = (props) => {
    const noteData = props.list;
    const listItems = noteData.map((data) => (
      <NoteList key={data.manual_factor_id} data={data} />
    ));

    return <div>{listItems}</div>;
  };

  const NoteList = ({ data }) => {
    // console.log(data);

    const createDate = new Date(data.manual_factor_created_date).toLocaleString(
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
      <div className="noteList">
        <div className="noteTextContainer1">
          <div className="noteText1">{data.factor_facterType}</div>
          <div className="noteText1">6.2 </div>
        </div>
        <div className="noteTextContainer2">
          <div className="">{createDate}</div>
          <div>{data.factor_unit}</div>
        </div>
      </div>
    );
  };

  useDidMountEffect(() => {
    if (pondID === null) {
      console.log("action");
    } else {
      fetchNoteListFromPondID().then(() => {
        setIsLoaded(true);
      });
    }

    return () => {};
  }, [pondID]);

  return (
    <div className="noteBox">
      {isLoaded ? (
        <RenderNoteList list={noteData} />
      ) : (
        <div className="headTextDashboard-white" style={{ fontSize: "20px" }}>
          Select Pond
        </div>
      )}
    </div>
  );
}
