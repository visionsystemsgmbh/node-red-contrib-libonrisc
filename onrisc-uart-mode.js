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
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo.ref());
	}

	var uart = new onrisc.onrisc_uart_mode_t();
	if (node.mode == 'RS232') {
	    uart.rs_mode = onrisc.rs_type.TYPE_RS232;
	} else if (node.mode == 'RS422') {
	    uart.rs_mode = onrisc.rs_type.TYPE_RS422;
	} else if (node.mode == 'RS485-half-duplex') {
	    uart.rs_mode = onrisc.rs_type.TYPE_RS485_HD;
	} else if (node.mode == 'RS485-full-duplex') {
	    uart.rs_mode = onrisc.rs_type.TYPE_RS485_FD;
	}
	uart.termination = 0;
	if (node.termination == "on") {
		uart.termination = 1;
	}
	var rc = onrisc.onrisc_set_uart_mode(node.port, uart.ref());
	if (rc) {
		var log_str = "Failed to set UART mode for port " + node.port;
		node.error(log_str);
	}

    }
    RED.nodes.registerType("onrisc-uart-mode", OnriscUartModeNode);
}
