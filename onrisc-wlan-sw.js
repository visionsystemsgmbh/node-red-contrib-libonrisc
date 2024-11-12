module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscWlanSwNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(wlanSwPollingRead, node.rate);
	}

	function wlanSwPollingRead() {
          var msg;
	  var wlan_sw = onriscCommon.onriscInfo.getWlanSwState();

	  msg = { payload: wlan_sw };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-wlan-sw", OnriscWlanSwNode);
}
