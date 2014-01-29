/**
 * Refresh the page when a dependency changes.
 */
socketOn('refresh', function (changed) {
	location.reload();
});