"use strict";
exports.__esModule = true;
var express = require("express");
exports["default"] = express.Router()
    .get('/', function (req, res) { return res.send('There is something here I promise :)'); });
