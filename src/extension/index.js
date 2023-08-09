const framerate = 15;
const splitsMaxAmount = 5;
//DO NOT EDIT
const sMC = "█"

var websocket;
var interval;

const infoStrings = ["PB", "SoB"];
var timeStrings = ["n/a", "n/a"];
var infoPanelPointer = -1;

const websocketURL = nodecg.Replicant('livesplit-url', { defaultValue: "ws://127.0.0.1:8085", persistent: true });
const connected = nodecg.Replicant('livesplit-connected', { defaultValue: false, persistent: false });

const splits = nodecg.Replicant('livesplit-splits', { defaultValue: [], persistent: true });
const time = nodecg.Replicant('livesplit-time', { defaultValue: { time: "##:##", ms: "##", color: "#FFFFFF" }, persistent: false });
const infoTime = nodecg.Replicant('livesplit-infotime', { defaultValue: { name: "PB", time: "n/a" } });

function setupWebsocket() {
	console.log("trying to connect to " + websocketURL.value);
	if (websocket) websocket.close();
	websocket = new WebSocket(websocketURL.value);

	websocket.addEventListener("open", (event) => {
		console.log("ws connected");
		interval = setInterval(() => websocket.send("update"), 1000 / framerate);
		setInterval(document_infoNext, 5000);
		connected.value = true;
	});

	websocket.addEventListener("close", (event) => {
		console.log("ws disconnected");
		if (interval != null) { clearInterval(interval) };
		connected.value = false;
	});

	websocket.addEventListener("message", (event) => {
		var message = event.data;
		var messageArray = message.split(sMC);
		// console.log(messageArray);

		if (messageArray.length > 0) {
			switch (messageArray[0]) {
				case "update":
					document_UpdateInfo(messageArray[1], messageArray[2]);
					document_UpdateTimer(messageArray[3], messageArray[4], messageArray[5]);
					if (infoPanelPointer == -1) { document_infoNext(); }
					break;
				case "split":
					document_AddSplit(messageArray[1], messageArray[2], messageArray[3], messageArray[4])
					break;
				case "undo":
					document_UndoSplit();
					break;
				case "reset":
					document_ResetSplits()
					break;
			}
		}
	})
}

function document_UpdateInfo(pb, sob) {
	timeStrings = [pb, sob];
}

function document_infoNext() {
	infoPanelPointer += 1
	if (infoPanelPointer == infoStrings.length) { infoPanelPointer = 0; }
	infoTime.value.name = infoStrings[infoPanelPointer];
	infoTime.value.time = timeStrings[infoPanelPointer];
}

function document_UpdateTimer(timer, ms, color) {
	time.value.time = timer;
	time.value.ms = "." + ms + "  ";
	time.value.color = color;
}

function document_AddSplit(inputname, time, delta, color) {
	if (splits.value.length >= splitsMaxAmount) {
		splits.value.shift();
		nodecg.sendMessage("livesplit-split-del-top", inputname);
	}

	splits.value[splits.length] = [inputname, time, delta, color];
	nodecg.sendMessage("livesplit-split-add", { name: inputname, time: time, delta: delta, color: color });
}

function document_ResetSplits() {
	splits.value = [];
	nodecg.sendMessage("livesplit-reset");
}

function document_UndoSplit() {
	const rem = splits.value.pop();
	nodecg.sendMessage("livesplit-undo", rem[0]);
}

module.exports = function (nodecg) {

	nodecg.listenFor('livesplit-connect', setupWebsocket);
};
