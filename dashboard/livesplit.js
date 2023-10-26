const connected = nodecg.Replicant('livesplit-connected');
const websocketURL = nodecg.Replicant('livesplit-url');

const splits = nodecg.Replicant('livesplit-splits');
const time = nodecg.Replicant('livesplit-time');
const infoTime = nodecg.Replicant('livesplit-infotime');

function updateText(conn, url) {
    var newVal = (conn ? "✓ Connected to " : "✕ Disconnected from ") + url;
    if (conn === null) newVal = "? Disabled"
    const elem = document.getElementById("connected");
    if (elem.innerText != newVal) {
        elem.innerText = newVal;
        elem.style.color = conn ? "green" : "red";
    }
}

NodeCG.waitForReplicants(websocketURL, splits, connected).then(() => {
    connected.on('change', c => {
        updateText(c, websocketURL.value);
    })

    websocketURL.on('change', url => {
        updateText(connected.value, url);
    })
    updateText(connected.value, websocketURL.value);

    document.getElementById("urltext").value = websocketURL.value;
    document.getElementById("connectbtn").addEventListener("click", () => {
        const text = document.getElementById("urltext");
        if (connected.value === null) connected.value = false;
        websocketURL.value = text.value;
    });

    document.getElementById("clearbtn").addEventListener("click", () => {
        splits.value = [];
        nodecg.sendMessage("livesplit-reset");
    });

    document.getElementById("disablebtn").addEventListener("click", () => {
        connected.value = null;
        splits.value = [];
        nodecg.sendMessage("livesplit-reset");
    });
});