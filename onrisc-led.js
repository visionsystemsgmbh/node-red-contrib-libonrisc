module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscLedNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.led = config.led

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo.ref());
	}

	var ready_led = new onrisc.blink_led_t();
	onrisc.onrisc_blink_create(ready_led.ref());
	if (node.led == 'Power') {
	    ready_led.led_type = onrisc.led_type.LED_POWER;
	} else if (node.led == 'WLAN') {
	    ready_led.led_type = onrisc.led_type.LED_WLAN;
	} else {
	    ready_led.led_type = onrisc.led_type.LED_APP;
	}

        node.on('input', function(msg) {
            var data = msg.payload
            if (data == true) {
                onrisc.onrisc_switch_led(ready_led.ref(), 1);
            } else {
                onrisc.onrisc_switch_led(ready_led.ref(), 0);
	    }
        });
    }
    RED.nodes.registerType("onrisc-led", OnriscLedNode);
}
