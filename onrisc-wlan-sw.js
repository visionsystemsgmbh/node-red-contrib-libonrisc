module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscWlanSwNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo);
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(wlanSwPollingRead, node.rate);
	}

	function wlanSwPollingRead() {

          var msg;
	  var wlan_sw = onrisc.wlan_sw_state_ptr;
	  onrisc.onrisc_get_wlan_sw_state(wlan_sw);

	  msg = { payload: wlan_sw.deref() };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-wlan-sw",OnriscWlanSwNode);
}
