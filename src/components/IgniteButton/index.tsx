import React from "react";
import './style.css'
import clsx from "clsx";

interface Props {
    onClick: () => void,
    ignited: boolean,
    enabled: boolean,
}

const IgniteButton = ({onClick, ignited, enabled}: Props) => {
    return (
        <div
            className={clsx("ignite-button", ignited && 'ignite-button--ignited', !enabled && 'ignite-button--disabled')}
            style={{marginLeft: 8}}
            onClick={onClick}
        >
            {ignited ? "STOP" : "START"}
        </div>
    )
}

export default IgniteButton