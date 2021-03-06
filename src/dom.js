var body = document.body;

/**
 * Get a DOM element by its ID (if the argument is an ID).
 * If you pass in a DOM element, it just returns it.
 * This can be used to ensure that you have a DOM element.
 */
var getElement = function(id, fromDocument) {
    // If the argument is not a string, just assume it's already an element reference, and return it.
    return typeof id == 'string' ? (fromDocument || document).getElementById(id) : id;
};

/**
 * Get DOM elements that have a specified tag name.
 */
var getElementsByTagName = function(tagName, parentElement) {
    parentElement = getElement(parentElement || document);
    return parentElement ? parentElement.getElementsByTagName(tagName) : [];
};

/**
 * Get DOM elements that have a specified tag and class.
 */
var getElementsByTagAndClass = function(tagAndClass, parentElement) {
    tagAndClass = tagAndClass.split('.');
    var tagName = (tagAndClass[0] || '*').toUpperCase();
    var className = tagAndClass[1];
    if (className) {
	    parentElement = getElement(parentElement || document);
	    var elements = [];
	    if (parentElement.getElementsByClassName) {
	        forEach(parentElement.getElementsByClassName(className), function(element) {
	            if (element.tagName == tagName) {
	                elements.push(element);
	            }
	        });
	    }
	    else {
	        forEach(getElementsByTagName(tagName), function(element) {
	            if (hasClass(element, className)) {
	                elements.push(element);
	            }
	        });
	    }
    }
    else {
    	elements = getElementsByTagName(tagName, parentElement);
    }
    return elements;
};

/**
 * Get the parent of a DOM element.
 */
var getParent = function(element, tagName) {
    var parentElement = (getElement(element) || {}).parentNode;
    // If a tag name is specified, keep walking up.
    if (tagName && parentElement) {
        if (parentElement.tagName != tagName) {
            parentElement = getParent(parentElement, tagName);
        }
    }
    return parentElement;
};

/**
 * Create a DOM element, and append it to a parent element.
 */
var addElement = function(parentElement, tagIdentifier, beforeSibling) {
	var tagAndAttributes = tagIdentifier.split('?');
	var tagAndClass = tagAndAttributes[0].split('.');
    var className = tagAndClass.slice(1).join(' ');
    var tagAndId = tagAndClass[0].split('#');
    var tagName = tagAndId[0] || 'div';
    var id = tagAndId[1];
    var attributes = tagAndAttributes[1];
    var cachedElement = addElement[tagName] || (addElement[tagName] = document.createElement(tagName));
    var element = cachedElement.cloneNode(true);
	if (id) {
		element.id = id;
	}
	if (className) {
		element.className = className;
	}
    if (parentElement) {
        insertChild(parentElement, element, beforeSibling);
    }
    if (attributes) {
    	attributes = attributes.split('&');
	    forEach(attributes, function (attribute) {
	    	var keyAndValue = attribute.split('=');
	    	element.setAttribute(keyAndValue[0], keyAndValue[1]);
	    });
    }
    return element;
};

/**
 * Create a DOM element, and prepend it to a parent element.
 */
var prependElement = function(parentElement, tagIdentifier) {
	var beforeSibling = getFirstChild(parentElement);
	return addElement(parentElement, tagIdentifier, beforeSibling);
};

/**
 * Wrap an existing DOM element within a newly created one.
 */
var wrapElement = function(element, tagIdentifier) {
    var parentElement = getParent(element);
    var wrapper = addElement(parentElement, tagIdentifier, element);
    insertChild(wrapper, element);
    return wrapper;
};

/**
 * Return the children of a parent DOM element.
 */
var getChildren = function(parentElement) {
    return getElement(parentElement).childNodes;
};

/**
 * Return a DOM element's index with respect to its parent.
 */
var getIndex = function(element) {
    if (element = getElement(element)) {
        var index = 0;
        while (element = element.previousSibling) {
            ++index;
        }
        return index;
    }
};

/**
 * Append a child DOM element to a parent DOM element.
 */
var insertChild = function(parentElement, childElement, beforeSibling) {
    // Ensure that we have elements, not just IDs.
    parentElement = getElement(parentElement);
    childElement = getElement(childElement);
    if (parentElement && childElement) {
        // If the beforeSibling value is a number, get the (future) sibling at that index.
        if (typeof beforeSibling == 'number') {
            beforeSibling = getChildren(parentElement)[beforeSibling];
        }
        // Insert the element, optionally before an existing sibling.
        parentElement.insertBefore(childElement, beforeSibling || null);
    }
};

/**
 * Remove a DOM element from its parent.
 */
var removeElement = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Remove the element from its parent, provided that its parent still exists.
        var parentElement = getParent(element);
        if (parentElement) {
            parentElement.removeChild(element);
        }
    }
};

/**
 * Remove children from a DOM element.
 */
var removeChildren = function(element) {
    setHtml(element, '');
};

/**
 * Get a DOM element's inner HTML if the element can be found.
 */
var getHtml = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerHTML;
    }
};

/**
 * Set a DOM element's inner HTML if the element can be found.
 */
var setHtml = function(element, html) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerHTML.
        element.innerHTML = html;
    }
};

/**
 * Get a DOM element's inner text if the element can be found.
 */
var getText = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.innerText;
    }
};

/**
 * Set a DOM element's inner text if the element can be found.
 */
var setText = function(element, text) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerText.
        element.innerHTML = text;
    }
};

/**
 * Get a DOM element's class name if the element can be found.
 */
var getClass = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.className;
    }
};

/**
 * Set a DOM element's class name if the element can be found.
 */
var setClass = function(element, text) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        // Set the element's innerText.
        element.className = text;
    }
};

/**
 * Get a DOM element's firstChild if the element can be found.
 */
var getFirstChild = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.firstChild;
    }
};

/**
 * Get a DOM element's previousSibling if the element can be found.
 */
var previousSibling = function(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
        return element.previousSibling;
    }
};

/**
 * Get a DOM element's nextSibling if the element can be found.
 */
function getNextSibling(element) {
    // Ensure that we have an element, not just an ID.
    if (element = getElement(element)) {
		return element.nextSibling;
    }
}

/**
 * Case-sensitive class detection.
 */
function hasClass(element, className) {
	var pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return pattern.test(getClass(element));
}

/**
 * Add a class to a given element.
 */
function addClass(element, className) {
    if (element = getElement(element)) {
    	element.className += ' ' + className;
    }
}

/**
 * Remove a class from a given element.
 */
function removeClass(element, className) {
	if (element = getElement(element)) {
    	var tokens = getClass(element).split(/\s/);
    	var ok = [];
    	forEach(tokens, function (token) {
    		if (token != className) {
    			ok.push(token);
    		}
    	});
	    element.className = ok.join(' ');
    }
}

/**
 * Turn a class on or off on a given element.
 */
function flipClass(element, className, flipOn) {
    var method = flipOn ? addClass : removeClass;
    method(element, className);
}

/**
 * Turn a class on or off on a given element.
 */
function toggleClass(element, className) {
    flipClass(element, className, !hasClass(element, className));
}

/**
 * Insert a call to an external JavaScript file.
 */
function insertScript(src, callback) {
    var head = getElementsByTagName('head')[0];
    var script = addElement(0, 'script');
    if (callback) {
        script.onload = callback;
        script.onreadystatechange = function() {
            if (isLoaded(script)) {
                callback();
            }
        };
    }
    script.src = src;
}
