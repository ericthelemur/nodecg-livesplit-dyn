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

nodecg.listenFor("livesplit-split-add", (m) => console.log(m));

function document_AddSplit(inputname, time, delta, color) {
    if (splits.length >= splitsMaxAmount) {
        var collection = document.getElementsByClassName("split-container")
        const rem = Array.prototype.find.call(collection, (e) => !e.classList.contains("split-del-top"));
        rem.classList.add("split-del-top");
        rem.addEventListener("animationend", () => rem.remove());
        splits.shift();
    }

    var name = inputname
    const subsplit = name[0] == "-";
    if (subsplit) name = name.substring(1);

    //section name detection
    if (name.includes("{")) {
        name = name.substring(name.indexOf("{") + 1, name.indexOf("}"))
    }

    const newSplit = createElem("div", ["split-container"], undefined, undefined, [
        createElem("div", ["split-name"], name),
        createElem("div", ["split-delta"], delta, (e) => e.style.color = color),
        createElem("div", ["split-time"], time)
    ]);
    //subsplit detection
    if (subsplit) newSplit.classList.add("subsplit");

    document.getElementById("splits-container").appendChild(newSplit);
    splits[splits.length] = [name, time, delta, color];
}

function document_ResetSplits() {
    document.getElementById("splits-container").innerHTML = ""
    splits = []
}

function document_UndoSplit() {
    splits.pop();

    // Find newest split that is not in the process of animating out
    var collection = document.getElementsByClassName("split-container");
    const split = Array.prototype.findLast.call(collection, (e) => !e.classList.contains("split-del"));
    // Add delete anim and delete element on anim end
    split.classList.add("split-del");
    split.addEventListener("animationend", () => split.remove());
}