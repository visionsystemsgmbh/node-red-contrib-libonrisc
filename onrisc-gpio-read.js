module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscGpioReadNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo.ref());
	}

	var gpios = new onrisc.onrisc_gpios_t();
	let timerID;
	if (!timerID) {
		timerID = setInterval(gpioPollingRead, node.rate);
	}

	function gpioPollingRead() {

          var msg;

          onrisc.onrisc_gpio_get_value(gpios.ref());
	  msg = { payload: gpios.value };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-gpio-read", OnriscGpioReadNode);
}
