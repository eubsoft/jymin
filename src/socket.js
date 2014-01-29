var SOCKET_IO_PATH = '/socket.io/1/';
var SOCKET_EMIT_RETRY_COUNT = 5;
var SOCKET_EMIT_RETRY_TIMEOUT = 500;

// Initially, the socket is just a holder for handlers.
var socket = {H: {}};

var socketEmissionId = 1;

/**
 * Make a new socket connection.
 */
var socketConnect = function () {
	var url = getBaseUrl() + SOCKET_IO_PATH + '?t=' + getTime();
	getResponse(url, socketSetup, socketConnect);
};

/**
 * Set up a socket based on a setup string returned from the server.
 */
var socketSetup = function (setupString) {
	var setupData = setupString.split(':');
	var socketId = setupData[0];
	var oldSocket = socket;
	socket = new WebSocket('ws://' + getHost() + SOCKET_IO_PATH + 'websocket/' + socketId);
	socket.H = oldSocket.H;
	delete oldSocket.H;

	socket.onmessage = function (message) {
		var data = message.data;
		var type = data[0] * 1;

		// Accept the "connected" message.
		if (type == 1) {
			socketTrigger('connected');

		// Echo the heartbeat data.
		} else if (type == 2) {
			socket.send(data);

		// A message was emitted to the client.
		} else if (type == 5) {
			data = data.replace(/[0-9]:+/, '');
			try {
				data = JSON.parse(data);
			}
			catch (e) {
				log('ERROR: Malformed socket data', data);
			}
			socketTrigger(data.name, data.args[0]);

		// We don't care about all message types.
		} else {
			log('ERROR: Unknown socket message type', data);
		}
	};

	// When disconnected, attempt to reconnect.
	socket.onclose = function (data) {
		socketConnect();
	};
};

/**
 * Set a new handler for a named event.
 */
var socketOn = function (name, callback) {
	var handlers = socket.H;
	var callbacks = handlers[name] = handlers[name] || [];
	callbacks.push(callback);
};

/**
 * Trigger handlers for a named event.
 */
var socketTrigger = function (name, data) {

	// Retry-enabled emissions have an emission ID in their responses.
	var emissionId = (data || {}).EID;
	if (emissionId) {

		// The emission time is stored until a response is received.
		var emissionTime = socketEmit['E' + emissionId];
		if (emissionTime) {

			// Cancel retries.
			clearTimeout(socketEmit['T' + emissionId]);
			delete socketEmit['E' + emissionId];

			// TODO: Track latencies for adaptive retry and heartbeat delays.
			var elapsed = new Date() - emissionTime;
		}

		// If the emission time is cleared, callbacks have already run.
		else {
			return;
		}
	}

	// Run all of the handlers that have been bound to this name.	
	var handlers = socket.H;
	var callbacks = handlers[name] = handlers[name] || [];
	forEach(callbacks, function (callback) {
		callback(data);
	});
};

/**
 * Emit data over the socket, retrying if necessary
 */
var socketEmit = function (name, data, retries, onFailure) {

	// If this is the first time sending, set everything up.	
	if (retries === true) {
		retries = SOCKET_EMIT_RETRY_COUNT;
		// Clone the data so that the EID won't be copied.
		data = JSON.parse(JSON.stringify(data));
		data.EID = socketEmissionId++;
		// Keep track of the emit time so we can track latency.
		socketEmit['E' + data.EID] = new Date();
	}

	// Send the data.
	socket.send('5:::' + JSON.stringify({
		name: name,
		args: [data]
	}));

	// Set up retry timeouts if necessary.
	if (retries) {
		socketEmit['T' + data.EID] = setTimeout(function () {
			socketEmit(tag, data, retries - 1, onFailure);
		}, SOCKET_EMIT_RETRY_TIMEOUT);
	}

	// If we're out of retries, fail.
	else if (retries === 0) {
		if (onFailure) {
			onFailure();
		}
	}
};


// Set up a new connection.
socketConnect();