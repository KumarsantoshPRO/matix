/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"zproskmatixsocreation/zsk_matix_so_creation/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});