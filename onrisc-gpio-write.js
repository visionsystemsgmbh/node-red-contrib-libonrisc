module.exports = function(RED) {
    'use strict'
    let onriscCommon = require('./onrisc-common');
    let onrisc = require('libonrisc');
    function OnriscGpioWriteNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

	if (!onriscCommon.onriscInfo) {
		onriscCommon.onriscInfo = new onrisc.onrisc_system_t();
		onrisc.onrisc_init(onriscCommon.onriscInfo);
	}

	var gpios = new onrisc.onrisc_gpios_t();

        node.on('input', function(msg) {
            var data = msg.payload

            gpios.mask = data.mask;
            gpios.value = data.value;
	
            var rc = onrisc.onrisc_gpio_set_value(gpios);

	    if (rc) {
		    var log_str = "Failed to set GPIOs";
		    node.error(log_str);
	    }
        });
    }
    RED.nodes.registerType("onrisc-gpio-write",OnriscGpioWriteNode);
}
