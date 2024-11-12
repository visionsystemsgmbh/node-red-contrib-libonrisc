module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscGpioReadNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(gpioPollingRead, node.rate);
	}

	function gpioPollingRead() {

          var msg;

	  var gpios = onriscCommon.onriscInfo.getGpioValue().value;
	  msg = { payload: gpios };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-gpio-read", OnriscGpioReadNode);
}
