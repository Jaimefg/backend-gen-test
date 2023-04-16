export default class GeniallyNotCreated extends Error {
    constructor(name: string, reason: string) {
        super(`Genially <${name}> can't be created: ${reason}`);
    }
}
