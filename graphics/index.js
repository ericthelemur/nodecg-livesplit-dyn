//DO NOT EDIT
const sMC = "█"

const splits = nodecg.Replicant('livesplit-splits');
const time = nodecg.Replicant('livesplit-time');
const infoTime = nodecg.Replicant('livesplit-infotime');

infoTime.on("change", (newval, oldval) => {
    document.getElementById("info").innerHTML = newval.name;
    document.getElementById("infotime").innerHTML = newval.time;
});

time.on("change", (newval, oldval) => {
    var element = document.getElementById("timer");
    element.innerHTML = newval.time;
    element.style.color = newval.color;
    var mselem = document.getElementById("timer-ms");
    mselem.innerHTML = newval.ms;
    mselem.style.color = newval.color;
});

// Helper function to create nested div structure
// Many JS frameworks have similar, but keeping no dependencies
function createElem(tag, classes, content = undefined, post_hook = undefined, children = []) {
    const elem = document.createElement(tag);
    for (const c of classes) {
        elem.classList.add(c);
    }
    if (content) elem.innerHTML = content;
    for (const ch of children) {
        elem.appendChild(ch);
    }
    if (post_hook) post_hook(elem);
    return elem;
}

nodecg.listenFor("livesplit-split-add", (m) => {
    const subsplit = m.name[0] == "-";
    if (subsplit) m.name = m.name.substring(1);

    //section name detection
    if (m.name.includes("{")) {
        m.name = m.name.substring(m.name.indexOf("{") + 1, m.name.indexOf("}"))
    }

    const newSplit = createElem("div", ["split-container"], undefined, undefined, [
        createElem("div", ["split-name"], m.name),
        createElem("div", ["split-delta"], m.delta, (e) => e.style.color = m.color),
        createElem("div", ["split-time"], m.time)
    ]);
    //subsplit detection
    if (subsplit) newSplit.classList.add("subsplit");

    document.getElementById("splits-container").appendChild(newSplit);
});

nodecg.listenFor("livesplit-reset", (m) => {
    document.getElementById("splits-container").innerHTML = "";
});

nodecg.listenFor("livesplit-split-del-top", (m) => {
    var collection = document.getElementsByClassName("split-container");
    const rem = Array.prototype.find.call(collection, (e) => {
        if (e.classList.contains("split-del-top")) return false;
        const name_elem = e.getElementsByClassName("split-name");
        return name_elem && name_elem[0].innerText == m;
    });
    if (rem) {
        rem.classList.add("split-del-top");
        rem.addEventListener("animationend", () => rem.remove());
    }
});

nodecg.listenFor("livesplit-undo", (m) => {
    console.log("undo " + m);
    var collection = document.getElementsByClassName("split-container");
    const rem = Array.prototype.findLast.call(collection, (e) => {
        if (e.classList.contains("split-del")) return false;
        const name_elem = e.getElementsByClassName("split-name");
        return name_elem && name_elem[0].innerText == m;
    });
    console.log(rem);
    if (rem) {
        rem.classList.add("split-del");
        rem.addEventListener("animationend", () => rem.remove());
    }
});