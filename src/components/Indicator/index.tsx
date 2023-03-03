import clsx from "clsx";
import React from "react";
import './style.css'

const Indicator = ({ status, triState }: { status: boolean, triState?: boolean }) => {
  return (
    <div className={clsx("indicator", status && "indicator--active", triState && 'indicator--tristate')}></div>
  );
};

export default Indicator;
