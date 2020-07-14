import { useEffect, useState } from "react";

export default function PondBox({
  pondData,
  setModal,
  pondID,
  factorID,
  setFactorModal,
  factorName,
}) {
  const [isLoaded, setIsLoaded] = useState(true);

  const FactorCard = ({ factorData }) => {
    return (
      <div
        className="iotFactorBox"
        onClick={() => {
          factorID(factorData.list_factor_id);
          factorName(factorData.factor_facterType);
          setFactorModal(true);
        }}
      >
        <div className="factorName">{factorData.factor_facterType}</div>
        <div className="factorValue">
          <div className="factorMax">max {factorData.equipment_factor_max}</div>
          <div className="factorAvg">
            {factorData.equipment_factor_average}
            <div className="factorUnit">{factorData.factor_unit}</div>
          </div>
          <div className="factorMin">min {factorData.equipment_factor_min}</div>
        </div>
      </div>
    );
  };

  function RenderCard(props) {
    const iotData = props.iotData;
    const listItems = iotData.map((data) => (
      <FactorCard key={data.factor_facterType} factorData={data} />
    ));

    return <div>{listItems}</div>;
  }

  return (
    <div className="pondBox">
      <div className="pondBoxHeader">
        <div className="rowModal">
          <div className="pondText">{pondData.fish_pond_name}</div>
          <div
            className="detail"
            onClick={() => {
              setModal(true);
              pondID(pondData.fish_pond_id);
            }}
          >
            detail
          </div>
        </div>
        <div className="fishText">Fish {pondData.fish_count}</div>
        {isLoaded ? <RenderCard iotData={pondData.data_iot} /> : <div></div>}
      </div>
    </div>
  );
}
