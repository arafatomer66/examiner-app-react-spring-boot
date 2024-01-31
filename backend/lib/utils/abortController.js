export function newAbortSignal() {
    const abortController = new AbortController();

    return [abortController, abortController.signal];
}
    