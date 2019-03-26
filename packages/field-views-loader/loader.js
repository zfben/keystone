let promiseCache = new Map();

function loadView([importer]) {
  if (promiseCache.has(importer)) {
    return promiseCache.get(importer);
  }
  let ret = importer();
  promiseCache.set(importer, ret);
  return ret;
}

export function preloadViews(views) {
  views.forEach(loadView);
}

export function readViews(views) {
  let promises = [];
  let values = [];
  views.forEach(view => {
    // eslint-disable-next-line no-undef
    if (__webpack_modules__[view.id]) {
      // eslint-disable-next-line no-undef
      return __webpack_require__(view.id);
    }
    promises.push(loadView(view));
  });
  if (promises.length) {
    throw Promise.all(promises);
  }
  return values;
}
