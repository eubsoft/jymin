/**
 * If the argument is numeric, return a number, otherwise return zero. 
 * @param {Object} n
 */
var forceNumber = function (number, defaultNumber) {
	defaultNumber = defaultNumber || 0;
	number *= 1;
	return isNaN(number) ? defaultNumber : number;
};
