let promiseCache = new Map();
let valueCache = new Map();

function interopDefault(mod) {
  return mod.default ? mod.default : mod;
}

function loadView(view) {
  if (promiseCache.has(view)) {
    return promiseCache.get(view);
  }
  let thing = view();
  if (typeof thing.then === 'function') {
    let promise = thing.then(value => {
      valueCache.set(view, interopDefault(value));
    });
    promiseCache.set(view, promise);
    return promise;
  } else {
    promiseCache.set(view, Promise.resolve());
    valueCache.set(view, interopDefault(thing));
  }
}

export function preloadViews(views) {
  views.forEach(loadView);
}

export function readViews(views) {
  let promises = [];
  let values = [];
  views.forEach(view => {
    // we want to load before we try the cache because
    // the view might load synchronously
    let promise = loadView(view);
    if (valueCache.has(view)) {
      values.push(valueCache.get(view));
    } else {
      promises.push(promise);
    }
  });
  if (promises.length) {
    throw Promise.all(promises);
  }
  return values;
}
