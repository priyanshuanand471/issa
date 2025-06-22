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
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { style: { marginBottom: 12 } },
            react_1["default"].createElement("label", null,
                react_1["default"].createElement("b", null, "Send as:"),
                " ",
                aircraft.id),
            react_1["default"].createElement("select", { value: recipient, onChange: function (e) { return setRecipient(e.target.value); }, style: { marginLeft: 8 } },
                react_1["default"].createElement("option", { value: "" }, "Select recipient"),
                aircraftList.filter(function (a) { return a.id !== aircraft.id; }).map(function (a) { return (react_1["default"].createElement("option", { key: a.id, value: a.id }, a.id)); }))),
        react_1["default"].createElement("div", { style: { display: "flex", marginBottom: 12 } },
            react_1["default"].createElement("input", { type: "text", value: msg, onChange: function (e) { return setMsg(e.target.value); }, placeholder: "Type your message", style: { flex: 1, marginRight: 8 } }),
            react_1["default"].createElement("button", { onClick: handleSend }, "Send")),
        react_1["default"].createElement("h4", null, "Messages"),
        react_1["default"].createElement("ul", { style: { background: "#fff", border: "1px solid #eee", borderRadius: 4, padding: 12, minHeight: 60 } }, messages
            .filter(function (m) {
            return (m.from === aircraft.id && m.to === recipient) ||
                (m.from === recipient && m.to === aircraft.id);
        })
            .map(function (m, i) { return (react_1["default"].createElement("li", { key: i, style: { marginBottom: 4 } },
            react_1["default"].createElement("b", null, m.from),
            " to ",
            react_1["default"].createElement("b", null, m.to),
            ": ",
            m.content,
            " ",
            react_1["default"].createElement("span", { style: { color: "#888", fontSize: 12 } },
                "(",
                m.timestamp,
                ")"))); }))));
};
exports["default"] = CommsPanel;
