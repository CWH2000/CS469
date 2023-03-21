import React from "react";

// .junior{
//     color: rgb(162, 176, 240)
//   }
//   .middle{
//     color: rgb(83, 119, 254)
//   }
//   .senior{
//     color: rgb(37, 58, 169)
//   }

const StatusCircle = ({ status }) => {
  const circleColor = (status === "Junior" ? "rgb(162, 176, 240)" : status === "Middle" ?  "rgb(83, 119, 254)" : 'rgb(37, 58, 169)');

  return (
    <svg height="10" width="10">
      <circle cx="5" cy="5" r="5" fill={circleColor} />
    </svg>
  );
};

export default StatusCircle;