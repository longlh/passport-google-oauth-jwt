require('blanket')({
	pattern: function(file) {
		return !/node_modules/.test(file) && /lib/.test(file);
	}
});
