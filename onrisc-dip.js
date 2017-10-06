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
		onrisc.onrisc_init(onriscCommon.onriscInfo);
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(dipPollingRead, node.rate);
	}

	function dipPollingRead() {

          var msg;
	  var dip = onrisc.new_uint32_tp();
	  onrisc.onrisc_get_dips(dip);
	  var val = onrisc.uint32_tp_value(dip);
	  onrisc.delete_uint32_tp(dip);

	  msg = { payload: val };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-dip",OnriscDipNode);
}
