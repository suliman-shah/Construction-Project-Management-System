import React from "react";
import { Link } from "react-router-dom";
const ErorPage = () => {
  return (
    <div>
      <h1>
        not found: <Link to={"/"}>back to home</Link>
      </h1>
    </div>
  );
};

export default ErorPage;
