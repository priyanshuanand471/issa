"use strict";
exports.__esModule = true;
var react_1 = require("react");
var CommsPanel = function (_a) {
    var aircraft = _a.aircraft, aircraftList = _a.aircraftList, messages = _a.messages, onSend = _a.onSend;
    var _b = react_1.useState(""), recipient = _b[0], setRecipient = _b[1];
    var _c = react_1.useState(""), msg = _c[0], setMsg = _c[1];
    var handleSend = function () {
        if (recipient && msg) {
            onSend(aircraft.id, recipient, msg);
            setMsg("");
        }
    };
    return (react_1["default"].createElement("div", { style: { marginTop: 24 } },
        react_1["default"].createElement("h3", null,
            "Communicate as ",
            aircraft.id),
        react_1["default"].createElement("select", { value: recipient, onChange: function (e) { return setRecipient(e.target.value); } },
            react_1["default"].createElement("option", { value: "" }, "Select recipient"),
            aircraftList.filter(function (a) { return a.id !== aircraft.id; }).map(function (a) { return (react_1["default"].createElement("option", { key: a.id, value: a.id }, a.id)); })),
        react_1["default"].createElement("input", { type: "text", value: msg, onChange: function (e) { return setMsg(e.target.value); }, placeholder: "Message", style: { marginLeft: 8 } }),
        react_1["default"].createElement("button", { onClick: handleSend, style: { marginLeft: 8 } }, "Send"),
        react_1["default"].createElement("h4", null, "Messages"),
        react_1["default"].createElement("ul", null, messages
            .filter(function (m) {
            return (m.from === aircraft.id && m.to === recipient) ||
                (m.from === recipient && m.to === aircraft.id);
        })
            .map(function (m, i) { return (react_1["default"].createElement("li", { key: i },
            react_1["default"].createElement("b", null, m.from),
            " to ",
            react_1["default"].createElement("b", null, m.to),
            ": ",
            m.content,
            " (",
            m.timestamp,
            ")")); }))));
};
exports["default"] = CommsPanel;
