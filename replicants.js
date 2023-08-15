const websocketURL = nodecg.Replicant('livesplit-url', { defaultValue: "ws://127.0.0.1:8085", persistent: true });
const connected = nodecg.Replicant('livesplit-connected', { defaultValue: false, persistent: false });

const splits = nodecg.Replicant('livesplit-splits', { defaultValue: [], persistent: true });
const time = nodecg.Replicant('livesplit-time', { defaultValue: { time: "##:##", ms: "##", color: "#FFFFFF" }, persistent: false });
const infoTime = nodecg.Replicant('livesplit-infotime', { defaultValue: { name: "PB", time: "n/a" } });
