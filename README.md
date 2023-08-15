# nodecg-livesplit-dyn

A [NodeCG](http://github.com/nodecg/nodecg) bundle for NodeCG `^1.8.0`.

The graphic provided is based on [yynaa/LiveSplit.DynamicLayout](https://github.com/yynaa/LiveSplit.DynamicLayout), and sufficient replicants are provided:

- `livesplit-url`: URL of livesplit websocket to use
- `livesplit-connected`: Whether the websocket is connected
- `livesplit-splits`: List of splits to display
- `livesplit-time`: The livesplit time - object with `time`, `ms` and `color` properties
- `livesplit-infotime`: The rotating PB/SoB display data - object with `name`, `time` properties

## Installation
1. On LiveSplit
    a. Copy `Fleck.dll` and `LiveSplit.DynamicLayout.dll` to your `LiveSplit/Components` folder
    b. Open LiveSplit, choose your layout
    c. Right-click on LiveSplit, click on `Edit Layout...`
    d. Add the `Dynamic Layout` component, located in `Other`
    e. Set the websocket port in the layout settings
2. On NodeCG
    a. Input the fully qualified websocket url (e.g. `ws://127.0.0.1:8085`)
    b. Click connect, and the display should start updating
