import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const RangeInputWithBubble = () => {
  const [rangeValue, setRangeValue] = useState(50); // Set initial value of range

  // Handle range value change and update the bubble
  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
  };
  return (
    <div className="d-flex flex-column align-items-center">
      {/* Range input container */}
      <div className="input-group range-input-wrapper mb-3">
        <label htmlFor="customRange" className="form-label">
          Expenses Range
        </label>
        <input
          type="range"
          className="form-range"
          id="customRange"
          min="0"
          max="100"
          value={rangeValue}
          onChange={handleRangeChange}
        />
        {/* Bubble to show current value */}
        <div className="bubble">{rangeValue}</div>
      </div>
    </div>
  );
};

export default RangeInputWithBubble;
