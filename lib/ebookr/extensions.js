module.exports.extend = function (extension) {
	require(extension)(this);
};