const { Readable } = require('tera-data-parser/lib/protocol/stream');

module.exports = function EasyFishing(mod) {
    const command = mod.command || mod.require.command;

    let enabled = true,
        gameId = 0n;

    command.add('easyfishing', () => {
        enabled = !enabled;
        command.message(`Easy fishing is now ${enabled ? "enabled" : "disabled"}.`);
    });

    mod.hook('S_LOGIN', 10, event => {
        ({gameId} = event);
    });

    mod.hook('S_START_FISHING_MINIGAME', 'raw', (code, data) => {
        if (!enabled) return;

        const stream = new Readable(data);
        stream.position = 8;
        if (stream.uint64() === gameId) {
            data[16] = 1;
            return true;
        }
    });
}
