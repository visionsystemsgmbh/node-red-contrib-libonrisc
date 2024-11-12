module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscDipNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.rate = config.rate;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

	let timerID;
	if (!timerID) {
		timerID = setInterval(dipPollingRead, node.rate);
	}

	function dipPollingRead() {

          var msg;
	  var dip = onriscCommon.onriscInfo.getDips();

	  msg = { payload: dip };
          node.send(msg);
	}
	node.on('close', function() {
		clearInterval(timerID); // clear Timer from events
		timerID = null;
	});

    }
    RED.nodes.registerType("onrisc-dip", OnriscDipNode);
}
