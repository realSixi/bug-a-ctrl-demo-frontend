import React, {useEffect, useState} from "react";
import "./App.css";
import Key from "./components/Key";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import StatusIndicator from "./components/StatusIndicator";
import baggerImg from './assets/bagger.svg'

dayjs.extend(duration);

function App() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [ignited, setIgnited] = useState(false);

    const [inUse, setInUse] = useState(false);
    const [inUseByUser, setInUseByUser] = useState(false);

    const [currentCredit, setCurrentCredit] = useState<number | null>(0);

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params: { apikey?: string } = Object.fromEntries(
            urlSearchParams.entries()
        );

        if (params.apikey) {
            setApiKey(params.apikey);
            window.history.pushState({}, document.title, window.location.pathname);
        }
    }, []);

    const sendEvent = async (data: any) => {
        await fetch("/api/bugacontrol/move", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "api-key": apiKey!,
                "content-type": "application/json",
            },
        });
    };

    const sendIgnite = async (status: boolean) => {
        const res = await fetch("/api/bugacontrol/ignite", {
            method: "POST",
            body: JSON.stringify({
                on: status,
            }),
            headers: {
                "api-key": apiKey!,
                "content-type": "application/json",
            },
        });
        return res;
    };

    const ignite = async () => {
        let res = await sendIgnite(!ignited);
        if (res.ok) {
            setIgnited(!ignited);
        }
        if (res.status === 409) {
            //setIgnited(false);
        }
    };

    useEffect(() => {
        if (ignited) {
            let interval = setInterval(() => {
                sendIgnite(true).then(res => {
                    if (!res.ok) {
                        setIgnited(false)
                    }
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [ignited]);

    useEffect(() => {
        if (apiKey) {
            const events = new EventSource(
                `/api/status/subscribe?apikey=${apiKey}`,
                {}
            );

            events.onmessage = (event) => {
                const json = JSON.parse(event.data);
                console.log("got event", json);
                if (json.type === "state") {
                    setInUse(json.inUse);
                    setInUseByUser(json.inUseByCurrentUser);
                    setCurrentCredit(json.total);
                } else if (json.type === "charged") {
                    setCurrentCredit(json.total);
                }
            };
        }
    }, [apiKey]);

    useEffect(() => {
        if (apiKey) {
            fetch(`/api/status`, {
                headers: {
                    "api-key": apiKey,
                },
                method: "get",
            })
                .then((res) => res.json())
                .then((json) => {
                    setInUse(json.inUse);
                    setInUseByUser(json.inUseByCurrentUser);
                    setCurrentCredit(json.total);
                });
        }
    }, [apiKey]);

    if (!apiKey) {
        return (
            <div className="App">
                <div className={"centered"}>
                    <div style={{color: '#ccc'}}>
                        Kein API-Key gefunden. Bitte nutze den Link von <a
                        href={'https://bagger.projektion.tv'}>bagger.projektion.tv</a>.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="App">
            <div className={"header"}>
        <span className={'credit'}>
          Deine Baggerzeit:{" "}
            {currentCredit &&
                dayjs.duration(currentCredit * 1000).format("HH:mm:ss")}
        </span>
            </div>

            <div className={"centered"}>
                <div>
                    <img className={'bagger-image'} src={baggerImg}/>
                </div>


                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 40,
                        justifyItems: "center",
                        alignItems: "center",
                    }}
                >
                    <StatusIndicator name={"Frei"} status={!inUse}/>
                    <StatusIndicator
                        name={"Aktiv"}
                        triState={inUseByUser && !ignited}
                        status={inUseByUser && ignited}
                    />
                    <div
                        className={"ignite-button"}
                        style={{marginLeft: 8}}
                        onClick={ignite}
                    >
                        {ignited ? "STOP" : "START"}
                    </div>
                </div>

                <div className={"keyboard"}>
                    <div className={"row"}>
                        <Key
                            value={"q"}
                            onPress={sendEvent}
                            axis={"vertical_axis"}
                            factor={1}
                            disabled={false}
                        />
                        <Key value={"w"}/>
                        <Key
                            value={"e"}
                            onPress={sendEvent}
                            axis={"vertical_axis"}
                            factor={-1}
                            disabled={false}
                        />
                        <Key value={"r"}/>
                        <Key value={"t"}/>
                        <Key value={"y"}/>
                        <Key
                            value={"u"}
                            onPress={sendEvent}
                            axis={"joint_c"}
                            factor={-1}
                            disabled={false}
                        />
                        <Key
                            value={"i"}
                            onPress={sendEvent}
                            axis={"joint_b"}
                            factor={1}
                            disabled={false}
                        />
                        <Key
                            value={"o"}
                            onPress={sendEvent}
                            axis={"joint_a"}
                            factor={-1}
                            disabled={false}
                        />
                    </div>
                    <div className={"row"} style={{marginLeft: 12}}>
                        <Key value={"a"}/>
                        <Key value={"s"}/>
                        <Key value={"d"}/>
                        <Key value={"f"}/>
                        <Key value={"g"}/>
                        <Key value={"h"}/>
                        <Key
                            value={"j"}
                            onPress={sendEvent}
                            axis={"joint_c"}
                            factor={1}
                            disabled={false}
                        />
                        <Key
                            value={"k"}
                            onPress={sendEvent}
                            axis={"joint_b"}
                            factor={-1}
                            disabled={false}
                        />
                        <Key
                            value={"l"}
                            onPress={sendEvent}
                            axis={"joint_a"}
                            factor={1}
                            disabled={false}
                        />
                    </div>
                    <div className={"row"} style={{marginLeft: 36}}>
                        <Key value={"z"}/>
                        <Key value={"x"}/>
                        <Key value={"c"}/>
                        <Key value={"v"}/>
                        <Key value={"b"}/>
                        <Key value={"n"}/>
                        <Key value={"m"}/>
                        <Key value={","}/>
                        <Key value={"."}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
