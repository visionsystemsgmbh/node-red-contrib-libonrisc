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
	  var wlan_sw = onrisc.new_intp();
	  onrisc.onrisc_get_wlan_sw_state(wlan_sw);
	  var val = onrisc.intp_value(wlan_sw);
	  onrisc.delete_intp(wlan_sw);

	  msg = { payload: val };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-wlan-sw",OnriscWlanSwNode);
}
