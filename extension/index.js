var WebSocket = require('faye-websocket');

const framerate = 15;
//DO NOT EDIT
const sMC = "█"

var websocket;
var interval;

const infoStrings = ["PB", "SoB"];
var timeStrings = ["n/a", "n/a"];
var infoPanelPointer = -1;


module.exports = function (nodecg) {
	const websocketURL = nodecg.Replicant('livesplit-url', { defaultValue: "ws://127.0.0.1:8085", persistent: true });
	const connected = nodecg.Replicant('livesplit-connected', { defaultValue: false, persistent: false });

	const splits = nodecg.Replicant('livesplit-splits', { defaultValue: [], persistent: true });
	const time = nodecg.Replicant('livesplit-time', { defaultValue: { time: "##:##", ms: "##", color: "#FFFFFF" }, persistent: false });
	const infoTime = nodecg.Replicant('livesplit-infotime', { defaultValue: { name: "PB", time: "n/a" } });

	function setupWebsocket(url) {
		nodecg.log.info("Trying to connect to LiveSplit at " + url);
		if (websocket) websocket.close();
		try {
			websocket = new WebSocket.Client(url);
		} catch (e) {
			console.log(e);
		}

		websocket.on("open", (event) => {
			nodecg.log.info("LiveSplit Connected");
			interval = setInterval(() => websocket.send("update"), 1000 / framerate);
			setInterval(cycleInfo, 5000);
			connected.value = true;
		});

		websocket.on("close", (event) => {
			nodecg.log.warn("LiveSplit Disconnected");
			if (interval != null) { clearInterval(interval) };
			connected.value = false;
		});

		websocket.on("message", (event) => {
			var message = event.data;
			var messageArray = message.split(sMC);
			// console.log(messageArray);

			if (messageArray.length > 0) {
				switch (messageArray[0]) {
					case "update":
						updateInfo(messageArray[1], messageArray[2]);
						updateTime(messageArray[3], messageArray[4], messageArray[5]);
						if (infoPanelPointer == -1) { cycleInfo(); }
						break;
					case "split":
						addSplit(messageArray[1], messageArray[2], messageArray[3], messageArray[4])
						break;
					case "undo":
						undoSplit();
						break;
					case "reset":
						resetSplits()
						break;
				}
			}
		})
	}

	function updateInfo(pb, sob) {
		timeStrings = [pb, sob];
	}

	function cycleInfo() {
		infoPanelPointer += 1
		if (infoPanelPointer == infoStrings.length) { infoPanelPointer = 0; }
		infoTime.value.name = infoStrings[infoPanelPointer];
		infoTime.value.time = timeStrings[infoPanelPointer];
	}

	function updateTime(timer, ms, color) {
		time.value = { time: timer, ms: "." + ms + "  ", color: color }
	}

	function addSplit(inputname, time, delta, color) {
		var name = inputname.trim();
		if (name.includes("}")) {
			// Push split and subsplit when end of section
			addSplit("-" + name.substring(name.indexOf("}") + 1).trim(), time, delta, color);
			name = name.substring(name.indexOf("{") + 1, name.indexOf("}"))
		}

		splits.value.push({ name: name, time: time, delta: delta, color: color });
	}

	function resetSplits() {
		splits.value = [];
	}

	function undoSplit() {
		splits.value.pop();
	}

	// Reconnect on url change
	websocketURL.on("change", (newurl, oldurl) => {
		nodecg.log.info("Changing Livesplit URL: " + newurl);
		if (newurl) setupWebsocket(newurl)
	});

	// If disconnected, retry connection
	setInterval(() => {
		if (!connected.value && websocketURL.value)
			setupWebsocket(websocketURL.value)
	}, 5 * 1000);
}