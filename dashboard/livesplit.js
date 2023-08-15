const connected = nodecg.Replicant('livesplit-connected');
const websocketURL = nodecg.Replicant('livesplit-url');

const splits = nodecg.Replicant('livesplit-splits');
const time = nodecg.Replicant('livesplit-time');
const infoTime = nodecg.Replicant('livesplit-infotime');

function connect() {
    const text = document.getElementById("urltext");
    websocketURL.value = text.value;
}

connected.on('change', c => {
    document.getElementById("connected").innerText = c ? "Connected" : "Disconnected";
})

NodeCG.waitForReplicants(websocketURL).then(() => {
    const btn = document.getElementById("connectbtn");
    btn.value = websocketURL.value;
    btn.addEventListener("click", connect);
});