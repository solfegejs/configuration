"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Bundle = class Bundle {
    constructor() {}

    getPath() {
        return __dirname;
    }

    initialize(app) {
        app.on("start", this.onStart);
        console.log("Bundle initialized");
    }

    onStart(app) {
        var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var config = app.getConfiguration();
        console.log("a:", config.get("a"));
        console.log("z:", config.get("z"));
        console.log("parameters.foo:", config.get("parameters.foo"));
    }
};
exports.default = Bundle;
module.exports = exports["default"];