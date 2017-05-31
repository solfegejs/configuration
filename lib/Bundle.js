"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _configYaml = require("config-yaml");

var _configYaml2 = _interopRequireDefault(_configYaml);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bundle = class Bundle {
    constructor() {}

    getPath() {
        return __dirname;
    }

    *initialize(application) {
        this.application = application;

        this.application.on("configuration_load", (0, _bindGenerator2.default)(this, this.onConfigurationLoad));
    }

    *onConfigurationLoad(application, configuration, filePath, format) {
        if (format !== "yaml") {
            return;
        }

        var properties = {};

        try {
            properties = (0, _configYaml2.default)(filePath, { encoding: "utf8" });
        } catch (error) {
            return;
        }

        configuration.addProperties(properties);
    }
};
exports.default = Bundle;
module.exports = exports["default"];