import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import ResultsPage from "../Pages/ResultsPage/ResultsPage";

type Props = {};

const Routing = (props: Props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trip" element={<ResultsPage />} />
    </Routes>
  );
};

export default Routing;
