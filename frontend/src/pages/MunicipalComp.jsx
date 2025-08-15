import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../hooks/useLanguage";
import Select from "react-select";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import Header from "../components/Header";
import geoMapsImage from "../assets/images/reg_photos/geomaps.png";
import chartsImage from "../assets/images/reg_photos/1612523122750-Charts.jpg";
import excelIcon from "../assets/excel.png";

const MunicipalComp = () => {
  return (
    <div>
      <Header />
      <h1>Municipal Comparison</h1>
    </div>
  );
};

export default MunicipalComp;
