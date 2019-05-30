import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

export default () => {
  return (
    <div className="center-progress">
      <CircularProgress
        size={30} 
        status="loading"
      />
    </div>
  );
};
