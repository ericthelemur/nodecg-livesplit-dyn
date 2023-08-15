const connected = nodecg.Replicant('livesplit-connected');

const splits = nodecg.Replicant('livesplit-splits', { defaultValue: [], persistent: true });
const time = nodecg.Replicant('livesplit-time', { defaultValue: { time: "##:##", ms: "##", color: "#FFFFFF" }, persistent: false });
const infoTime = nodecg.Replicant('livesplit-infotime', { defaultValue: { name: "PB", time: "n/a" } });

function connect() {
    const text = document.getElementById("urltext");
    nodecg.sendMessage('livesplit-connect', text.value);
    console.log()
}

connected.on('change', c => {
    document.getElementById("connected").innerText = c ? "Connected" : "Disconnected";
})