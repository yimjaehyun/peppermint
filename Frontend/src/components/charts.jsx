import React from "react";
import {
    VictorySharedEvents,
    VictoryBar,
    VictoryLabel,
    VictoryPie,
    VictoryTooltip
} from "victory";

class CustomLabel extends React.Component {
    static defaultEvents = VictoryTooltip.defaultEvents;
    render() {
        return (
            <g>
                <VictoryLabel {...this.props} />
                <VictoryTooltip
                    {...this.props}
                    text={this.props.datum.y}
                    width={100}
                    height={100}
                />
            </g>
        );
    }
}

export default function Chart({ data }) {
    return (
        <svg viewBox="0 0 1000 350">
            {console.log(data)}
            <VictorySharedEvents
                events={[
                    {
                        childName: ["pie", "bar"],
                        target: "data",
                        eventHandlers: {
                            onMouseOver: () => {
                                return [
                                    {
                                        childName: ["pie", "bar"],
                                        mutation: props => {
                                            return {
                                                style: Object.assign(
                                                    {},
                                                    props.style,
                                                    { fill: "tomato" }
                                                )
                                            };
                                        }
                                    }
                                ];
                            },
                            onMouseOut: () => {
                                return [
                                    {
                                        childName: ["pie", "bar"],
                                        mutation: () => {
                                            return null;
                                        }
                                    }
                                ];
                            },
                            onClick: (evt, clickedProps) => {
                                console.log(clickedProps.datum);
                            }
                        }
                    }
                ]}
            >
                <g transform={"translate(200, 50)"}>
                    <VictoryBar
                        name="bar"
                        width={350}
                        standalone={false}
                        style={{
                            data: { width: 20 },
                            labels: { fontSize: 10, padding: 20 }
                        }}
                        data={data}
                        labels={data.map(d => d.x)}
                        labelComponent={<CustomLabel />}
                    />
                </g>
                <g transform={"translate(570, 21)"}>
                    <VictoryPie
                        name="pie"
                        width={300}
                        standalone={false}
                        style={{ labels: { fontSize: 10, padding: 10 } }}
                        data={data}
                    />
                </g>
            </VictorySharedEvents>
        </svg>
    );
}
