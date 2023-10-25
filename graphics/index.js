//DO NOT EDIT
const sMC = "█"

// Number of splits displayed at a time
const splitsMaxAmount = 5;

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

function createSplit(m) {
    var name = String(m.name);
    const subsplit = name[0] == "-";
    if (subsplit) name = name.substring(1);

    //section name detection
    if (name.includes("{")) {
        name = name.substring(name.indexOf("{") + 1, name.indexOf("}"))
    }

    const newSplit = createElem("div", ["split-container"], undefined, undefined, [
        createElem("div", ["split-name"], name),
        createElem("div", ["split-delta"], m.delta, (e) => e.style.color = m.color),
        createElem("div", ["split-time"], m.time)
    ]);
    newSplit.dataset.name = m.name;
    //subsplit detection
    if (subsplit) newSplit.classList.add("subsplit");
    return newSplit;
}

splits.on('change', (newSplits) => {
    // On change, find diff with existing HTML and animate
    nodecg.log.info("new splits: " + newSplits);
    if (newSplits.length > splitsMaxAmount)
        newSplits = newSplits.slice(newSplits.length - splitsMaxAmount)

    var newNames = newSplits == null ? [] : newSplits.map((e) => e.name);
    console.log(newNames);
    var splitsDict = Object.assign({}, ...newSplits.map((x) => ({ [x.name]: x })));

    var cont = document.getElementById("splits-container");
    var docChildren = Array.from(cont.children)
    var docNames = docChildren == null ? [] : docChildren.map((e) => e.dataset.name);
    console.log(docNames);
    var elemsDict = Object.assign({}, ...docChildren.map((x) => ({ [x.dataset.name]: x })));

    var diff = Diff.diffArrays(docNames, newNames);
    console.log(diff);
    var i = 0;
    for (var d of diff) {
        if (d.added) {
            if (i + 1 < docNames.length) {
                for (var v of d.value) {
                    cont.insertBefore(createSplit(splitsDict[v]), elemsDict[docNames[i + 1]])
                }
            } else {
                for (var v of d.value) {
                    cont.appendChild(createSplit(splitsDict[v]))
                }
            }
        }
        else if (d.removed) {
            for (var v of d.value) {
                var rem = elemsDict[v];
                if (rem) {
                    rem.classList.add("split-del");
                    rem.addEventListener("animationend", (e) => e.target.remove());
                }
            }
            i += d.count;
        }
        else {
            i += d.count;
        }
    }

    for (var i = docChildren.length - 1; i >= 0; i--) {

    }
});