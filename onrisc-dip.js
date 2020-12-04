module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscDipNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo.ref());
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(dipPollingRead, node.rate);
	}

	function dipPollingRead() {

          var msg;
	  var dip = onrisc.dips_state_ptr;
	  onrisc.onrisc_get_dips(dip);

	  msg = { payload: dip.deref() };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-dip", OnriscDipNode);
}
