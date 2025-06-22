"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AircraftList_1 = require("./components/AircraftList");
var AircraftDetail_1 = require("./components/AircraftDetail");
var TelemetryForm_1 = require("./components/TelemetryForm");
var CommsPanel_1 = require("./components/CommsPanel");

var dummyAircraft = {
    id: "A1",
    position: { latitude: 0, longitude: 0, altitude: 0 },
    status: "Active",
    lastSeen: "2025-06-22T12:00:00Z"
};
var dummyAircraftList = [
    dummyAircraft,
    {
        id: "A2",
        position: { latitude: 1, longitude: 1, altitude: 100 },
        status: "Active",
        lastSeen: "2025-06-22T12:01:00Z"
    },
];
var dummyMessages = [
    {
        from: "A1",
        to: "A2",
        content: "Hello",
        timestamp: "2025-06-22T12:02:00Z"
    },
];
function App() {
    var _a = react_1.useState([]), aircraft = _a[0], setAircraft = _a[1];
    var _b = react_1.useState(null), selected = _b[0], setSelected = _b[1];
    var _c = react_1.useState([]), messages = _c[0], setMessages = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    
    var fetchAircraft = function () {
        setLoading(true);
        fetch("/api/v1/aircraft")
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setAircraft(data);
            setLoading(false);
        });
    };
    
    var fetchMessages = function () {
        fetch("/api/v1/comms")
            .then(function (res) { return res.json(); })
            .then(setMessages);
    };
    react_1.useEffect(function () {
        fetchAircraft();
        fetchMessages();
         Optionally, refresh every 5 seconds:
        const interval = setInterval(() => { fetchAircraft(); fetchMessages(); }, 5000);
        return () => clearInterval(interval);
    }, []);
    
    var updatePosition = function (id, pos) {
        fetch("/api/v1/aircraft/" + id, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pos)
        }).then(function () {
            setSelected(null);
            fetchAircraft();
        });
    };
    // Send a message
    var sendMessage = function (from, to, content) {
        fetch("/api/v1/comms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from: from, to: to, content: content })
        }).then(fetchMessages);
    };
    var handleSend = function (from, to, content) {
        alert("Send from " + from + " to " + to + ": " + content);
    };
    return (react_1["default"].createElement("div", { style: { padding: 24, fontFamily: "Arial, sans-serif" } },
        react_1["default"].createElement("h1", null, "Defence Aircraft Dashboard"),
        react_1["default"].createElement("button", { onClick: fetchAircraft, disabled: loading }, "Refresh"),
        loading ? (react_1["default"].createElement("p", null, "Loading...")) : (react_1["default"].createElement(AircraftList_1["default"], { aircraft: aircraft, onSelect: setSelected })),
        selected && (react_1["default"].createElement("div", null,
            react_1["default"].createElement(AircraftDetail_1["default"], { aircraft: selected, onClose: function () { return setSelected(null); } }),
            react_1["default"].createElement(TelemetryForm_1["default"], { aircraft: selected, onSubmit: updatePosition }),
            react_1["default"].createElement(CommsPanel_1["default"], { aircraft: selected, aircraftList: aircraft, messages: messages, onSend: sendMessage })))));
}
exports["default"] = App;
