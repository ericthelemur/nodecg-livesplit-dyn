const connected = nodecg.Replicant('livesplit-connected');
const websocketURL = nodecg.Replicant('livesplit-url');

const splits = nodecg.Replicant('livesplit-splits');
const time = nodecg.Replicant('livesplit-time');
const infoTime = nodecg.Replicant('livesplit-infotime');

function updateText(conn, url) {
    const newVal = (conn ? "✓ Connected to " : "✕ Disconnected from ") + url;
    const elem = document.getElementById("connected");
    if (elem.innerText != newVal) {
        elem.innerText = newVal;
        elem.style.color = conn ? "green" : "red";
    }
}

connected.on('change', c => {
    updateText(c, websocketURL.value);
})

websocketURL.on('change', url => {
    updateText(connected.value, url);
})

NodeCG.waitForReplicants(websocketURL).then(() => {
    document.getElementById("urltext").value = websocketURL.value;
    document.getElementById("connectbtn").addEventListener("click", () => {
        const text = document.getElementById("urltext");
        websocketURL.value = text.value;
    });
});

NodeCG.waitForReplicants(splits).then(() => {
    document.getElementById("clearbtn").addEventListener("click", () => {
        splits.value = [];
    });
});