/**
 * Get or set the value of a form element.
 */
var valueOf = function (input, value) {
	input = getElement(input);
	var type = input.type;
	var isCheckbox = type == 'checkbox';
	// TODO: Make this work for select boxes and other stuff too.
	if (typeof value != 'undefined') {
		if (isCheckbox) {
			input.checked = value ? true : false;
		}
		else {
			input.value = value;
		}
	}
	else {
		value = input.value;
		if (isCheckbox) {
			return input.checked ? value : null;
		}
	}
	return input.value;
};
