let _fetch;
export function setupFetch() {
    _fetch = fetch;
    window.fetch = function () {
        var fetchStart = new Event('fetchStart', { 'view': document, 'bubbles': true, 'cancelable': false });
        var fetchEnd = new Event('fetchEnd', { 'view': document, 'bubbles': true, 'cancelable': false });
        const fetchCall = _fetch.apply(this, arguments);
        document.dispatchEvent(fetchStart);
        fetchCall.then(() => {
            document.dispatchEvent(fetchEnd);
        }).catch(() => {
            document.dispatchEvent(fetchEnd);
        });
        return fetchCall;
    };
}
//# sourceMappingURL=spinnerFetch.js.map