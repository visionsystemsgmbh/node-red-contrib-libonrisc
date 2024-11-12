module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscGpioWriteNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.OnriscSystem();
	}

        node.on('input', function(msg) {
            var data = msg.payload

	    onriscCommon.onriscInfo.setGpioValue(data.mask, data.value);
	
        });
    }
    RED.nodes.registerType("onrisc-gpio-write", OnriscGpioWriteNode);
}
