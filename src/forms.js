/**
 * Get or set the value of a form element.
 */
var valueOf = function (input, value) {
	input = getElement(input);
	var type = input.type;
	var isCheckbox = type == 'checkbox';
	var isRadio = type == 'radio';
	var isSelect = /select/.test(type);
	// TODO: Make this work for select boxes and other stuff too.
	if (typeof value == 'undefined') {
		value = input.value;
		if (isCheckbox) {
			return input.checked ? value : null;
		}
		else if (isSelect) {
			return input.options[input.selectedIndex].value;
		} 
	}
	else {
		if (isCheckbox) {
			input.checked = value ? true : false;
		}
		else if (isSelect) {
			forEach(input.options, function (option, index) {
				if (option.value == value) {
					input.selectedIndex = index;
				}
			});
		}
		else {
			input.value = value;
		}
	}
	return input.value;
};
