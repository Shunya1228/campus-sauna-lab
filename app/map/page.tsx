import React from "react";
import SearchByUniversity from "../../components/map/SearchByUniversity";

interface MappageProps {
  university?: string;
}

const Mappage: React.FC<MappageProps> = ({ university }) => {
  return (
    <div>
      <SearchByUniversity />
    </div>
  );
};

export default Mappage;
