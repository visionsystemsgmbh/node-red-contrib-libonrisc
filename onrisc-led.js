module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscLedNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.led = config.led

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

	var ready_led;
	if (node.led == 'Power') {
	    ready_led = onrisc.LedType.LED_POWER;
	} else if (node.led == 'WLAN') {
	    ready_led = onrisc.LedType.LED_WLAN;
	} else {
	    ready_led = onrisc.LedType.LED_APP;
	}

        node.on('input', function(msg) {
            var data = msg.payload
            if (data == true) {
                onriscCommon.onriscInfo.switchLed(ready_led, 1);
            } else {
                onriscCommon.onriscInfo.switchLed(ready_led, 0);
	    }
        });
    }
    RED.nodes.registerType("onrisc-led", OnriscLedNode);
}
