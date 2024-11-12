module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscUartModeNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.mode = config.mode;
        node.termination = config.termination;
        node.port = parseInt(config.port);

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

	var rs_mode;
	if (node.mode == 'RS232') {
	    rs_mode = onrisc.RsModes.TYPE_RS232;
	} else if (node.mode == 'RS422') {
	    rs_mode = onrisc.RsModes.TYPE_RS422;
	} else if (node.mode == 'RS485-half-duplex') {
	    rs_mode = onrisc.RsModes.TYPE_RS485_HD;
	} else if (node.mode == 'RS485-full-duplex') {
	    rs_mode = onrisc.RsModes.TYPE_RS485_FD;
	}
	var termination = 0;
	if (node.termination == "on") {
		termination = 1;
	}

	onriscCommon.onriscInfo.setUartMode(node.port, rs_mode, termination);
    }
    RED.nodes.registerType("onrisc-uart-mode", OnriscUartModeNode);
}
