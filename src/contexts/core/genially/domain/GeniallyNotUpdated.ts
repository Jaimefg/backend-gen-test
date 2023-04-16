export default class GeniallyNotUpdated extends Error {
    constructor(name: string, reason: string) {
        super(`Genially <${name}> can't be updated: ${reason}`);
    }
}
