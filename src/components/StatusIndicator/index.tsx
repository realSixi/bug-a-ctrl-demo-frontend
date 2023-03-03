import "./style.css";
import Indicator from '../Indicator';
import React from 'react';

interface Props {
  status: boolean;
  name?: string;
  triState?: boolean
}

const ClassicButton = ({ status, name = "Frei", triState }: Props) => {
  return <div className={"status-indicator"}>
    <Indicator triState={triState} status={status}/>
    <span className={'label'}>{name}</span>
  </div>;
};

export default ClassicButton;