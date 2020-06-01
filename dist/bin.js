// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"utils/stdoutToStderrProxy.js":[function(require,module,exports) {
var process = require("process");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var OUTPUT_MODES = {
  NORMAL: "NORMAL",
  STDOUT_TO_STDERR: "STDOUT_TO_STDERR"
};

var StdoutToStderrProxy = /*#__PURE__*/function () {
  function StdoutToStderrProxy() {
    _classCallCheck(this, StdoutToStderrProxy);
  }

  _createClass(StdoutToStderrProxy, null, [{
    key: "stdoutToStderr",
    value: function stdoutToStderr() {
      process.stdout.write = function () {
        process.stderr.write.apply(process.stderr, arguments);
      };
    }
  }, {
    key: "stdoutToStderrUntilResolved",
    value: function stdoutToStderrUntilResolved(promiseToResolve) {
      if (!(promiseToResolve instanceof Promise)) {
        throw new Error("I need a promise my dear!");
      }

      StdoutToStderrProxy.stdoutToStderr();
      return promiseToResolve.then(function () {
        StdoutToStderrProxy.resetToDefault();
        return arguments;
      });
    }
  }, {
    key: "writeToActualStdout",
    value: function writeToActualStdout() {
      StdoutToStderrProxy.old_stdout_write.apply(process.stdout, arguments);
    }
  }, {
    key: "resetToDefault",
    value: function resetToDefault() {
      process.stdout.write = StdoutToStderrProxy.old_stdout_write;
    }
  }, {
    key: "onExit",
    value: function onExit(exitCode) {// console.log('exit was called with code=', exitCode);
    }
  }]);

  return StdoutToStderrProxy;
}();

_defineProperty(StdoutToStderrProxy, "currentMode", OUTPUT_MODES.NORMAL);

_defineProperty(StdoutToStderrProxy, "old_stdout_write", process.stdout.write);

process.on("exit", function (exitCode) {
  StdoutToStderrProxy.onExit(exitCode);
});
StdoutToStderrProxy.stdoutToStderr();
module.exports.StdoutToStderrProxy = StdoutToStderrProxy;
},{"process":"node_modules/process/browser.js"}],"package.json":[function(require,module,exports) {
module.exports = {
  "name": "project-butler",
  "version": "0.7.0",
  "description": "A simple but effective PM for your CLI",
  "main": "bin.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/activenode/project-butler.git"
  },
  "bin": "./bin/project-butler",
  "scripts": {
    "postinstall": "npx nexe bin.js --fakeArgv true -t 10.13.0 -o bin/bin && rm -f bin/project-butler && mv bin/bin bin/project-butler && echo '---' && bin/project-butler --install"
  },
  "author": "David Lorenz <info@activenode>",
  "license": "MIT",
  "dependencies": {
    "colors": "^1.4.0",
    "commander": "^2.9.0",
    "enquirer": "^2.3.5",
    "nexe": "^3.3.2",
    "os-homedir": "^1.0.2"
  },
  "engines": {
    "node": ">=10.9.0"
  },
  "devDependencies": {
    "parcel-bundler": "^1.12.4"
  }
};
},{}],"node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}
},{}],"node_modules/parcel-bundler/src/builtins/_empty.js":[function(require,module,exports) {

},{}],"node_modules/path-browserify/index.js":[function(require,module,exports) {
var process = require("process");
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"process":"node_modules/process/browser.js"}],"node_modules/util/support/isBufferBrowser.js":[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"node_modules/util/util.js":[function(require,module,exports) {
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = undefined || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = require('inherits');

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function () {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;
},{"./support/isBuffer":"node_modules/util/support/isBufferBrowser.js","inherits":"node_modules/util/node_modules/inherits/inherits_browser.js","process":"node_modules/process/browser.js"}],"node_modules/commander/index.js":[function(require,module,exports) {
var process = require("process");
/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var path = require('path');
var dirname = path.dirname;
var basename = path.basename;
var fs = require('fs');

/**
 * Inherit `Command` from `EventEmitter.prototype`.
 */

require('util').inherits(Command, EventEmitter);

/**
 * Expose the root command.
 */

exports = module.exports = new Command();

/**
 * Expose `Command`.
 */

exports.Command = Command;

/**
 * Expose `Option`.
 */

exports.Option = Option;

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

function Option(flags, description) {
  this.flags = flags;
  this.required = flags.indexOf('<') >= 0;
  this.optional = flags.indexOf('[') >= 0;
  this.bool = flags.indexOf('-no-') === -1;
  flags = flags.split(/[ ,|]+/);
  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || '';
}

/**
 * Return option name.
 *
 * @return {String}
 * @api private
 */

Option.prototype.name = function() {
  return this.long
    .replace('--', '')
    .replace('no-', '');
};

/**
 * Return option name, in a camelcase format that can be used
 * as a object attribute key.
 *
 * @return {String}
 * @api private
 */

Option.prototype.attributeName = function() {
  return camelcase(this.name());
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {String} arg
 * @return {Boolean}
 * @api private
 */

Option.prototype.is = function(arg) {
  return this.short === arg || this.long === arg;
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = {};
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name || '';
}

/**
 * Add command `name`.
 *
 * The `.action()` callback is invoked when the
 * command `name` is specified via __ARGV__,
 * and the remaining arguments are applied to the
 * function for access.
 *
 * When the `name` is "*" an un-matched command
 * will be passed as the first arg, followed by
 * the rest of __ARGV__ remaining.
 *
 * Examples:
 *
 *      program
 *        .version('0.0.1')
 *        .option('-C, --chdir <path>', 'change the working directory')
 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
 *        .option('-T, --no-tests', 'ignore test hook')
 *
 *      program
 *        .command('setup')
 *        .description('run remote setup commands')
 *        .action(function() {
 *          console.log('setup');
 *        });
 *
 *      program
 *        .command('exec <cmd>')
 *        .description('run the given remote command')
 *        .action(function(cmd) {
 *          console.log('exec "%s"', cmd);
 *        });
 *
 *      program
 *        .command('teardown <dir> [otherDirs...]')
 *        .description('run teardown commands')
 *        .action(function(dir, otherDirs) {
 *          console.log('dir "%s"', dir);
 *          if (otherDirs) {
 *            otherDirs.forEach(function (oDir) {
 *              console.log('dir "%s"', oDir);
 *            });
 *          }
 *        });
 *
 *      program
 *        .command('*')
 *        .description('deploy the given env')
 *        .action(function(env) {
 *          console.log('deploying "%s"', env);
 *        });
 *
 *      program.parse(process.argv);
  *
 * @param {String} name
 * @param {String} [desc] for git-style sub-commands
 * @return {Command} the new command
 * @api public
 */

Command.prototype.command = function(name, desc, opts) {
  if (typeof desc === 'object' && desc !== null) {
    opts = desc;
    desc = null;
  }
  opts = opts || {};
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());

  if (desc) {
    cmd.description(desc);
    this.executables = true;
    this._execs[cmd._name] = true;
    if (opts.isDefault) this.defaultExecutable = cmd._name;
  }
  cmd._noHelp = !!opts.noHelp;
  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;

  if (desc) return this;
  return cmd;
};

/**
 * Define argument syntax for the top-level command.
 *
 * @api public
 */

Command.prototype.arguments = function(desc) {
  return this.parseExpectedArgs(desc.split(/ +/));
};

/**
 * Add an implicit `help [cmd]` subcommand
 * which invokes `--help` for the given command.
 *
 * @api private
 */

Command.prototype.addImplicitHelpCommand = function() {
  this.command('help [cmd]', 'display help for [cmd]');
};

/**
 * Parse expected `args`.
 *
 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parseExpectedArgs = function(args) {
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg) {
    var argDetails = {
      required: false,
      name: '',
      variadic: false
    };

    switch (arg[0]) {
      case '<':
        argDetails.required = true;
        argDetails.name = arg.slice(1, -1);
        break;
      case '[':
        argDetails.name = arg.slice(1, -1);
        break;
    }

    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
      argDetails.variadic = true;
      argDetails.name = argDetails.name.slice(0, -3);
    }
    if (argDetails.name) {
      self._args.push(argDetails);
    }
  });
  return this;
};

/**
 * Register callback `fn` for the command.
 *
 * Examples:
 *
 *      program
 *        .command('help')
 *        .description('display verbose help')
 *        .action(function() {
 *           // output help here
 *        });
 *
 * @param {Function} fn
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.action = function(fn) {
  var self = this;
  var listener = function(args, unknown) {
    // Parse any so-far unknown options
    args = args || [];
    unknown = unknown || [];

    var parsed = self.parseOptions(unknown);

    // Output help if necessary
    outputHelpIfNecessary(self, parsed.unknown);

    // If there are still any unknown options, then we simply
    // die, unless someone asked for help, in which case we give it
    // to them, and then we die.
    if (parsed.unknown.length > 0) {
      self.unknownOption(parsed.unknown[0]);
    }

    // Leftover arguments need to be pushed back. Fixes issue #56
    if (parsed.args.length) args = parsed.args.concat(args);

    self._args.forEach(function(arg, i) {
      if (arg.required && args[i] == null) {
        self.missingArgument(arg.name);
      } else if (arg.variadic) {
        if (i !== self._args.length - 1) {
          self.variadicArgNotLast(arg.name);
        }

        args[i] = args.splice(i);
      }
    });

    // Always append ourselves to the end of the arguments,
    // to make sure we match the number of arguments the user
    // expects
    if (self._args.length) {
      args[self._args.length] = self;
    } else {
      args.push(self);
    }

    fn.apply(self, args);
  };
  var parent = this.parent || this;
  var name = parent === this ? '*' : this._name;
  parent.on('command:' + name, listener);
  if (this._alias) parent.on('command:' + this._alias, listener);
  return this;
};

/**
 * Define option with `flags`, `description` and optional
 * coercion `fn`.
 *
 * The `flags` string should contain both the short and long flags,
 * separated by comma, a pipe or space. The following are all valid
 * all will output this way when `--help` is used.
 *
 *    "-p, --pepper"
 *    "-p|--pepper"
 *    "-p --pepper"
 *
 * Examples:
 *
 *     // simple boolean defaulting to false
 *     program.option('-p, --pepper', 'add pepper');
 *
 *     --pepper
 *     program.pepper
 *     // => Boolean
 *
 *     // simple boolean defaulting to true
 *     program.option('-C, --no-cheese', 'remove cheese');
 *
 *     program.cheese
 *     // => true
 *
 *     --no-cheese
 *     program.cheese
 *     // => false
 *
 *     // required argument
 *     program.option('-C, --chdir <path>', 'change the working directory');
 *
 *     --chdir /tmp
 *     program.chdir
 *     // => "/tmp"
 *
 *     // optional argument
 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
 *
 * @param {String} flags
 * @param {String} description
 * @param {Function|*} [fn] or default
 * @param {*} [defaultValue]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.option = function(flags, description, fn, defaultValue) {
  var self = this,
    option = new Option(flags, description),
    oname = option.name(),
    name = option.attributeName();

  // default as 3rd arg
  if (typeof fn !== 'function') {
    if (fn instanceof RegExp) {
      var regex = fn;
      fn = function(val, def) {
        var m = regex.exec(val);
        return m ? m[0] : def;
      };
    } else {
      defaultValue = fn;
      fn = null;
    }
  }

  // preassign default value only for --no-*, [optional], or <required>
  if (!option.bool || option.optional || option.required) {
    // when --no-* we make sure default is true
    if (!option.bool) defaultValue = true;
    // preassign only if we have a default
    if (defaultValue !== undefined) {
      self[name] = defaultValue;
      option.defaultValue = defaultValue;
    }
  }

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on('option:' + oname, function(val) {
    // coercion
    if (val !== null && fn) {
      val = fn(val, self[name] === undefined ? defaultValue : self[name]);
    }

    // unassigned or bool
    if (typeof self[name] === 'boolean' || typeof self[name] === 'undefined') {
      // if no value, bool true, and we have a default, then use it!
      if (val == null) {
        self[name] = option.bool
          ? defaultValue || true
          : false;
      } else {
        self[name] = val;
      }
    } else if (val !== null) {
      // reassign
      self[name] = val;
    }
  });

  return this;
};

/**
 * Allow unknown options on the command line.
 *
 * @param {Boolean} arg if `true` or omitted, no error will be thrown
 * for unknown options.
 * @api public
 */
Command.prototype.allowUnknownOption = function(arg) {
  this._allowUnknownOption = arguments.length === 0 || arg;
  return this;
};

/**
 * Parse `argv`, settings options and invoking commands when defined.
 *
 * @param {Array} argv
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parse = function(argv) {
  // implicit help
  if (this.executables) this.addImplicitHelpCommand();

  // store raw args
  this.rawArgs = argv;

  // guess name
  this._name = this._name || basename(argv[1], '.js');

  // github-style sub-commands with no sub-command
  if (this.executables && argv.length < 3 && !this.defaultExecutable) {
    // this user needs help
    argv.push('--help');
  }

  // process argv
  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
  var args = this.args = parsed.args;

  var result = this.parseArgs(this.args, parsed.unknown);

  // executable sub-commands
  var name = result.args[0];

  var aliasCommand = null;
  // check alias of sub commands
  if (name) {
    aliasCommand = this.commands.filter(function(command) {
      return command.alias() === name;
    })[0];
  }

  if (this._execs[name] === true) {
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (aliasCommand) {
    // is alias of a subCommand
    args[0] = aliasCommand._name;
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (this.defaultExecutable) {
    // use the default subcommand
    args.unshift(this.defaultExecutable);
    return this.executeSubCommand(argv, args, parsed.unknown);
  }

  return result;
};

/**
 * Execute a sub-command executable.
 *
 * @param {Array} argv
 * @param {Array} args
 * @param {Array} unknown
 * @api private
 */

Command.prototype.executeSubCommand = function(argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) this.help();
  if (args[0] === 'help' && args.length === 1) this.help();

  // <cmd> --help
  if (args[0] === 'help') {
    args[0] = args[1];
    args[1] = '--help';
  }

  // executable
  var f = argv[1];
  // name of the subcommand, link `pm-install`
  var bin = basename(f, path.extname(f)) + '-' + args[0];

  // In case of globally installed, get the base dir where executable
  //  subcommand file should be located at
  var baseDir;

  var resolvedLink = fs.realpathSync(f);

  baseDir = dirname(resolvedLink);

  // prefer local `./<bin>` to bin in the $PATH
  var localBin = path.join(baseDir, bin);

  // whether bin file is a js script with explicit `.js` or `.ts` extension
  var isExplicitJS = false;
  if (exists(localBin + '.js')) {
    bin = localBin + '.js';
    isExplicitJS = true;
  } else if (exists(localBin + '.ts')) {
    bin = localBin + '.ts';
    isExplicitJS = true;
  } else if (exists(localBin)) {
    bin = localBin;
  }

  args = args.slice(1);

  var proc;
  if (process.platform !== 'win32') {
    if (isExplicitJS) {
      args.unshift(bin);
      // add executable arguments to spawn
      args = (process.execArgv || []).concat(args);

      proc = spawn(process.argv[0], args, { stdio: 'inherit', customFds: [0, 1, 2] });
    } else {
      proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
    }
  } else {
    args.unshift(bin);
    proc = spawn(process.execPath, args, { stdio: 'inherit' });
  }

  var signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
  signals.forEach(function(signal) {
    process.on(signal, function() {
      if (proc.killed === false && proc.exitCode === null) {
        proc.kill(signal);
      }
    });
  });
  proc.on('close', process.exit.bind(process));
  proc.on('error', function(err) {
    if (err.code === 'ENOENT') {
      console.error('error: %s(1) does not exist, try --help', bin);
    } else if (err.code === 'EACCES') {
      console.error('error: %s(1) not executable. try chmod or run with root', bin);
    }
    process.exit(1);
  });

  // Store the reference to the child process
  this.runningCommand = proc;
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @param {Array} args
 * @return {Array}
 * @api private
 */

Command.prototype.normalize = function(args) {
  var ret = [],
    arg,
    lastOpt,
    index;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (i > 0) {
      lastOpt = this.optionFor(args[i - 1]);
    }

    if (arg === '--') {
      // Honor option terminator
      ret = ret.concat(args.slice(i));
      break;
    } else if (lastOpt && lastOpt.required) {
      ret.push(arg);
    } else if (arg.length > 1 && arg[0] === '-' && arg[1] !== '-') {
      arg.slice(1).split('').forEach(function(c) {
        ret.push('-' + c);
      });
    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
      ret.push(arg.slice(0, index), arg.slice(index + 1));
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

/**
 * Parse command `args`.
 *
 * When listener(s) are available those
 * callbacks are invoked, otherwise the "*"
 * event is emitted and those actions are invoked.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api private
 */

Command.prototype.parseArgs = function(args, unknown) {
  var name;

  if (args.length) {
    name = args[0];
    if (this.listeners('command:' + name).length) {
      this.emit('command:' + args.shift(), args, unknown);
    } else {
      this.emit('command:*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);

    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {
      this.unknownOption(unknown[0]);
    }
    if (this.commands.length === 0 &&
        this._args.filter(function(a) { return a.required; }).length === 0) {
      this.emit('command:*');
    }
  }

  return this;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Command.prototype.optionFor = function(arg) {
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

/**
 * Parse options from `argv` returning `argv`
 * void of these options.
 *
 * @param {Array} argv
 * @return {Array}
 * @api public
 */

Command.prototype.parseOptions = function(argv) {
  var args = [],
    len = argv.length,
    literal,
    option,
    arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if (literal) {
      args.push(arg);
      continue;
    }

    if (arg === '--') {
      literal = true;
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (arg == null) return this.optionMissingArgument(option);
        this.emit('option:' + option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i + 1];
        if (arg == null || (arg[0] === '-' && arg !== '-')) {
          arg = null;
        } else {
          ++i;
        }
        this.emit('option:' + option.name(), arg);
      // bool
      } else {
        this.emit('option:' + option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && arg[0] === '-') {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      // If it isn't, then it'll simply be ignored
      if ((i + 1) < argv.length && argv[i + 1][0] !== '-') {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

/**
 * Return an object containing options as key-value pairs
 *
 * @return {Object}
 * @api public
 */
Command.prototype.opts = function() {
  var result = {},
    len = this.options.length;

  for (var i = 0; i < len; i++) {
    var key = this.options[i].attributeName();
    result[key] = key === this._versionOptionName ? this._version : this[key];
  }
  return result;
};

/**
 * Argument `name` is missing.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.missingArgument = function(name) {
  console.error("error: missing required argument `%s'", name);
  process.exit(1);
};

/**
 * `Option` is missing an argument, but received `flag` or nothing.
 *
 * @param {String} option
 * @param {String} flag
 * @api private
 */

Command.prototype.optionMissingArgument = function(option, flag) {
  if (flag) {
    console.error("error: option `%s' argument missing, got `%s'", option.flags, flag);
  } else {
    console.error("error: option `%s' argument missing", option.flags);
  }
  process.exit(1);
};

/**
 * Unknown option `flag`.
 *
 * @param {String} flag
 * @api private
 */

Command.prototype.unknownOption = function(flag) {
  if (this._allowUnknownOption) return;
  console.error("error: unknown option `%s'", flag);
  process.exit(1);
};

/**
 * Variadic argument with `name` is not the last argument as required.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.variadicArgNotLast = function(name) {
  console.error("error: variadic arguments must be last `%s'", name);
  process.exit(1);
};

/**
 * Set the program version to `str`.
 *
 * This method auto-registers the "-V, --version" flag
 * which will print the version number when passed.
 *
 * @param {String} str
 * @param {String} [flags]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.version = function(str, flags) {
  if (arguments.length === 0) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  var versionOption = new Option(flags, 'output the version number');
  this._versionOptionName = versionOption.long.substr(2) || 'version';
  this.options.push(versionOption);
  this.on('option:' + this._versionOptionName, function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};

/**
 * Set the description to `str`.
 *
 * @param {String} str
 * @param {Object} argsDescription
 * @return {String|Command}
 * @api public
 */

Command.prototype.description = function(str, argsDescription) {
  if (arguments.length === 0) return this._description;
  this._description = str;
  this._argsDescription = argsDescription;
  return this;
};

/**
 * Set an alias for the command
 *
 * @param {String} alias
 * @return {String|Command}
 * @api public
 */

Command.prototype.alias = function(alias) {
  var command = this;
  if (this.commands.length !== 0) {
    command = this.commands[this.commands.length - 1];
  }

  if (arguments.length === 0) return command._alias;

  if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

  command._alias = alias;
  return this;
};

/**
 * Set / get the command usage `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.usage = function(str) {
  var args = this._args.map(function(arg) {
    return humanReadableArgName(arg);
  });

  var usage = '[options]' +
    (this.commands.length ? ' [command]' : '') +
    (this._args.length ? ' ' + args.join(' ') : '');

  if (arguments.length === 0) return this._usage || usage;
  this._usage = str;

  return this;
};

/**
 * Get or set the name of the command
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.name = function(str) {
  if (arguments.length === 0) return this._name;
  this._name = str;
  return this;
};

/**
 * Return prepared commands.
 *
 * @return {Array}
 * @api private
 */

Command.prototype.prepareCommands = function() {
  return this.commands.filter(function(cmd) {
    return !cmd._noHelp;
  }).map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name +
        (cmd._alias ? '|' + cmd._alias : '') +
        (cmd.options.length ? ' [options]' : '') +
        (args ? ' ' + args : ''),
      cmd._description
    ];
  });
};

/**
 * Return the largest command length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestCommandLength = function() {
  var commands = this.prepareCommands();
  return commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);
};

/**
 * Return the largest option length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestOptionLength = function() {
  var options = [].slice.call(this.options);
  options.push({
    flags: '-h, --help'
  });
  return options.reduce(function(max, option) {
    return Math.max(max, option.flags.length);
  }, 0);
};

/**
 * Return the largest arg length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestArgLength = function() {
  return this._args.reduce(function(max, arg) {
    return Math.max(max, arg.name.length);
  }, 0);
};

/**
 * Return the pad width.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.padWidth = function() {
  var width = this.largestOptionLength();
  if (this._argsDescription && this._args.length) {
    if (this.largestArgLength() > width) {
      width = this.largestArgLength();
    }
  }

  if (this.commands && this.commands.length) {
    if (this.largestCommandLength() > width) {
      width = this.largestCommandLength();
    }
  }

  return width;
};

/**
 * Return help for options.
 *
 * @return {String}
 * @api private
 */

Command.prototype.optionHelp = function() {
  var width = this.padWidth();

  // Append the help information
  return this.options.map(function(option) {
    return pad(option.flags, width) + '  ' + option.description +
      ((option.bool && option.defaultValue !== undefined) ? ' (default: ' + JSON.stringify(option.defaultValue) + ')' : '');
  }).concat([pad('-h, --help', width) + '  ' + 'output usage information'])
    .join('\n');
};

/**
 * Return command help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.prepareCommands();
  var width = this.padWidth();

  return [
    'Commands:',
    commands.map(function(cmd) {
      var desc = cmd[1] ? '  ' + cmd[1] : '';
      return (desc ? pad(cmd[0], width) : cmd[0]) + desc;
    }).join('\n').replace(/^/gm, '  '),
    ''
  ].join('\n');
};

/**
 * Return program help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      this._description,
      ''
    ];

    var argsDescription = this._argsDescription;
    if (argsDescription && this._args.length) {
      var width = this.padWidth();
      desc.push('Arguments:');
      desc.push('');
      this._args.forEach(function(arg) {
        desc.push('  ' + pad(arg.name, width) + '  ' + argsDescription[arg.name]);
      });
      desc.push('');
    }
  }

  var cmdName = this._name;
  if (this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    'Usage: ' + cmdName + ' ' + this.usage(),
    ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    'Options:',
    '' + this.optionHelp().replace(/^/gm, '  '),
    ''
  ];

  return usage
    .concat(desc)
    .concat(options)
    .concat(cmds)
    .join('\n');
};

/**
 * Output help information for this command
 *
 * @api public
 */

Command.prototype.outputHelp = function(cb) {
  if (!cb) {
    cb = function(passthru) {
      return passthru;
    };
  }
  process.stdout.write(cb(this.helpInformation()));
  this.emit('--help');
};

/**
 * Output help information and exit.
 *
 * @api public
 */

Command.prototype.help = function(cb) {
  this.outputHelp(cb);
  process.exit();
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} command to output help for
 * @param {Array} array of options to search for -h or --help
 * @api private
 */

function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for (var i = 0; i < options.length; i++) {
    if (options[i] === '--help' || options[i] === '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']';
}

// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}

},{"events":"node_modules/events/events.js","child_process":"node_modules/parcel-bundler/src/builtins/_empty.js","path":"node_modules/path-browserify/index.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","util":"node_modules/util/util.js","process":"node_modules/process/browser.js"}],"node_modules/os-browserify/browser.js":[function(require,module,exports) {
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],"node_modules/os-homedir/index.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var os = require('os');

function homedir() {
  var env = process.env;
  var home = env.HOME;
  var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;

  if (process.platform === 'win32') {
    return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
  }

  if (process.platform === 'darwin') {
    return home || (user ? '/Users/' + user : null);
  }

  if (process.platform === 'linux') {
    return home || (process.getuid() === 0 ? '/root' : user ? '/home/' + user : null);
  }

  return home || null;
}

module.exports = typeof os.homedir === 'function' ? os.homedir : homedir;
},{"os":"node_modules/os-browserify/browser.js","process":"node_modules/process/browser.js"}],"utils/getHomeDirectory.js":[function(require,module,exports) {
var process = require("process");
var osHomedir = require("os-homedir");

var homedir = osHomedir();

if (!homedir) {
  console.error("ERROR: Home Directory could not be resolved");
  process.exit(1);
}

module.exports = homedir;
},{"os-homedir":"node_modules/os-homedir/index.js","process":"node_modules/process/browser.js"}],"config.js":[function(require,module,exports) {
var homedir = require("./utils/getHomeDirectory");

var directoryNameProjectButler = ".alclipmdata";
var dbRootDirectory = "".concat(homedir, "/").concat(directoryNameProjectButler);
var shellAliasGetterString = "project-butler -s";
var shellAliasGetterEvalString = 'eval "$(project-butler -s)';
module.exports = {
  homedir: homedir,
  database: {
    dbRootDirectory: dbRootDirectory,
    dbManagerFilePathAbsolute: "".concat(dbRootDirectory, "/storage")
  },
  shellCommands: {
    shellAliasGetterString: shellAliasGetterString,
    shellAliasGetterEvalString: shellAliasGetterEvalString
  }
};
},{"./utils/getHomeDirectory":"utils/getHomeDirectory.js"}],"db/ensureStorageExistence.js":[function(require,module,exports) {
var process = require("process");
var fs = require("fs"),
    _require = require("../config"),
    homedir = _require.homedir,
    _require$database = _require.database,
    dbRootDirectory = _require$database.dbRootDirectory,
    dbManagerFilePathAbsolute = _require$database.dbManagerFilePathAbsolute;

function ensureStorageExistence() {
  // to be honest i forgot where the name
  // "alclipm" comes from. Probably some abbreviation that i forgot.
  // maybe in the future migrate to just `.project-butler`
  function ensureFSExistence(fsPath) {
    var syncOnNotExistFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (path) {
      fs.mkdirSync(path);
    };
    var bSecondTry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (fs.existsSync(fsPath)) return;
    if (bSecondTry) throw new Error("EACCESS could not create  ".concat(fsPath));

    try {
      syncOnNotExistFunc(fsPath), ensureFSExistence(fsPath, null, true);
    } catch (e) {
      if (e.syscall && e.syscall == "mkdir") {
        console.error("".concat(fsPath, " could not be created. Make sure that ").concat(homedir, " exists and is writeable"));
      } else {
        console.error(e);
      }

      process.exit(1);
    }
  }

  ensureFSExistence(dbRootDirectory);
  ensureFSExistence(dbManagerFilePathAbsolute, function (path) {
    fs.closeSync(fs.openSync(path, "w"));
  });
}

module.exports = ensureStorageExistence;
},{"fs":"node_modules/parcel-bundler/src/builtins/_empty.js","../config":"config.js","process":"node_modules/process/browser.js"}],"io.js":[function(require,module,exports) {
var fs = require("fs");
/**
 * A function that provides a read, write and close function for a given filepath
 * @return {Object} with read, write, close methods
 */


function readWriteHelper(filePath) {
  return {
    read: function read() {
      return new Promise(function (res, rej) {
        fs.readFile(filePath, function (err, buffer) {
          if (err) rej(err);
          res(buffer);
        });
      });
    },
    write: function write(value) {
      return new Promise(function (res, rej) {
        fs.writeFile(filePath, value, function (err) {
          if (err) rej(err);
          res();
        });
      });
    },
    close: function close(fd) {
      return fs.closeSync(fd);
    }
  };
}

module.exports = {
  open: readWriteHelper
};
},{"fs":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"db/dbResultModels.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class Result (!abstract!)
 * Defines a database basic result
 */
var Result = /*#__PURE__*/function () {
  function Result() {
    _classCallCheck(this, Result);

    this.messages = {
      'info': [],
      'error': [],
      'warn': []
    };
    this.resultData = null;
  }

  _createClass(Result, [{
    key: "isError",
    value: function isError() {
      return false;
    }
  }, {
    key: "data",
    value: function data() {
      return this.resultData;
    }
  }, {
    key: "aliasesPreprocess",
    value: function aliasesPreprocess(aliasesArray) {
      return aliasesArray;
    }
  }]);

  return Result;
}();

var AddedResult = /*#__PURE__*/function (_Result) {
  _inherits(AddedResult, _Result);

  var _super = _createSuper(AddedResult);

  function AddedResult() {
    _classCallCheck(this, AddedResult);

    return _super.call(this);
  }

  _createClass(AddedResult, [{
    key: "hasWarnings",
    value: function hasWarnings() {
      return this.messages.warn.length > 0;
    }
  }, {
    key: "addWarning",
    value: function addWarning(text) {
      this.messages.warn.push({
        text: text
      });
    }
  }, {
    key: "saveProjectDetails",
    value: function saveProjectDetails(projectDetails) {
      this.resultData = projectDetails;
      return this;
    }
  }]);

  return AddedResult;
}(Result);
/**
 * Represents an error as result
 */


var ErrorResult = /*#__PURE__*/function (_Result2) {
  _inherits(ErrorResult, _Result2);

  var _super2 = _createSuper(ErrorResult);

  function ErrorResult() {
    _classCallCheck(this, ErrorResult);

    return _super2.call(this);
  }

  _createClass(ErrorResult, [{
    key: "isError",
    value: function isError() {
      return true;
    }
  }, {
    key: "getErrors",
    value: function getErrors() {
      return this.messages.error;
    }
  }, {
    key: "addError",
    value: function addError(text, childMessages) {
      if (arguments.length === 1) {
        this.messages.error.push({
          text: text
        });
      } else {
        childMessages = childMessages && !Array.isArray(childMessages) ? [childMessages] : childMessages;
        this.messages.error.push({
          text: text,
          childMessages: childMessages
        });
      }

      return this;
    }
  }]);

  return ErrorResult;
}(Result);

var ExactProjectResult = /*#__PURE__*/function (_Result3) {
  _inherits(ExactProjectResult, _Result3);

  var _super3 = _createSuper(ExactProjectResult);

  /**
   * @param {Object} project - the project details object
   */
  function ExactProjectResult(project) {
    var _this;

    _classCallCheck(this, ExactProjectResult);

    _this = _super3.call(this);
    _this.resultData = project;
    /** { absPath: string, directoryName: string} */

    return _this;
  }

  _createClass(ExactProjectResult, [{
    key: "getPath",
    value: function getPath() {
      return this.data().absPath;
    }
  }]);

  return ExactProjectResult;
}(Result);

var ProjectListResult = /*#__PURE__*/function (_Result4) {
  _inherits(ProjectListResult, _Result4);

  var _super4 = _createSuper(ProjectListResult);

  /**
   * @param {Array<Object>} listOfProjects
   */
  function ProjectListResult(listOfProjects) {
    var _this2;

    _classCallCheck(this, ProjectListResult);

    _this2 = _super4.call(this);
    _this2.resultData = listOfProjects;
    return _this2;
  }

  _createClass(ProjectListResult, [{
    key: "title",
    get: function get() {
      return 'Available projects:';
    }
  }]);

  return ProjectListResult;
}(Result);

var SearchProjectListResult = /*#__PURE__*/function (_ProjectListResult) {
  _inherits(SearchProjectListResult, _ProjectListResult);

  var _super5 = _createSuper(SearchProjectListResult);

  function SearchProjectListResult(projectListResult, _ref) {
    var _this3;

    var searchString = _ref.searchString;

    _classCallCheck(this, SearchProjectListResult);

    _this3 = _super5.call(this, projectListResult.resultData);
    _this3.searchString = searchString;
    return _this3;
  }

  _createClass(SearchProjectListResult, [{
    key: "aliasesPreprocess",
    value: function aliasesPreprocess(aliasesArray) {
      var _this4 = this;

      return aliasesArray.filter(function (sAlias) {
        return sAlias.includes(_this4.searchString);
      });
    }
  }, {
    key: "title",
    get: function get() {
      return "Found multiple matches for '".concat(this.searchString, "', please specify:");
    }
  }]);

  return SearchProjectListResult;
}(ProjectListResult);

var ProjectProposalResult = /*#__PURE__*/function (_ProjectListResult2) {
  _inherits(ProjectProposalResult, _ProjectListResult2);

  var _super6 = _createSuper(ProjectProposalResult);

  /**
   * @param {Array<Object>} listOfProjects
   * @param {String} searchString - The string the project proposals are based on
   */
  function ProjectProposalResult(listOfProjects, searchString) {
    _classCallCheck(this, ProjectProposalResult);

    return _super6.call(this, listOfProjects);
  }

  return ProjectProposalResult;
}(ProjectListResult);

var CommandWrapper = /*#__PURE__*/function () {
  function CommandWrapper(command) {
    _classCallCheck(this, CommandWrapper);

    this.command = command;
  }

  _createClass(CommandWrapper, [{
    key: "toString",
    value: function toString() {
      return this.command;
    }
  }]);

  return CommandWrapper;
}();

module.exports = {
  ErrorResult: ErrorResult,
  ProjectListResult: ProjectListResult,
  SearchProjectListResult: SearchProjectListResult,
  ProjectProposalResult: ProjectProposalResult,
  ExactProjectResult: ExactProjectResult,
  AddedResult: AddedResult,
  CommandWrapper: CommandWrapper
};
},{}],"db/database.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("./dbResultModels"),
    ErrorResult = _require.ErrorResult,
    ProjectListResult = _require.ProjectListResult,
    SearchProjectListResult = _require.SearchProjectListResult,
    ExactProjectResult = _require.ExactProjectResult,
    AddedResult = _require.AddedResult;

var log = function log() {
  console.log(Array.from(arguments));
};

log.json = function (_logdata) {
  return log(JSON.stringify(_logdata));
};

var PATH_DELIMITER = ":";
var EMPTY_STRUCT = {
  projects: {
    quickRef: {}
  },
  _settings: {
    _i: 0
  }
};

function err(error) {
  var childMessages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var errorResult = new ErrorResult().addError(error, childMessages);
  return errorResult;
}

function getKeysFromMap(m) {
  return Array.from(m || new Map()).map(function (keyValueArr) {
    return keyValueArr[0];
  });
}

function matchesInArray(searchString, arr) {
  return arr.filter(function (value) {
    if (value.replace(searchString, "") !== value) {
      // contained it, return with TRUE
      return true;
    }

    return false;
  });
}

var ProjectDatabase = /*#__PURE__*/function () {
  /**
   * @param {Object} fileHandler - io object with read/write option
   * @param {String} pathSeparator - The os-dependend separator
   */
  function ProjectDatabase(fileHandler, pathSeparator) {
    _classCallCheck(this, ProjectDatabase);

    if (!pathSeparator) throw new Error("pathSeparator needs to be defined");
    this.fileHandler = fileHandler;
    this.pathSeparator = pathSeparator;
    this.lastRead = null; //initializing it for readability reasons. will be overwritten w/ next line

    this.load(true); //will call the read() function on fileHandler and write on lastRead

    this.setupEmptyMaps();
  }

  _createClass(ProjectDatabase, [{
    key: "setupEmptyMaps",
    value: function setupEmptyMaps() {
      this.indexToProject = new Map(); //backmapping to indexes to reference projects

      this.aliasesToIndex = new Map();
      this.absPathToIndex = new Map();
      this.uidToIndex = new Map();
      this.indexToUid = new Map();
    }
    /**
     * Will output aliases and projects
     */

  }, {
    key: "debug",
    value: function () {
      var _debug = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this = this;

        var uids, curr;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.load();

              case 2:
                log("-------------------");
                this.aliasesToIndex.forEach(function (key, value) {
                  log("Alias [".concat(value, "] mapped to ").concat(_this.indexToProject.get(key).absPath));
                });
                log("");
                log("-------------------");
                uids = this.uidToIndex.keys();
                curr = uids.next();

              case 8:
                if (curr.done) {
                  _context.next = 17;
                  break;
                }

                _context.t0 = log;
                _context.next = 12;
                return this.getProjectDetailsByUID(curr.value);

              case 12:
                _context.t1 = _context.sent;
                (0, _context.t0)(_context.t1);
                curr = uids.next();
                _context.next = 8;
                break;

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function debug() {
        return _debug.apply(this, arguments);
      }

      return debug;
    }()
    /**
     * Will fetch all available projects
     * @return {Promise<ProjectListResult>}
     */

  }, {
    key: "fetchAll",
    value: function () {
      var _fetchAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uidsPrefiltered) {
        var _this2 = this;

        var uids;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.load();

              case 2:
                uids = Array.isArray(uidsPrefiltered) ? uidsPrefiltered : Array.from(this.uidToIndex.keys());
                return _context2.abrupt("return", Promise.all(uids.map(function (uid) {
                  return _this2.getProjectDetailsByUID(uid);
                })).then(function (projectDetailsArray) {
                  return new ProjectListResult(projectDetailsArray);
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetchAll(_x) {
        return _fetchAll.apply(this, arguments);
      }

      return fetchAll;
    }()
    /**
     * Will save all data to the file by simply stringifying it
     * @return {Promise<Object>} promise with the data of the saved object
     */

  }, {
    key: "save",
    value: function save() {
      var _this3 = this;

      return function (newDataObj) {
        return _this3.fileHandler.write(JSON.stringify(newDataObj)).then(function (_) {
          //ensuring that access to lastRead will deal with the new data
          _this3.lastRead = Promise.resolve(newDataObj); //-> instead of this.load() => perf+

          return newDataObj;
        });
      };
    }
    /**
     * @description will read the file-contents and parse it to an object.
     * If no file contents are given it will provide an empty valid struct object.
     * @param {Boolean} bForceFileLoad - if true then a file io will be enforced
     * @return {Promise<String>}
     */

  }, {
    key: "load",
    value: function load(bForceFileIO) {
      var _this4 = this;

      if (!bForceFileIO && this.lastRead) return this.lastRead;
      this.lastRead = this.fileHandler.read().then(function (contents) {
        if (!contents) throw new Error("No content yet");
        return JSON.parse(contents);
      }).catch(function (readError) {
        return EMPTY_STRUCT;
      }).then(function (data) {
        return _this4.parseData(data);
      });
      return this.lastRead;
    }
    /**
     * @description generates unique Id by absPath and directoryName
     * @param {String} absPath
     * @param {String} directoryName
     */

  }, {
    key: "uid",
    value: function uid(absPath, directoryName) {
      return "".concat(directoryName).concat(PATH_DELIMITER).concat(absPath);
    }
    /**
     * parseData will make sure that the project object
     * is mapped to the temporary storage and easily accessible.
     * @param {Object} dataStruct
     */

  }, {
    key: "parseData",
    value: function parseData(dataStruct) {
      var _this5 = this;

      this.setupEmptyMaps();
      Object.keys(dataStruct.projects.quickRef).forEach(function (uid, index) {
        var _uid$split = uid.split(PATH_DELIMITER),
            _uid$split2 = _slicedToArray(_uid$split, 2),
            directoryName = _uid$split2[0],
            absPath = _uid$split2[1];

        _this5.indexToProject.set(index, {
          absPath: absPath,
          directoryName: directoryName
        });

        _this5.uidToIndex.set(uid, index);

        _this5.indexToUid.set(index, uid);

        _this5.absPathToIndex.set(absPath, index);

        dataStruct.projects.quickRef[uid].aliases.forEach(function (alias) {
          return _this5.aliasesToIndex.set(alias, index);
        });
      });
      return Promise.resolve(dataStruct);
    }
    /**
     * @description Will return all project-related data via uid of the project
     * @return {Promise<Object>}
     */

  }, {
    key: "getProjectDetailsByUID",
    value: function () {
      var _getProjectDetailsByUID = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(uid) {
        var _this6 = this;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", this.load().then(function (_ref) {
                  var quickRef = _ref.projects.quickRef;

                  var projectData = _this6.indexToProject.get(_this6.uidToIndex.get(uid));

                  projectData.aliases = quickRef[uid].aliases;
                  return projectData;
                }));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getProjectDetailsByUID(_x2) {
        return _getProjectDetailsByUID.apply(this, arguments);
      }

      return getProjectDetailsByUID;
    }()
  }, {
    key: "getExactProjectResultByAlias",
    value: function getExactProjectResultByAlias(sAlias) {
      var _this7 = this;

      return this.load().then(function (_) {
        return new ExactProjectResult(_this7.indexToProject.get(_this7.aliasesToIndex.get(sAlias)));
      });
    }
  }, {
    key: "getExactProjectResultByAbsoluteDirectory",
    value: function getExactProjectResultByAbsoluteDirectory(sAbsoluteDirectoryPath) {
      var _this8 = this;

      return this.load().then(function (_) {
        var absoluteDirectoryIndex = _this8.absPathToIndex.get(sAbsoluteDirectoryPath);

        if (typeof absoluteDirectoryIndex !== "number") {
          return null;
        } else {
          return new ExactProjectResult(_this8.indexToProject.get(absoluteDirectoryIndex));
        }
      });
    }
    /**
     * Will search for a best match. E.g. `cl` would match `cli` and return an exact
     * but if there is `cli` and `cla` then it would just return Proposals
     * @param {string} searchString
     */

  }, {
    key: "findNextBestMatch",
    value: function findNextBestMatch(searchString) {
      var _this9 = this;

      return this.load().then(function (_) {
        var foundMatches = matchesInArray(searchString, getKeysFromMap(_this9.aliasesToIndex));

        if (foundMatches.length === 0) {
          return err("No match found for '".concat(searchString, "'"));
        } else if (foundMatches.length === 1) {
          // well we got an exact result so lets go back to the old function :)
          return _this9.getExactProjectResultByAlias(foundMatches[0]);
        } // else: lets return the found proposals
        // but: if all found proposals (even if multiple) were pointing to the same directory
        // => exact match!


        var allFoundMatchesAsIndices = foundMatches.map(function (sAlias) {
          return _this9.aliasesToIndex.get(sAlias);
        });
        var bAllMatchesPointToSame = allFoundMatchesAsIndices.every(function (index) {
          return index === allFoundMatchesAsIndices[0];
        });

        if (bAllMatchesPointToSame) {
          return _this9.getExactProjectResultByAlias(foundMatches[0]);
        } // else: list all found occurences
        // now we need to convert indices to uids as indices cannot be
        // mapped to ProjectListResults


        var uids = [];
        allFoundMatchesAsIndices.forEach(function (iIndex) {
          var uid = _this9.indexToUid.get(iIndex);

          if (!uids.includes(uid)) {
            uids.push(uid);
          }
        });
        return _this9.fetchAll(uids).then(function (projectListResult) {
          return new SearchProjectListResult(projectListResult, {
            searchString: searchString
          });
        });
      });
    }
  }, {
    key: "findBestMatch",
    value: function findBestMatch(searchString) {
      var _this10 = this;

      //examples:
      // 1. search string: emb
      // -> result: test-emb-test/ from absPath mapping should be matched.
      // -> if multiple matches are available then list and ask to specify term
      return this.load().then(function (_) {
        if (_this10.aliasesToIndex.has(searchString)) {
          return _this10.getExactProjectResultByAlias(searchString);
        }

        return _this10.findNextBestMatch(searchString);
      });
    }
    /**
     * @desc checks given aliases and maps it to its project directories if existing
     * @param {Array<String>} aliases
     * @param {Object} options - excludePath can be set to ignore aliases with this path
     * @return {Promise<Array<String>>}
     */

  }, {
    key: "mapExistingAliasesWithProjectDirs",
    value: function () {
      var _mapExistingAliasesWithProjectDirs = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(aliasesArray, options) {
        var _this11 = this;

        var aliasesInUse;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.load();

              case 2:
                options = options || {};

                if (Array.isArray(aliasesArray)) {
                  _context4.next = 5;
                  break;
                }

                throw new Error("Please provide an array of aliases");

              case 5:
                aliasesInUse = aliasesArray.filter(function (alias) {
                  return _this11.aliasesToIndex.has(alias);
                }).map(function (alias) {
                  var _this11$indexToProjec = _this11.indexToProject.get(_this11.aliasesToIndex.get(alias)),
                      absPath = _this11$indexToProjec.absPath;

                  return options.excludePath && absPath === options.excludePath ? null : {
                    alias: alias,
                    absPath: absPath
                  };
                }).filter(function (obj) {
                  return obj !== null;
                });
                return _context4.abrupt("return", aliasesInUse.length > 0 ? aliasesInUse : null);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function mapExistingAliasesWithProjectDirs(_x3, _x4) {
        return _mapExistingAliasesWithProjectDirs.apply(this, arguments);
      }

      return mapExistingAliasesWithProjectDirs;
    }()
    /**
     * Adds a project with its aliases
     * @param {String} absPath
     * @param {Array<String>} aliases
     */

  }, {
    key: "addProject",
    value: function () {
      var _addProject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(absPath, aliases) {
        var _this12 = this;

        var directoryName, uid, aliasesInUse, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                //addProject(..) will add directoryName as alias automatically if the alias is not yet occupied
                directoryName = absPath.split(this.pathSeparator).pop();
                uid = this.uid(absPath, directoryName);

                if (!Array.isArray(aliases) || aliases.length === 0) {
                  aliases = [directoryName];
                }

                aliases = aliases.map(function (sAlias) {
                  return sAlias.toLowerCase();
                });
                _context5.next = 6;
                return this.mapExistingAliasesWithProjectDirs(aliases, {
                  excludePath: absPath
                });

              case 6:
                aliasesInUse = _context5.sent;

                if (!aliasesInUse) {
                  _context5.next = 9;
                  break;
                }

                return _context5.abrupt("return", new ErrorResult().addError("The following aliases are already in use", aliasesInUse.map(function (aliasObj) {
                  return "".concat(aliasObj.alias, " => ").concat(aliasObj.absPath);
                })));

              case 9:
                //----else:------------
                result = new AddedResult();
                return _context5.abrupt("return", this.load(true).then(function (obj) {
                  var aliasesToWrite = [];

                  if (obj.projects.quickRef[uid]) {
                    result.addWarning("Info: Project already exists, will merge the definitions now.");
                    aliasesToWrite = [].concat(obj.projects.quickRef[uid].aliases);
                  }

                  aliases.forEach(function (alias) {
                    if (!aliasesToWrite.includes(alias)) {
                      aliasesToWrite.push(alias);
                    }
                  });
                  obj.projects.quickRef[uid] = {
                    aliases: aliasesToWrite
                  };
                  return _this12.parseData(obj).then(_this12.save()).then(function () {
                    return _this12.getProjectDetailsByUID(uid);
                  }).then(function (projectDetails) {
                    return result.saveProjectDetails(projectDetails);
                  });
                }));

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function addProject(_x5, _x6) {
        return _addProject.apply(this, arguments);
      }

      return addProject;
    }()
    /**
     * Remove aliases. Also removes project if a the boolean param is set to true
     * @param {Array<String>} aliases
     * @param {Boolean} bDeleteAll
     */

  }, {
    key: "removeByAliases",
    value: function () {
      var _removeByAliases = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(aliases, bDeleteAll) {
        var _this13 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.load().then(function (obj) {
                  var existingAliases = (Array.isArray(aliases) ? aliases : []).filter(function (sAlias) {
                    return _this13.aliasesToIndex.has(sAlias);
                  });

                  if (!existingAliases.length) {
                    return err("None of the given aliases could be found");
                  }

                  var affectedUidsArr = Array.from(existingAliases.reduce(function (oSet, sAlias) {
                    oSet.add(_this13.indexToUid.get(_this13.aliasesToIndex.get(sAlias)));
                    return oSet;
                  }, new Set()));
                  affectedUidsArr.forEach(function (uid) {
                    if (obj.projects.quickRef[uid]) {
                      if (bDeleteAll) {
                        delete obj.projects.quickRef[uid];
                      } else {
                        // only remove the aliases given
                        obj.projects.quickRef[uid].aliases = obj.projects.quickRef[uid].aliases.filter(function (sAlias) {
                          return !existingAliases.includes(sAlias);
                        });

                        if (obj.projects.quickRef[uid].aliases.length === 0) {
                          delete obj.projects.quickRef[uid];
                        }
                      }
                    }
                  });
                  return _this13.parseData(obj).then(_this13.save()).then(function () {
                    return _this13.fetchAll();
                  });
                }));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function removeByAliases(_x7, _x8) {
        return _removeByAliases.apply(this, arguments);
      }

      return removeByAliases;
    }()
    /**
     * Remove a project with its aliases by its directory
     * @param {String} absPath
     */

  }, {
    key: "removeByDirectory",
    value: function () {
      var _removeByDirectory = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(absPath) {
        var _this14 = this;

        var directoryName, uid;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                //addProject(..) will add directoryName as alias automatically if the alias is not yet occupied
                directoryName = absPath.split(this.pathSeparator).pop();
                uid = this.uid(absPath, directoryName);
                return _context7.abrupt("return", this.load().then(function (obj) {
                  if (!obj.projects.quickRef[uid]) {
                    return err("Directory '".concat(absPath, "' is not stored."));
                  }

                  delete obj.projects.quickRef[uid];
                  return _this14.parseData(obj).then(_this14.save()).then(function () {
                    return _this14.fetchAll();
                  });
                }));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function removeByDirectory(_x9) {
        return _removeByDirectory.apply(this, arguments);
      }

      return removeByDirectory;
    }()
  }]);

  return ProjectDatabase;
}();

module.exports = function hydrateDatabase(fileHandler, pathSeparator) {
  return new ProjectDatabase(fileHandler, pathSeparator);
};
},{"./dbResultModels":"db/dbResultModels.js"}],"db/getDatabaseManager.js":[function(require,module,exports) {
var io = require("../io"),
    _require = require("path"),
    separator = _require.sep,
    config = require("../config"),
    hydrateDatabase = require("./database");

module.exports = function () {
  var _databaseConnection;

  return function () {
    if (!_databaseConnection) {
      var databaseFile = io.open(config.database.dbManagerFilePathAbsolute);
      _databaseConnection = hydrateDatabase(databaseFile, separator);
    }

    return _databaseConnection;
  };
}();
},{"../io":"io.js","path":"node_modules/path-browserify/index.js","../config":"config.js","./database":"db/database.js"}],"shell/shellset.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BASH_STYLES = {
  none: '\\033[0m',
  underline: '\\033[4m',
  red: '\\033[0;31m',
  cyan: '\\033[0;36m',
  yellow: '\\033[0;43m',
  bgBlack: '\\e[100m',
  bold: '\\033[1m',
  white: '\\033[0;37m'
};

function generateLineBreaks(numLineBreaks) {
  return Array.apply(null, {
    length: numLineBreaks
  }).map(function () {
    return '\\n';
  }).join('');
}

var ShellCd = /*#__PURE__*/function () {
  function ShellCd(path) {
    _classCallCheck(this, ShellCd);

    this.path = path;
  }

  _createClass(ShellCd, [{
    key: "toString",
    value: function toString() {
      return "cd ".concat(this.path);
    }
  }]);

  return ShellCd;
}();

var ShellRaw = /*#__PURE__*/function () {
  function ShellRaw(rawCommand) {
    _classCallCheck(this, ShellRaw);

    this.rawCommand = rawCommand;
  }

  _createClass(ShellRaw, [{
    key: "toString",
    value: function toString() {
      return this.rawCommand;
    }
  }]);

  return ShellRaw;
}();
/**
 * Echo Shell command
 */


var ShellEcho = /*#__PURE__*/function () {
  function ShellEcho(msg, type) {
    _classCallCheck(this, ShellEcho);

    this.message = msg;
    this.type = type;
  }

  _createClass(ShellEcho, [{
    key: "toString",
    value: function toString(mode) {
      var prefixString = '';

      if (this.type === 'error') {
        prefixString = '[ERROR] ';
      }

      return "printf \"".concat(BASH_STYLES.bold).concat(prefixString).concat(this.message).concat(BASH_STYLES.none, "\"");
    }
  }]);

  return ShellEcho;
}();

var ShellSet = /*#__PURE__*/function () {
  function ShellSet() {
    _classCallCheck(this, ShellSet);

    this.cmdSet = [];
  }

  _createClass(ShellSet, [{
    key: "addRaw",
    value: function addRaw(rawCommand) {
      if (!rawCommand) {
        return;
      }

      this.cmdSet.push(new ShellRaw(rawCommand));
    }
  }, {
    key: "addCd",
    value: function addCd(path) {
      this.cmdSet.push(new ShellCd(path));
    }
  }, {
    key: "addMessage",
    value: function addMessage(msg) {
      this.cmdSet.push(new ShellEcho(msg));
    }
  }, {
    key: "stringBuilder",
    value: function stringBuilder(inpStr) {
      if (!inpStr) inpStr = '';
      return {
        acc: inpStr ? inpStr : '',
        plain: function plain(str) {
          this.acc += "".concat(inpStr).concat(BASH_STYLES.none).concat(str);
          return this;
        },
        bold: function bold(str) {
          this.acc += "".concat(inpStr).concat(BASH_STYLES.bold).concat(str);
          return this;
        },
        underline: function underline(str) {
          this.acc += "".concat(inpStr).concat(BASH_STYLES.underline).concat(str);
          return this;
        },
        break: function _break(num) {
          num = num ? num : 1;
          this.acc += generateLineBreaks(num);
          return this;
        },
        each: function each(array, iterFunc) {
          var _this = this;

          array.forEach(function (item, index) {
            iterFunc(item, index, _this);
          });
          return this;
        },
        build: function build() {
          return this.acc;
        }
      };
    }
  }, {
    key: "addErrorMessage",
    value: function addErrorMessage(msg) {
      this.cmdSet.push(new ShellEcho(msg, 'error'));
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.cmdSet.map(function (cmd, index) {
        return cmd.toString(index % 2);
      }).join(' && ');
    }
  }]);

  return ShellSet;
}();

module.exports = ShellSet;
},{}],"utils/butlerrc.js":[function(require,module,exports) {
function readButlerRc(absPath) {
  try {
    var butlerRcConfig = require(absPath);

    return butlerRcConfig || {};
  } catch (e) {
    console.error('.butlerrc.js read failed!');
    return null;
  }
}

module.exports.readButlerRc = readButlerRc;
},{}],"shell/shellify.js":[function(require,module,exports) {
var className = function className(o) {
  return o.__proto__.constructor.name;
};

var ShellSet = require("./shellset");

var fs = require("fs");

var _require = require("../utils/butlerrc.js"),
    readButlerRc = _require.readButlerRc;

function shellify(resultInstance) {
  var objType = className(resultInstance);
  var shell = new ShellSet();
  var shellString = shell.stringBuilder();

  if (objType === "CommandWrapper") {
    shell.addRaw(resultInstance.toString());
  } else if (objType === "ProjectListResult" || objType === "SearchProjectListResult") {
    shell.addMessage(shellString.underline("").bold(resultInstance.title).plain("").break(2).each(resultInstance.data(), function (item, index, _) {
      _.plain("".concat(index + 1, ") ").concat(item.absPath)).break().plain("··").plain(" Aliases: ").bold("[".concat(resultInstance.aliasesPreprocess(item.aliases).join(", "), "]")).break(2);
    }).build());
  } else if (objType === "ExactProjectResult") {
    var lookupButlerRc = "".concat(resultInstance.getPath(), "/.butlerrc.js");
    var rcFileExists = fs.existsSync(lookupButlerRc);
    shell.addCd(resultInstance.getPath());

    if (rcFileExists) {
      var butlerRcConfig = readButlerRc(lookupButlerRc);

      if (butlerRcConfig !== null) {
        if (butlerRcConfig.open && typeof butlerRcConfig.open === "function") {
          shell.addRaw(butlerRcConfig.open());
        }
      }
    }
  } else if (objType === "AddedResult") {
    var _resultInstance$data = resultInstance.data(),
        aliases = _resultInstance$data.aliases,
        absPath = _resultInstance$data.absPath;

    shell.addMessage(shellString.plain("Aliases for").break().bold(absPath).plain("").break().each(aliases, function (alias, i, _) {
      _.plain("\xB7 ".concat(alias)).break();
    }).build());
  } else if (objType === "ErrorResult") {
    shell.addMessage(shellString.each(resultInstance.getErrors(), function (_ref, index, _) {
      var text = _ref.text,
          childMessages = _ref.childMessages;

      _.bold("".concat(text).concat(childMessages && childMessages.length ? ":" : ""));

      if (childMessages && Array.isArray(childMessages)) {
        _.break(1);

        _.each(childMessages, function (msg, i, __) {
          __.plain("\xB7\xB7\xB7\xB7  ".concat(msg));
        });

        _.break();
      }
    }).build());
  }

  return "#shell\n".concat(shell.toString());
}

module.exports = function (StdoutToStderrProxy) {
  return function () {
    var shellifiedResult = shellify.apply(void 0, arguments);
    StdoutToStderrProxy.writeToActualStdout(shellifiedResult);
    return shellifiedResult;
  };
};
},{"./shellset":"shell/shellset.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","../utils/butlerrc.js":"utils/butlerrc.js"}],"cli/addProject.js":[function(require,module,exports) {
var process = require("process");
var path = require("path"),
    _require = require("../utils/stdoutToStderrProxy"),
    StdoutToStderrProxy = _require.StdoutToStderrProxy,
    shellify = require("../shell/shellify")(StdoutToStderrProxy),
    getCWD = process.cwd;

module.exports = function (cli, db) {
  cli.command("add [aliases...]").option("-d, --dir [path]", "Directory to add. Default: CWD").description("Adds current directory.").action(function (aliases, cmd) {
    var absPath = path.resolve(cmd.dir || getCWD());
    db.addProject(absPath, aliases).then(shellify);
  });
};
},{"path":"node_modules/path-browserify/index.js","../utils/stdoutToStderrProxy":"utils/stdoutToStderrProxy.js","../shell/shellify":"shell/shellify.js","process":"node_modules/process/browser.js"}],"cli/removeProject.js":[function(require,module,exports) {
var process = require("process");
var path = require("path"),
    _require = require("../utils/stdoutToStderrProxy"),
    StdoutToStderrProxy = _require.StdoutToStderrProxy,
    shellify = require("../shell/shellify")(StdoutToStderrProxy),
    getCWD = process.cwd;

module.exports = function (cli, db) {
  cli.command("remove [aliases...]").option("-a, --all", "If --all param is set it will completely remove the directory from the list with all its aliases").description("If no alias is provided it will try to delete all aliases from your current directory").action(function (aliases, cmd) {
    var absPath = path.resolve(getCWD());

    if (!aliases || aliases.length === 0) {
      db.removeByDirectory(absPath).then(shellify);
    } else {
      db.removeByAliases(aliases, cmd.all).then(shellify);
    }
  });
};
},{"path":"node_modules/path-browserify/index.js","../utils/stdoutToStderrProxy":"utils/stdoutToStderrProxy.js","../shell/shellify":"shell/shellify.js","process":"node_modules/process/browser.js"}],"utils/readJson.js":[function(require,module,exports) {
var fs = require('fs');

function readJson(file) {
  try {
    var jsonFileContents = fs.readFileSync(file);
    return JSON.parse(jsonFileContents);
  } catch (e) {
    return null;
  }
}

module.exports = readJson;
},{"fs":"node_modules/parcel-bundler/src/builtins/_empty.js"}],"utils/parsePackageJson.js":[function(require,module,exports) {
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var readJson = require('./readJson');

function parsePackageJson(packageJsonPath) {
  var jsonObj = readJson(packageJsonPath);

  var packageJson = _objectSpread({}, jsonObj);

  packageJson.getScript = function (scriptName) {
    if (packageJson.scripts && packageJson.scripts[scriptName]) {
      return packageJson.scripts[scriptName];
    } else {
      return null;
    }
  };

  return packageJson;
}

module.exports = parsePackageJson;
},{"./readJson":"utils/readJson.js"}],"cli/openProjectOrCallCommand.js":[function(require,module,exports) {
var process = require("process");
var path = require("path"),
    _require = require("../utils/stdoutToStderrProxy"),
    StdoutToStderrProxy = _require.StdoutToStderrProxy,
    shellify = require("../shell/shellify")(StdoutToStderrProxy),
    _require2 = require("../db/dbResultModels"),
    CommandWrapper = _require2.CommandWrapper,
    parsePackageJson = require("../utils/parsePackageJson"),
    getCWD = process.cwd;

module.exports = function (cli, db) {
  var tryOpenProjectByAliasOrName = function tryOpenProjectByAliasOrName(aliasOrName) {
    db.findBestMatch(aliasOrName).then(shellify);
  };

  var openProjectOrCallAction = function openProjectOrCallAction(projectNameOrAction, currentWorkingDirectoryAbsPath) {
    // check if we currently are in a working directory that
    // is in our database (so its a project-butler project)
    // if yes first check if there is npm commands to run
    // we might consider at a later point to genericify the tool (npm, yarn, whatever)
    // but for now npm should be okay
    db.getExactProjectResultByAbsoluteDirectory(currentWorkingDirectoryAbsPath).then(function (projectResult) {
      var bCommandCalled = false;

      if (projectResult) {
        // got a hit. is already in a project-butler directory right now
        // lets check if there is a package json with scripts
        var packageJson = parsePackageJson("".concat(currentWorkingDirectoryAbsPath, "/package.json"));
        var potentialNpmScriptToExecute = packageJson.getScript(projectNameOrAction);

        if (potentialNpmScriptToExecute) {
          bCommandCalled = true;
          shellify(new CommandWrapper("npm run ".concat(projectNameOrAction)));
        }
      }

      if (!bCommandCalled) {
        // didnt find any fitting command so search for project-fit
        tryOpenProjectByAliasOrName(projectNameOrAction);
      }
    });
  };

  cli.command("cd [alias]").description("Open project").action(function (alias) {
    return tryOpenProjectByAliasOrName(alias);
  });
  cli.command("*").description("Open project or trigger action").action(function (projectNameOrAction, cmd) {
    if (projectNameOrAction) {
      openProjectOrCallAction(projectNameOrAction, path.resolve(getCWD()));
    }
  });
};
},{"path":"node_modules/path-browserify/index.js","../utils/stdoutToStderrProxy":"utils/stdoutToStderrProxy.js","../shell/shellify":"shell/shellify.js","../db/dbResultModels":"db/dbResultModels.js","../utils/parsePackageJson":"utils/parsePackageJson.js","process":"node_modules/process/browser.js"}],"assets/shellscript.string.js":[function(require,module,exports) {
module.exports = "p () {\n    RESULT=$(project-butler \"$@\")\n\n    if [ $? -ne 0 ]; then\n        echo \"(project-butler) ERROR\"\n    else\n        case \"$RESULT\" in\n            \\#shell*)   eval \"$RESULT\" ;;\n            *)   echo \"$RESULT\" ;;\n        esac\n    fi\n}\n";
},{}],"cli/commandless/shellScript.js":[function(require,module,exports) {
var _require = require("../../utils/stdoutToStderrProxy"),
    StdoutToStderrProxy = _require.StdoutToStderrProxy;

module.exports = function (cli, db, flags, next) {
  if (flags.shellScript === true) {
    StdoutToStderrProxy.writeToActualStdout(require("../../assets/shellscript.string"));
  } else {
    next();
  }
};
},{"../../utils/stdoutToStderrProxy":"utils/stdoutToStderrProxy.js","../../assets/shellscript.string":"assets/shellscript.string.js"}],"node_modules/colors/lib/styles.js":[function(require,module,exports) {
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var styles = {};
module['exports'] = styles;
var codes = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],
  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],
  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],
  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]
};
Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});
},{}],"node_modules/colors/lib/system/has-flag.js":[function(require,module,exports) {
var process = require("process");
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict';

module.exports = function (flag, argv) {
  argv = argv || process.argv;
  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);
  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};
},{"process":"node_modules/process/browser.js"}],"node_modules/colors/lib/system/supports-colors.js":[function(require,module,exports) {
var process = require("process");
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
'use strict';

var os = require('os');

var hasFlag = require('./has-flag.js');

var env = process.env;
var forceColor = void 0;

if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
  forceColor = true;
}

if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');

    if (Number(process.versions.node.split('.')[0]) >= 8 && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function (sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;

      case 'Hyper':
        return 3;

      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  var level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr)
};
},{"os":"node_modules/os-browserify/browser.js","./has-flag.js":"node_modules/colors/lib/system/has-flag.js","process":"node_modules/process/browser.js"}],"node_modules/colors/lib/custom/trap.js":[function(require,module,exports) {
module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc', '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd', '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240']
  };
  text.forEach(function (c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);

    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};
},{}],"node_modules/colors/lib/custom/zalgo.js":[function(require,module,exports) {
// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'],
    'down': ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣'],
    'mid': ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', ' ҉']
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function (i) {
      bool = i === character;
    });
    return bool;
  }

  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] = typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] = typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] = typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] = typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');

    for (l in text) {
      if (isChar(l)) {
        continue;
      }

      result = result + text[l];
      counts = {
        'up': 0,
        'down': 0,
        'mid': 0
      };

      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;

        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;

        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];

      for (var d in arr) {
        var index = arr[d];

        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }

    return result;
  } // don't summon him


  return heComes(text, options);
};
},{}],"node_modules/colors/lib/maps/america.js":[function(require,module,exports) {
module['exports'] = function (colors) {
  return function (letter, i, exploded) {
    if (letter === ' ') return letter;

    switch (i % 3) {
      case 0:
        return colors.red(letter);

      case 1:
        return colors.white(letter);

      case 2:
        return colors.blue(letter);
    }
  };
};
},{}],"node_modules/colors/lib/maps/zebra.js":[function(require,module,exports) {
module['exports'] = function (colors) {
  return function (letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};
},{}],"node_modules/colors/lib/maps/rainbow.js":[function(require,module,exports) {
module['exports'] = function (colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function (letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};
},{}],"node_modules/colors/lib/maps/random.js":[function(require,module,exports) {
module['exports'] = function (colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed', 'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function (letter, i, exploded) {
    return letter === ' ' ? letter : colors[available[Math.round(Math.random() * (available.length - 2))]](letter);
  };
};
},{}],"node_modules/colors/lib/colors.js":[function(require,module,exports) {
/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var colors = {};
module['exports'] = colors;
colors.themes = {};

var util = require('util');

var ansiStyles = colors.styles = require('./styles');

var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);
colors.supportsColor = require('./system/supports-colors').supportsColor;

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function () {
  colors.enabled = true;
};

colors.disable = function () {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function (str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
}; // eslint-disable-next-line no-unused-vars


var stylize = colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str + '';
  }

  var styleMap = ansiStyles[style]; // Stylize should work for non-ANSI styles, too

  if (!styleMap && style in colors) {
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };

  builder._styles = _styles; // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.

  builder.__proto__ = proto;
  return builder;
}

var styles = function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
}();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);
  var str = args.map(function (arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;
  var nestedStyles = this._styles;
  var i = nestedStyles.length;

  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;

    if (newLinesPresent) {
      str = str.replace(newLineRegex, function (match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' + 'If you are trying to set a theme from a file, it is now your (the ' + 'caller\'s) responsibility to require the file.  The old syntax ' + 'looked like colors.setTheme(__dirname + ' + '\'/../themes/generic-logging.js\'); The new syntax looks like ' + 'colors.setTheme(require(__dirname + ' + '\'/../themes/generic-logging.js\'));');
    return;
  }

  for (var style in theme) {
    (function (style) {
      colors[style] = function (str) {
        if (typeof theme[style] === 'object') {
          var out = str;

          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }

          return out;
        }

        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
}; // custom formatter methods


colors.trap = require('./custom/trap');
colors.zalgo = require('./custom/zalgo'); // maps

colors.maps = {};
colors.maps.america = require('./maps/america')(colors);
colors.maps.zebra = require('./maps/zebra')(colors);
colors.maps.rainbow = require('./maps/rainbow')(colors);
colors.maps.random = require('./maps/random')(colors);

for (var map in colors.maps) {
  (function (map) {
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());
},{"util":"node_modules/util/util.js","./styles":"node_modules/colors/lib/styles.js","./system/supports-colors":"node_modules/colors/lib/system/supports-colors.js","./custom/trap":"node_modules/colors/lib/custom/trap.js","./custom/zalgo":"node_modules/colors/lib/custom/zalgo.js","./maps/america":"node_modules/colors/lib/maps/america.js","./maps/zebra":"node_modules/colors/lib/maps/zebra.js","./maps/rainbow":"node_modules/colors/lib/maps/rainbow.js","./maps/random":"node_modules/colors/lib/maps/random.js"}],"node_modules/colors/safe.js":[function(require,module,exports) {
//
// Remark: Requiring this file will use the "safe" colors API,
// which will not touch String.prototype.
//
//   var colors = require('colors/safe');
//   colors.red("foo")
//
//
var colors = require('./lib/colors');

module['exports'] = colors;
},{"./lib/colors":"node_modules/colors/lib/colors.js"}],"node_modules/object-assign/index.js":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"node_modules/assert/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports) {
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"node_modules/assert/node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"node_modules/assert/node_modules/util/util.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = undefined || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = require('inherits');

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
},{"./support/isBuffer":"node_modules/assert/node_modules/util/support/isBufferBrowser.js","inherits":"node_modules/assert/node_modules/inherits/inherits_browser.js","process":"node_modules/process/browser.js"}],"node_modules/assert/assert.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"object-assign":"node_modules/object-assign/index.js","util/":"node_modules/assert/node_modules/util/util.js"}],"node_modules/ansi-colors/symbols.js":[function(require,module,exports) {
var process = require("process");
'use strict';

var isWindows = process.platform === 'win32';
var isLinux = process.platform === 'linux';
var windows = {
  bullet: '•',
  check: '√',
  cross: '×',
  ellipsis: '...',
  heart: '❤',
  info: 'i',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionSmall: '﹖',
  pointer: '>',
  pointerSmall: '»',
  warning: '‼'
};
var other = {
  ballotCross: '✘',
  bullet: '•',
  check: '✔',
  cross: '✖',
  ellipsis: '…',
  heart: '❤',
  info: 'ℹ',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  warning: '⚠'
};
module.exports = isWindows ? windows : other;
Reflect.defineProperty(module.exports, 'windows', {
  enumerable: false,
  value: windows
});
Reflect.defineProperty(module.exports, 'other', {
  enumerable: false,
  value: other
});
},{"process":"node_modules/process/browser.js"}],"node_modules/ansi-colors/index.js":[function(require,module,exports) {
var process = require("process");

'use strict';

var colors = {
  enabled: true,
  visible: true,
  styles: {},
  keys: {}
};

if ('FORCE_COLOR' in process.env) {
  colors.enabled = undefined !== '0';
}

var ansi = function (style) {
  style.open = "\x1B[".concat(style.codes[0], "m");
  style.close = "\x1B[".concat(style.codes[1], "m");
  style.regex = new RegExp("\\u001b\\[".concat(style.codes[1], "m"), 'g');
  return style;
};

var wrap = function (style, str, nl) {
  var {
    open: open,
    close: close,
    regex: regex
  } = style;
  str = open + (str.includes(close) ? str.replace(regex, close + open) : str) + close; // see https://github.com/chalk/chalk/pull/92, thanks to the
  // chalk contributors for this fix. However, we've confirmed that
  // this issue is also present in Windows terminals

  return nl ? str.replace(/\r?\n/g, "".concat(close, "$&").concat(open)) : str;
};

var style = function (input, stack) {
  if (input === '' || input == null) return '';
  if (colors.enabled === false) return input;
  if (colors.visible === false) return '';
  var str = '' + input;
  var nl = str.includes('\n');
  var n = stack.length;

  while (n-- > 0) {
    str = wrap(colors.styles[stack[n]], str, nl);
  }

  return str;
};

var define = function (name, codes, type) {
  colors.styles[name] = ansi({
    name: name,
    codes: codes
  });
  var t = colors.keys[type] || (colors.keys[type] = []);
  t.push(name);
  Reflect.defineProperty(colors, name, {
    get: function () {
      var color = function (input) {
        return style(input, color.stack);
      };

      Reflect.setPrototypeOf(color, colors);
      color.stack = this.stack ? this.stack.concat(name) : [name];
      return color;
    }
  });
};

define('reset', [0, 0], 'modifier');
define('bold', [1, 22], 'modifier');
define('dim', [2, 22], 'modifier');
define('italic', [3, 23], 'modifier');
define('underline', [4, 24], 'modifier');
define('inverse', [7, 27], 'modifier');
define('hidden', [8, 28], 'modifier');
define('strikethrough', [9, 29], 'modifier');
define('black', [30, 39], 'color');
define('red', [31, 39], 'color');
define('green', [32, 39], 'color');
define('yellow', [33, 39], 'color');
define('blue', [34, 39], 'color');
define('magenta', [35, 39], 'color');
define('cyan', [36, 39], 'color');
define('white', [37, 39], 'color');
define('gray', [90, 39], 'color');
define('grey', [90, 39], 'color');
define('bgBlack', [40, 49], 'bg');
define('bgRed', [41, 49], 'bg');
define('bgGreen', [42, 49], 'bg');
define('bgYellow', [43, 49], 'bg');
define('bgBlue', [44, 49], 'bg');
define('bgMagenta', [45, 49], 'bg');
define('bgCyan', [46, 49], 'bg');
define('bgWhite', [47, 49], 'bg');
define('blackBright', [90, 39], 'bright');
define('redBright', [91, 39], 'bright');
define('greenBright', [92, 39], 'bright');
define('yellowBright', [93, 39], 'bright');
define('blueBright', [94, 39], 'bright');
define('magentaBright', [95, 39], 'bright');
define('cyanBright', [96, 39], 'bright');
define('whiteBright', [97, 39], 'bright');
define('bgBlackBright', [100, 49], 'bgBright');
define('bgRedBright', [101, 49], 'bgBright');
define('bgGreenBright', [102, 49], 'bgBright');
define('bgYellowBright', [103, 49], 'bgBright');
define('bgBlueBright', [104, 49], 'bgBright');
define('bgMagentaBright', [105, 49], 'bgBright');
define('bgCyanBright', [106, 49], 'bgBright');
define('bgWhiteBright', [107, 49], 'bgBright');
/* eslint-disable no-control-regex */
// this is a modified, optimized version of
// https://github.com/chalk/ansi-regex (MIT License)

var re = colors.ansiRegex = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;

colors.hasColor = colors.hasAnsi = function (str) {
  re.lastIndex = 0;
  return !!str && typeof str === 'string' && re.test(str);
};

colors.unstyle = function (str) {
  re.lastIndex = 0;
  return typeof str === 'string' ? str.replace(re, '') : str;
};

colors.none = colors.clear = colors.noop = function (str) {
  return str;
}; // no-op, for programmatic usage


colors.stripColor = colors.unstyle;
colors.symbols = require('./symbols');
colors.define = define;
module.exports = colors;
},{"./symbols":"node_modules/ansi-colors/symbols.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/utils.js":[function(require,module,exports) {
var process = require("process");
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var toString = Object.prototype.toString;

var colors = require('ansi-colors');

var called = false;
var fns = [];
var complements = {
  'yellow': 'blue',
  'cyan': 'red',
  'green': 'magenta',
  'black': 'white',
  'blue': 'yellow',
  'red': 'cyan',
  'magenta': 'green',
  'white': 'black'
};

exports.longest = function (arr, prop) {
  return arr.reduce(function (a, v) {
    return Math.max(a, prop ? v[prop].length : v.length);
  }, 0);
};

exports.hasColor = function (str) {
  return !!str && colors.hasColor(str);
};

var isObject = exports.isObject = function (val) {
  return val !== null && _typeof(val) === 'object' && !Array.isArray(val);
};

exports.nativeType = function (val) {
  return toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, '');
};

exports.isAsyncFn = function (val) {
  return exports.nativeType(val) === 'asyncfunction';
};

exports.isPrimitive = function (val) {
  return val != null && _typeof(val) !== 'object' && typeof val !== 'function';
};

exports.resolve = function (context, value) {
  if (typeof value === 'function') {
    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    return value.call.apply(value, [context].concat(rest));
  }

  return value;
};

exports.scrollDown = function () {
  var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return [].concat(_toConsumableArray(choices.slice(1)), [choices[0]]);
};

exports.scrollUp = function () {
  var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return [choices.pop()].concat(_toConsumableArray(choices));
};

exports.reorder = function () {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var res = arr.slice();
  res.sort(function (a, b) {
    if (a.index > b.index) return 1;
    if (a.index < b.index) return -1;
    return 0;
  });
  return res;
};

exports.swap = function (arr, index, pos) {
  var len = arr.length;
  var idx = pos === len ? 0 : pos < 0 ? len - 1 : pos;
  var choice = arr[index];
  arr[index] = arr[idx];
  arr[idx] = choice;
};

exports.width = function (stream) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 80;
  var columns = stream && stream.columns ? stream.columns : fallback;

  if (stream && typeof stream.getWindowSize === 'function') {
    columns = stream.getWindowSize()[0];
  }

  if (process.platform === 'win32') {
    return columns - 1;
  }

  return columns;
};

exports.height = function (stream) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
  var rows = stream && stream.rows ? stream.rows : fallback;

  if (stream && typeof stream.getWindowSize === 'function') {
    rows = stream.getWindowSize()[1];
  }

  return rows;
};

exports.wordWrap = function (str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!str) return str;

  if (typeof options === 'number') {
    options = {
      width: options
    };
  }

  var _options = options,
      _options$indent = _options.indent,
      indent = _options$indent === void 0 ? '' : _options$indent,
      _options$newline = _options.newline,
      newline = _options$newline === void 0 ? '\n' + indent : _options$newline,
      _options$width = _options.width,
      width = _options$width === void 0 ? 80 : _options$width;
  var spaces = (newline + indent).match(/[^\S\n]/g) || [];
  width -= spaces.length;
  var source = ".{1,".concat(width, "}([\\s\\u200B]+|$)|[^\\s\\u200B]+?([\\s\\u200B]+|$)");
  var output = str.trim();
  var regex = new RegExp(source, 'g');
  var lines = output.match(regex) || [];
  lines = lines.map(function (line) {
    return line.replace(/\n$/, '');
  });
  if (options.padEnd) lines = lines.map(function (line) {
    return line.padEnd(width, ' ');
  });
  if (options.padStart) lines = lines.map(function (line) {
    return line.padStart(width, ' ');
  });
  return indent + lines.join(newline);
};

exports.unmute = function (color) {
  var name = color.stack.find(function (n) {
    return colors.keys.color.includes(n);
  });

  if (name) {
    return colors[name];
  }

  var bg = color.stack.find(function (n) {
    return n.slice(2) === 'bg';
  });

  if (bg) {
    return colors[name.slice(2)];
  }

  return function (str) {
    return str;
  };
};

exports.pascal = function (str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
};

exports.inverse = function (color) {
  if (!color || !color.stack) return color;
  var name = color.stack.find(function (n) {
    return colors.keys.color.includes(n);
  });

  if (name) {
    var col = colors['bg' + exports.pascal(name)];
    return col ? col.black : color;
  }

  var bg = color.stack.find(function (n) {
    return n.slice(0, 2) === 'bg';
  });

  if (bg) {
    return colors[bg.slice(2).toLowerCase()] || color;
  }

  return colors.none;
};

exports.complement = function (color) {
  if (!color || !color.stack) return color;
  var name = color.stack.find(function (n) {
    return colors.keys.color.includes(n);
  });
  var bg = color.stack.find(function (n) {
    return n.slice(0, 2) === 'bg';
  });

  if (name && !bg) {
    return colors[complements[name] || name];
  }

  if (bg) {
    var lower = bg.slice(2).toLowerCase();
    var comp = complements[lower];
    if (!comp) return color;
    return colors['bg' + exports.pascal(comp)] || color;
  }

  return colors.none;
};

exports.meridiem = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  var hrs = hours === 0 ? 12 : hours;
  var min = minutes < 10 ? '0' + minutes : minutes;
  return hrs + ':' + min + ' ' + ampm;
};
/**
 * Set a value on the given object.
 * @param {Object} obj
 * @param {String} prop
 * @param {any} value
 */


exports.set = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var val = arguments.length > 2 ? arguments[2] : undefined;
  return prop.split('.').reduce(function (acc, k, i, arr) {
    var value = arr.length - 1 > i ? acc[k] || {} : val;
    if (!exports.isObject(value) && i < arr.length - 1) value = {};
    return acc[k] = value;
  }, obj);
};
/**
 * Get a value from the given object.
 * @param {Object} obj
 * @param {String} prop
 */


exports.get = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var fallback = arguments.length > 2 ? arguments[2] : undefined;
  var value = obj[prop] == null ? prop.split('.').reduce(function (acc, k) {
    return acc && acc[k];
  }, obj) : obj[prop];
  return value == null ? fallback : value;
};

exports.mixin = function (target, b) {
  if (!isObject(target)) return b;
  if (!isObject(b)) return target;

  for (var _i = 0, _Object$keys = Object.keys(b); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var desc = Object.getOwnPropertyDescriptor(b, key);

    if (desc.hasOwnProperty('value')) {
      if (target.hasOwnProperty(key) && isObject(desc.value)) {
        var existing = Object.getOwnPropertyDescriptor(target, key);

        if (isObject(existing.value)) {
          target[key] = exports.merge({}, target[key], b[key]);
        } else {
          Reflect.defineProperty(target, key, desc);
        }
      } else {
        Reflect.defineProperty(target, key, desc);
      }
    } else {
      Reflect.defineProperty(target, key, desc);
    }
  }

  return target;
};

exports.merge = function () {
  var target = {};

  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  for (var _i2 = 0, _args = args; _i2 < _args.length; _i2++) {
    var ele = _args[_i2];
    exports.mixin(target, ele);
  }

  return target;
};

exports.mixinEmitter = function (obj, emitter) {
  var proto = emitter.constructor.prototype;

  for (var _i3 = 0, _Object$keys2 = Object.keys(proto); _i3 < _Object$keys2.length; _i3++) {
    var key = _Object$keys2[_i3];
    var val = proto[key];

    if (typeof val === 'function') {
      exports.define(obj, key, val.bind(emitter));
    } else {
      exports.define(obj, key, val);
    }
  }
};

exports.onExit = function (callback) {
  var onExit = function onExit(quit, code) {
    if (called) return;
    called = true;
    fns.forEach(function (fn) {
      return fn();
    });

    if (quit === true) {
      process.exit(128 + code);
    }
  };

  if (fns.length === 0) {
    process.once('SIGTERM', onExit.bind(null, true, 15));
    process.once('SIGINT', onExit.bind(null, true, 2));
    process.once('exit', onExit);
  }

  fns.push(callback);
};

exports.define = function (obj, key, value) {
  Reflect.defineProperty(obj, key, {
    value: value
  });
};

exports.defineExport = function (obj, key, fn) {
  var custom;
  Reflect.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set: function set(val) {
      custom = val;
    },
    get: function get() {
      return custom ? custom() : fn();
    }
  });
};
},{"ansi-colors":"node_modules/ansi-colors/index.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/combos.js":[function(require,module,exports) {
'use strict';
/**
 * Actions are mappings from keypress event names to method names
 * in the prompts.
 */

exports.ctrl = {
  a: 'first',
  b: 'backward',
  c: 'cancel',
  d: 'deleteForward',
  e: 'last',
  f: 'forward',
  g: 'reset',
  i: 'tab',
  k: 'cutForward',
  l: 'reset',
  n: 'newItem',
  m: 'cancel',
  j: 'submit',
  p: 'search',
  r: 'remove',
  s: 'save',
  u: 'undo',
  w: 'cutLeft',
  x: 'toggleCursor',
  v: 'paste'
};
exports.shift = {
  up: 'shiftUp',
  down: 'shiftDown',
  left: 'shiftLeft',
  right: 'shiftRight',
  tab: 'prev'
};
exports.fn = {
  up: 'pageUp',
  down: 'pageDown',
  left: 'pageLeft',
  right: 'pageRight',
  delete: 'deleteForward'
}; // <alt> on Windows

exports.option = {
  b: 'backward',
  f: 'forward',
  d: 'cutRight',
  left: 'cutLeft',
  up: 'altUp',
  down: 'altDown'
};
exports.keys = {
  pageup: 'pageUp',
  // <fn>+<up> (mac), <Page Up> (windows)
  pagedown: 'pageDown',
  // <fn>+<down> (mac), <Page Down> (windows)
  home: 'home',
  // <fn>+<left> (mac), <home> (windows)
  end: 'end',
  // <fn>+<right> (mac), <end> (windows)
  cancel: 'cancel',
  delete: 'deleteForward',
  backspace: 'delete',
  down: 'down',
  enter: 'submit',
  escape: 'cancel',
  left: 'left',
  space: 'space',
  number: 'number',
  return: 'submit',
  right: 'right',
  tab: 'next',
  up: 'up'
};
},{}],"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/node-libs-browser/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/node-libs-browser/node_modules/buffer/index.js"}],"node_modules/enquirer/lib/keypress.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
var process = require("process");
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var readline = require('readline');

var combos = require('./combos');
/* eslint-disable no-control-regex */


var metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
var fnKeyRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
var keyName = {
  /* xterm/gnome ESC O letter */
  'OP': 'f1',
  'OQ': 'f2',
  'OR': 'f3',
  'OS': 'f4',

  /* xterm/rxvt ESC [ number ~ */
  '[11~': 'f1',
  '[12~': 'f2',
  '[13~': 'f3',
  '[14~': 'f4',

  /* from Cygwin and used in libuv */
  '[[A': 'f1',
  '[[B': 'f2',
  '[[C': 'f3',
  '[[D': 'f4',
  '[[E': 'f5',

  /* common */
  '[15~': 'f5',
  '[17~': 'f6',
  '[18~': 'f7',
  '[19~': 'f8',
  '[20~': 'f9',
  '[21~': 'f10',
  '[23~': 'f11',
  '[24~': 'f12',

  /* xterm ESC [ letter */
  '[A': 'up',
  '[B': 'down',
  '[C': 'right',
  '[D': 'left',
  '[E': 'clear',
  '[F': 'end',
  '[H': 'home',

  /* xterm/gnome ESC O letter */
  'OA': 'up',
  'OB': 'down',
  'OC': 'right',
  'OD': 'left',
  'OE': 'clear',
  'OF': 'end',
  'OH': 'home',

  /* xterm/rxvt ESC [ number ~ */
  '[1~': 'home',
  '[2~': 'insert',
  '[3~': 'delete',
  '[4~': 'end',
  '[5~': 'pageup',
  '[6~': 'pagedown',

  /* putty */
  '[[5~': 'pageup',
  '[[6~': 'pagedown',

  /* rxvt */
  '[7~': 'home',
  '[8~': 'end',

  /* rxvt keys with modifiers */
  '[a': 'up',
  '[b': 'down',
  '[c': 'right',
  '[d': 'left',
  '[e': 'clear',
  '[2$': 'insert',
  '[3$': 'delete',
  '[5$': 'pageup',
  '[6$': 'pagedown',
  '[7$': 'home',
  '[8$': 'end',
  'Oa': 'up',
  'Ob': 'down',
  'Oc': 'right',
  'Od': 'left',
  'Oe': 'clear',
  '[2^': 'insert',
  '[3^': 'delete',
  '[5^': 'pageup',
  '[6^': 'pagedown',
  '[7^': 'home',
  '[8^': 'end',

  /* misc. */
  '[Z': 'tab'
};

function isShiftKey(code) {
  return ['[a', '[b', '[c', '[d', '[e', '[2$', '[3$', '[5$', '[6$', '[7$', '[8$', '[Z'].includes(code);
}

function isCtrlKey(code) {
  return ['Oa', 'Ob', 'Oc', 'Od', 'Oe', '[2^', '[3^', '[5^', '[6^', '[7^', '[8^'].includes(code);
}

var keypress = function keypress() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var parts;

  var key = _objectSpread({
    name: event.name,
    ctrl: false,
    meta: false,
    shift: false,
    option: false,
    sequence: s,
    raw: s
  }, event);

  if (Buffer.isBuffer(s)) {
    if (s[0] > 127 && s[1] === void 0) {
      s[0] -= 128;
      s = '\x1b' + String(s);
    } else {
      s = String(s);
    }
  } else if (s !== void 0 && typeof s !== 'string') {
    s = String(s);
  } else if (!s) {
    s = key.sequence || '';
  }

  key.sequence = key.sequence || s || key.name;

  if (s === '\r') {
    // carriage return
    key.raw = void 0;
    key.name = 'return';
  } else if (s === '\n') {
    // enter, should have been called linefeed
    key.name = 'enter';
  } else if (s === '\t') {
    // tab
    key.name = 'tab';
  } else if (s === '\b' || s === '\x7f' || s === '\x1b\x7f' || s === '\x1b\b') {
    // backspace or ctrl+h
    key.name = 'backspace';
    key.meta = s.charAt(0) === '\x1b';
  } else if (s === '\x1b' || s === '\x1b\x1b') {
    // escape key
    key.name = 'escape';
    key.meta = s.length === 2;
  } else if (s === ' ' || s === '\x1b ') {
    key.name = 'space';
    key.meta = s.length === 2;
  } else if (s <= '\x1a') {
    // ctrl+letter
    key.name = String.fromCharCode(s.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
    key.ctrl = true;
  } else if (s.length === 1 && s >= '0' && s <= '9') {
    // number
    key.name = 'number';
  } else if (s.length === 1 && s >= 'a' && s <= 'z') {
    // lowercase letter
    key.name = s;
  } else if (s.length === 1 && s >= 'A' && s <= 'Z') {
    // shift+letter
    key.name = s.toLowerCase();
    key.shift = true;
  } else if (parts = metaKeyCodeRe.exec(s)) {
    // meta+character key
    key.meta = true;
    key.shift = /^[A-Z]$/.test(parts[1]);
  } else if (parts = fnKeyRe.exec(s)) {
    var segs = _toConsumableArray(s);

    if (segs[0] === "\x1B" && segs[1] === "\x1B") {
      key.option = true;
    } // ansi escape sequence
    // reassemble the key code leaving out leading \x1b's,
    // the modifier key bitflag and any meaningless "1;" sequence


    var code = [parts[1], parts[2], parts[4], parts[6]].filter(Boolean).join('');
    var modifier = (parts[3] || parts[5] || 1) - 1; // Parse the key modifier

    key.ctrl = !!(modifier & 4);
    key.meta = !!(modifier & 10);
    key.shift = !!(modifier & 1);
    key.code = code;
    key.name = keyName[code];
    key.shift = isShiftKey(code) || key.shift;
    key.ctrl = isCtrlKey(code) || key.ctrl;
  }

  return key;
};

keypress.listen = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var onKeypress = arguments.length > 1 ? arguments[1] : undefined;
  var stdin = options.stdin;

  if (!stdin || stdin !== process.stdin && !stdin.isTTY) {
    throw new Error('Invalid stream passed');
  }

  var rl = readline.createInterface({
    terminal: true,
    input: stdin
  });
  readline.emitKeypressEvents(stdin, rl);

  var on = function on(buf, key) {
    return onKeypress(buf, keypress(buf, key), rl);
  };

  var isRaw = stdin.isRaw;
  if (stdin.isTTY) stdin.setRawMode(true);
  stdin.on('keypress', on);
  rl.resume();

  var off = function off() {
    if (stdin.isTTY) stdin.setRawMode(isRaw);
    stdin.removeListener('keypress', on);
    rl.pause();
    rl.close();
  };

  return off;
};

keypress.action = function (buf, key, customActions) {
  var obj = _objectSpread(_objectSpread({}, combos), customActions);

  if (key.ctrl) {
    key.action = obj.ctrl[key.name];
    return key;
  }

  if (key.option && obj.option) {
    key.action = obj.option[key.name];
    return key;
  }

  if (key.shift) {
    key.action = obj.shift[key.name];
    return key;
  }

  key.action = obj.keys[key.name];
  return key;
};

module.exports = keypress;
},{"readline":"node_modules/parcel-bundler/src/builtins/_empty.js","./combos":"node_modules/enquirer/lib/combos.js","buffer":"node_modules/node-libs-browser/node_modules/buffer/index.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/timer.js":[function(require,module,exports) {
'use strict';

module.exports = function (prompt) {
  prompt.timers = prompt.timers || {};
  var timers = prompt.options.timers;
  if (!timers) return;

  for (var _i = 0, _Object$keys = Object.keys(timers); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    var opts = timers[key];

    if (typeof opts === 'number') {
      opts = {
        interval: opts
      };
    }

    create(prompt, key, opts);
  }
};

function create(prompt, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var timer = prompt.timers[name] = {
    name: name,
    start: Date.now(),
    ms: 0,
    tick: 0
  };
  var ms = options.interval || 120;
  timer.frames = options.frames || [];
  timer.loading = true;
  var interval = setInterval(function () {
    timer.ms = Date.now() - timer.start;
    timer.tick++;
    prompt.render();
  }, ms);

  timer.stop = function () {
    timer.loading = false;
    clearInterval(interval);
  };

  Reflect.defineProperty(timer, 'interval', {
    value: interval
  });
  prompt.once('close', function () {
    return timer.stop();
  });
  return timer.stop;
}
},{}],"node_modules/enquirer/lib/state.js":[function(require,module,exports) {

var process = require("process");
var Buffer = require("buffer").Buffer;
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./utils'),
    define = _require.define,
    width = _require.width;

var State = /*#__PURE__*/function () {
  function State(prompt) {
    _classCallCheck(this, State);

    var options = prompt.options;
    define(this, '_prompt', prompt);
    this.type = prompt.type;
    this.name = prompt.name;
    this.message = '';
    this.header = '';
    this.footer = '';
    this.error = '';
    this.hint = '';
    this.input = '';
    this.cursor = 0;
    this.index = 0;
    this.lines = 0;
    this.tick = 0;
    this.prompt = '';
    this.buffer = '';
    this.width = width(options.stdout || process.stdout);
    Object.assign(this, options);
    this.name = this.name || this.message;
    this.message = this.message || this.name;
    this.symbols = prompt.symbols;
    this.styles = prompt.styles;
    this.required = new Set();
    this.cancelled = false;
    this.submitted = false;
  }

  _createClass(State, [{
    key: "clone",
    value: function clone() {
      var state = _objectSpread({}, this);

      state.status = this.status;
      state.buffer = Buffer.from(state.buffer);
      delete state.clone;
      return state;
    }
  }, {
    key: "color",
    set: function set(val) {
      this._color = val;
    },
    get: function get() {
      var styles = this.prompt.styles;
      if (this.cancelled) return styles.cancelled;
      if (this.submitted) return styles.submitted;
      var color = this._color || styles[this.status];
      return typeof color === 'function' ? color : styles.pending;
    }
  }, {
    key: "loading",
    set: function set(value) {
      this._loading = value;
    },
    get: function get() {
      if (typeof this._loading === 'boolean') return this._loading;
      if (this.loadingChoices) return 'choices';
      return false;
    }
  }, {
    key: "status",
    get: function get() {
      if (this.cancelled) return 'cancelled';
      if (this.submitted) return 'submitted';
      return 'pending';
    }
  }]);

  return State;
}();

module.exports = State;
},{"./utils":"node_modules/enquirer/lib/utils.js","process":"node_modules/process/browser.js","buffer":"node_modules/node-libs-browser/node_modules/buffer/index.js"}],"node_modules/enquirer/lib/styles.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');

var colors = require('ansi-colors');

var styles = {
  default: colors.noop,
  noop: colors.noop,

  /**
   * Modifiers
   */
  set inverse(custom) {
    this._inverse = custom;
  },

  get inverse() {
    return this._inverse || utils.inverse(this.primary);
  },

  set complement(custom) {
    this._complement = custom;
  },

  get complement() {
    return this._complement || utils.complement(this.primary);
  },

  /**
   * Main color
   */
  primary: colors.cyan,

  /**
   * Main palette
   */
  success: colors.green,
  danger: colors.magenta,
  strong: colors.bold,
  warning: colors.yellow,
  muted: colors.dim,
  disabled: colors.gray,
  dark: colors.dim.gray,
  underline: colors.underline,

  set info(custom) {
    this._info = custom;
  },

  get info() {
    return this._info || this.primary;
  },

  set em(custom) {
    this._em = custom;
  },

  get em() {
    return this._em || this.primary.underline;
  },

  set heading(custom) {
    this._heading = custom;
  },

  get heading() {
    return this._heading || this.muted.underline;
  },

  /**
   * Statuses
   */
  set pending(custom) {
    this._pending = custom;
  },

  get pending() {
    return this._pending || this.primary;
  },

  set submitted(custom) {
    this._submitted = custom;
  },

  get submitted() {
    return this._submitted || this.success;
  },

  set cancelled(custom) {
    this._cancelled = custom;
  },

  get cancelled() {
    return this._cancelled || this.danger;
  },

  /**
   * Special styling
   */
  set typing(custom) {
    this._typing = custom;
  },

  get typing() {
    return this._typing || this.dim;
  },

  set placeholder(custom) {
    this._placeholder = custom;
  },

  get placeholder() {
    return this._placeholder || this.primary.dim;
  },

  set highlight(custom) {
    this._highlight = custom;
  },

  get highlight() {
    return this._highlight || this.inverse;
  }

};

styles.merge = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.styles && typeof options.styles.enabled === 'boolean') {
    colors.enabled = options.styles.enabled;
  }

  if (options.styles && typeof options.styles.visible === 'boolean') {
    colors.visible = options.styles.visible;
  }

  var result = utils.merge({}, styles, options.styles);
  delete result.merge;

  var _loop = function _loop() {
    var key = _Object$keys[_i];

    if (!result.hasOwnProperty(key)) {
      Reflect.defineProperty(result, key, {
        get: function get() {
          return colors[key];
        }
      });
    }
  };

  for (var _i = 0, _Object$keys = Object.keys(colors); _i < _Object$keys.length; _i++) {
    _loop();
  }

  var _loop2 = function _loop2() {
    var key = _Object$keys2[_i2];

    if (!result.hasOwnProperty(key)) {
      Reflect.defineProperty(result, key, {
        get: function get() {
          return colors[key];
        }
      });
    }
  };

  for (var _i2 = 0, _Object$keys2 = Object.keys(colors.styles); _i2 < _Object$keys2.length; _i2++) {
    _loop2();
  }

  return result;
};

module.exports = styles;
},{"./utils":"node_modules/enquirer/lib/utils.js","ansi-colors":"node_modules/ansi-colors/index.js"}],"node_modules/enquirer/lib/symbols.js":[function(require,module,exports) {
var process = require("process");
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isWindows = process.platform === 'win32';

var colors = require('ansi-colors');

var utils = require('./utils');

var symbols = _objectSpread(_objectSpread({}, colors.symbols), {}, {
  upDownDoubleArrow: '⇕',
  upDownDoubleArrow2: '⬍',
  upDownArrow: '↕',
  asterisk: '*',
  asterism: '⁂',
  bulletWhite: '◦',
  electricArrow: '⌁',
  ellipsisLarge: '⋯',
  ellipsisSmall: '…',
  fullBlock: '█',
  identicalTo: '≡',
  indicator: colors.symbols.check,
  leftAngle: '‹',
  mark: '※',
  minus: '−',
  multiplication: '×',
  obelus: '÷',
  percent: '%',
  pilcrow: '¶',
  pilcrow2: '❡',
  pencilUpRight: '✐',
  pencilDownRight: '✎',
  pencilRight: '✏',
  plus: '+',
  plusMinus: '±',
  pointRight: '☞',
  rightAngle: '›',
  section: '§',
  hexagon: {
    off: '⬡',
    on: '⬢',
    disabled: '⬢'
  },
  ballot: {
    on: '☑',
    off: '☐',
    disabled: '☒'
  },
  stars: {
    on: '★',
    off: '☆',
    disabled: '☆'
  },
  folder: {
    on: '▼',
    off: '▶',
    disabled: '▶'
  },
  prefix: {
    pending: colors.symbols.question,
    submitted: colors.symbols.check,
    cancelled: colors.symbols.cross
  },
  separator: {
    pending: colors.symbols.pointerSmall,
    submitted: colors.symbols.middot,
    cancelled: colors.symbols.middot
  },
  radio: {
    off: isWindows ? '( )' : '◯',
    on: isWindows ? '(*)' : '◉',
    disabled: isWindows ? '(|)' : 'Ⓘ'
  },
  numbers: ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘', '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟', '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷', '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾', '㊿']
});

symbols.merge = function (options) {
  var result = utils.merge({}, colors.symbols, symbols, options.symbols);
  delete result.merge;
  return result;
};

module.exports = symbols;
},{"ansi-colors":"node_modules/ansi-colors/index.js","./utils":"node_modules/enquirer/lib/utils.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/theme.js":[function(require,module,exports) {
'use strict';

var styles = require('./styles');

var symbols = require('./symbols');

var utils = require('./utils');

module.exports = function (prompt) {
  prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
  prompt.symbols = symbols.merge(prompt.options);
  prompt.styles = styles.merge(prompt.options);
};
},{"./styles":"node_modules/enquirer/lib/styles.js","./symbols":"node_modules/enquirer/lib/symbols.js","./utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/ansi.js":[function(require,module,exports) {
var process = require("process");
'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isTerm = "vscode" === 'Apple_Terminal';

var colors = require('ansi-colors');

var utils = require('./utils');

var ansi = module.exports = exports;
var ESC = "\x1B[";
var BEL = "\x07";
var hidden = false;
var code = ansi.code = {
  bell: BEL,
  beep: BEL,
  beginning: "".concat(ESC, "G"),
  down: "".concat(ESC, "J"),
  esc: ESC,
  getPosition: "".concat(ESC, "6n"),
  hide: "".concat(ESC, "?25l"),
  line: "".concat(ESC, "2K"),
  lineEnd: "".concat(ESC, "K"),
  lineStart: "".concat(ESC, "1K"),
  restorePosition: ESC + (isTerm ? '8' : 'u'),
  savePosition: ESC + (isTerm ? '7' : 's'),
  screen: "".concat(ESC, "2J"),
  show: "".concat(ESC, "?25h"),
  up: "".concat(ESC, "1J")
};
var cursor = ansi.cursor = {
  get hidden() {
    return hidden;
  },

  hide: function hide() {
    hidden = true;
    return code.hide;
  },
  show: function show() {
    hidden = false;
    return code.show;
  },
  forward: function forward() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "".concat(ESC).concat(count, "C");
  },
  backward: function backward() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "".concat(ESC).concat(count, "D");
  },
  nextLine: function nextLine() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "".concat(ESC, "E").repeat(count);
  },
  prevLine: function prevLine() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return "".concat(ESC, "F").repeat(count);
  },
  up: function up() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return count ? "".concat(ESC).concat(count, "A") : '';
  },
  down: function down() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return count ? "".concat(ESC).concat(count, "B") : '';
  },
  right: function right() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return count ? "".concat(ESC).concat(count, "C") : '';
  },
  left: function left() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return count ? "".concat(ESC).concat(count, "D") : '';
  },
  to: function to(x, y) {
    return y ? "".concat(ESC).concat(y + 1, ";").concat(x + 1, "H") : "".concat(ESC).concat(x + 1, "G");
  },
  move: function move() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var res = '';
    res += x < 0 ? cursor.left(-x) : x > 0 ? cursor.right(x) : '';
    res += y < 0 ? cursor.up(-y) : y > 0 ? cursor.down(y) : '';
    return res;
  },
  restore: function restore() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var after = state.after,
        cursor = state.cursor,
        initial = state.initial,
        input = state.input,
        prompt = state.prompt,
        size = state.size,
        value = state.value;
    initial = utils.isPrimitive(initial) ? String(initial) : '';
    input = utils.isPrimitive(input) ? String(input) : '';
    value = utils.isPrimitive(value) ? String(value) : '';

    if (size) {
      var codes = ansi.cursor.up(size) + ansi.cursor.to(prompt.length);
      var diff = input.length - cursor;

      if (diff > 0) {
        codes += ansi.cursor.left(diff);
      }

      return codes;
    }

    if (value || after) {
      var pos = !input && !!initial ? -initial.length : -input.length + cursor;
      if (after) pos -= after.length;

      if (input === '' && initial && !prompt.includes(initial)) {
        pos += initial.length;
      }

      return ansi.cursor.move(pos);
    }
  }
};
var erase = ansi.erase = {
  screen: code.screen,
  up: code.up,
  down: code.down,
  line: code.line,
  lineEnd: code.lineEnd,
  lineStart: code.lineStart,
  lines: function lines(n) {
    var str = '';

    for (var i = 0; i < n; i++) {
      str += ansi.erase.line + (i < n - 1 ? ansi.cursor.up(1) : '');
    }

    if (n) str += ansi.code.beginning;
    return str;
  }
};

ansi.clear = function () {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.stdout.columns;
  if (!columns) return erase.line + cursor.to(0);

  var width = function width(str) {
    return _toConsumableArray(colors.unstyle(str)).length;
  };

  var lines = input.split(/\r?\n/);
  var rows = 0;

  var _iterator = _createForOfIteratorHelper(lines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var line = _step.value;
      rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / columns);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return (erase.line + cursor.prevLine()).repeat(rows - 1) + erase.line + cursor.to(0);
};
},{"ansi-colors":"node_modules/ansi-colors/index.js","./utils":"node_modules/enquirer/lib/utils.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/prompt.js":[function(require,module,exports) {
var process = require("process");
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Events = require('events');

var colors = require('ansi-colors');

var _keypress = require('./keypress');

var timer = require('./timer');

var State = require('./state');

var theme = require('./theme');

var utils = require('./utils');

var ansi = require('./ansi');
/**
 * Base class for creating a new Prompt.
 * @param {Object} `options` Question object.
 */


var Prompt = /*#__PURE__*/function (_Events) {
  _inherits(Prompt, _Events);

  var _super = _createSuper(Prompt);

  function Prompt() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Prompt);

    _this = _super.call(this);
    _this.name = options.name;
    _this.type = options.type;
    _this.options = options;
    theme(_assertThisInitialized(_this));
    timer(_assertThisInitialized(_this));
    _this.state = new State(_assertThisInitialized(_this));
    _this.initial = [options.initial, options.default].find(function (v) {
      return v != null;
    });
    _this.stdout = options.stdout || process.stdout;
    _this.stdin = options.stdin || process.stdin;
    _this.scale = options.scale || 1;
    _this.term = _this.options.term || "vscode";
    _this.margin = margin(_this.options.margin);

    _this.setMaxListeners(0);

    setOptions(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Prompt, [{
    key: "keypress",
    value: function () {
      var _keypress2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input) {
        var event,
            key,
            fn,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                this.keypressed = true;
                key = _keypress.action(input, _keypress(input, event), this.options.actions);
                this.state.keypress = key;
                this.emit('keypress', input, key);
                this.emit('state', this.state.clone());
                fn = this.options[key.action] || this[key.action] || this.dispatch;

                if (!(typeof fn === 'function')) {
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return fn.call(this, input, key);

              case 10:
                return _context.abrupt("return", _context.sent);

              case 11:
                this.alert();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function keypress(_x) {
        return _keypress2.apply(this, arguments);
      }

      return keypress;
    }()
  }, {
    key: "alert",
    value: function alert() {
      delete this.state.alert;

      if (this.options.show === false) {
        this.emit('alert');
      } else {
        this.stdout.write(ansi.code.beep);
      }
    }
  }, {
    key: "cursorHide",
    value: function cursorHide() {
      var _this2 = this;

      this.stdout.write(ansi.cursor.hide());
      utils.onExit(function () {
        return _this2.cursorShow();
      });
    }
  }, {
    key: "cursorShow",
    value: function cursorShow() {
      this.stdout.write(ansi.cursor.show());
    }
  }, {
    key: "write",
    value: function write(str) {
      if (!str) return;

      if (this.stdout && this.state.show !== false) {
        this.stdout.write(str);
      }

      this.state.buffer += str;
    }
  }, {
    key: "clear",
    value: function clear() {
      var lines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var buffer = this.state.buffer;
      this.state.buffer = '';
      if (!buffer && !lines || this.options.show === false) return;
      this.stdout.write(ansi.cursor.down(lines) + ansi.clear(buffer, this.width));
    }
  }, {
    key: "restore",
    value: function restore() {
      if (this.state.closed || this.options.show === false) return;

      var _this$sections = this.sections(),
          prompt = _this$sections.prompt,
          after = _this$sections.after,
          rest = _this$sections.rest;

      var cursor = this.cursor,
          _this$initial = this.initial,
          initial = _this$initial === void 0 ? '' : _this$initial,
          _this$input = this.input,
          input = _this$input === void 0 ? '' : _this$input,
          _this$value = this.value,
          value = _this$value === void 0 ? '' : _this$value;
      var size = this.state.size = rest.length;
      var state = {
        after: after,
        cursor: cursor,
        initial: initial,
        input: input,
        prompt: prompt,
        size: size,
        value: value
      };
      var codes = ansi.cursor.restore(state);

      if (codes) {
        this.stdout.write(codes);
      }
    }
  }, {
    key: "sections",
    value: function sections() {
      var _this$state = this.state,
          buffer = _this$state.buffer,
          input = _this$state.input,
          prompt = _this$state.prompt;
      prompt = colors.unstyle(prompt);
      var buf = colors.unstyle(buffer);
      var idx = buf.indexOf(prompt);
      var header = buf.slice(0, idx);
      var rest = buf.slice(idx);
      var lines = rest.split('\n');
      var first = lines[0];
      var last = lines[lines.length - 1];
      var promptLine = prompt + (input ? ' ' + input : '');
      var len = promptLine.length;
      var after = len < first.length ? first.slice(len + 1) : '';
      return {
        header: header,
        prompt: first,
        after: after,
        rest: lines.slice(1),
        last: last
      };
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var result, error;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.state.submitted = true;
                this.state.validating = true; // this will only be called when the prompt is directly submitted
                // without initializing, i.e. when the prompt is skipped, etc. Otherwize,
                // "options.onSubmit" is will be handled by the "initialize()" method.

                if (!this.options.onSubmit) {
                  _context2.next = 5;
                  break;
                }

                _context2.next = 5;
                return this.options.onSubmit.call(this, this.name, this.value, this);

              case 5:
                _context2.t0 = this.state.error;

                if (_context2.t0) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 9;
                return this.validate(this.value, this.state);

              case 9:
                _context2.t0 = _context2.sent;

              case 10:
                result = _context2.t0;

                if (!(result !== true)) {
                  _context2.next = 23;
                  break;
                }

                error = '\n' + this.symbols.pointer + ' ';

                if (typeof result === 'string') {
                  error += result.trim();
                } else {
                  error += 'Invalid input';
                }

                this.state.error = '\n' + this.styles.danger(error);
                this.state.submitted = false;
                _context2.next = 18;
                return this.render();

              case 18:
                _context2.next = 20;
                return this.alert();

              case 20:
                this.state.validating = false;
                this.state.error = void 0;
                return _context2.abrupt("return");

              case 23:
                this.state.validating = false;
                _context2.next = 26;
                return this.render();

              case 26:
                _context2.next = 28;
                return this.close();

              case 28:
                _context2.next = 30;
                return this.result(this.value);

              case 30:
                this.value = _context2.sent;
                this.emit('submit', this.value);

              case 32:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "cancel",
    value: function () {
      var _cancel = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(err) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.state.cancelled = this.state.submitted = true;
                _context3.next = 3;
                return this.render();

              case 3:
                _context3.next = 5;
                return this.close();

              case 5:
                if (!(typeof this.options.onCancel === 'function')) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 8;
                return this.options.onCancel.call(this, this.name, this.value, this);

              case 8:
                _context3.t0 = this;
                _context3.next = 11;
                return this.error(err);

              case 11:
                _context3.t1 = _context3.sent;

                _context3.t0.emit.call(_context3.t0, 'cancel', _context3.t1);

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function cancel(_x2) {
        return _cancel.apply(this, arguments);
      }

      return cancel;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var sections, lines;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.state.closed = true;

                try {
                  sections = this.sections();
                  lines = Math.ceil(sections.prompt.length / this.width);

                  if (sections.rest) {
                    this.write(ansi.cursor.down(sections.rest.length));
                  }

                  this.write('\n'.repeat(lines));
                } catch (err) {
                  /* do nothing */
                }

                this.emit('close');

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function close() {
        return _close.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: "start",
    value: function start() {
      if (!this.stop && this.options.show !== false) {
        this.stop = _keypress.listen(this, this.keypress.bind(this));
        this.once('close', this.stop);
      }
    }
  }, {
    key: "skip",
    value: function () {
      var _skip = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.skipped = this.options.skip === true;

                if (!(typeof this.options.skip === 'function')) {
                  _context5.next = 5;
                  break;
                }

                _context5.next = 4;
                return this.options.skip.call(this, this.name, this.value);

              case 4:
                this.skipped = _context5.sent;

              case 5:
                return _context5.abrupt("return", this.skipped);

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function skip() {
        return _skip.apply(this, arguments);
      }

      return skip;
    }()
  }, {
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var _this3 = this;

        var format, options, result, onSubmit, submit;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                format = this.format, options = this.options, result = this.result;

                this.format = function () {
                  return format.call(_this3, _this3.value);
                };

                this.result = function () {
                  return result.call(_this3, _this3.value);
                };

                if (!(typeof options.initial === 'function')) {
                  _context7.next = 7;
                  break;
                }

                _context7.next = 6;
                return options.initial.call(this, this);

              case 6:
                this.initial = _context7.sent;

              case 7:
                if (!(typeof options.onRun === 'function')) {
                  _context7.next = 10;
                  break;
                }

                _context7.next = 10;
                return options.onRun.call(this, this);

              case 10:
                // if "options.onSubmit" is defined, we wrap the "submit" method to guarantee
                // that "onSubmit" will always called first thing inside the submit
                // method, regardless of how it's handled in inheriting prompts.
                if (typeof options.onSubmit === 'function') {
                  onSubmit = options.onSubmit.bind(this);
                  submit = this.submit.bind(this);
                  delete this.options.onSubmit;
                  this.submit = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return onSubmit(_this3.name, _this3.value, _this3);

                          case 2:
                            return _context6.abrupt("return", submit());

                          case 3:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));
                }

                _context7.next = 13;
                return this.start();

              case 13:
                _context7.next = 15;
                return this.render();

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "render",
    value: function render() {
      throw new Error('expected prompt to have a custom render method');
    }
  }, {
    key: "run",
    value: function run() {
      var _this4 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _this4.once('submit', resolve);

                  _this4.once('cancel', reject);

                  _context8.next = 4;
                  return _this4.skip();

                case 4:
                  if (!_context8.sent) {
                    _context8.next = 7;
                    break;
                  }

                  _this4.render = function () {};

                  return _context8.abrupt("return", _this4.submit());

                case 7:
                  _context8.next = 9;
                  return _this4.initialize();

                case 9:
                  _this4.emit('run');

                case 10:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "element",
    value: function () {
      var _element = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(name, choice, i) {
        var options, state, symbols, timers, timer, value, val, res;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                options = this.options, state = this.state, symbols = this.symbols, timers = this.timers;
                timer = timers && timers[name];
                state.timer = timer;
                value = options[name] || state[name] || symbols[name];

                if (!(choice && choice[name] != null)) {
                  _context9.next = 8;
                  break;
                }

                _context9.t0 = choice[name];
                _context9.next = 11;
                break;

              case 8:
                _context9.next = 10;
                return value;

              case 10:
                _context9.t0 = _context9.sent;

              case 11:
                val = _context9.t0;

                if (!(val === '')) {
                  _context9.next = 14;
                  break;
                }

                return _context9.abrupt("return", val);

              case 14:
                _context9.next = 16;
                return this.resolve(val, state, choice, i);

              case 16:
                res = _context9.sent;

                if (!(!res && choice && choice[name])) {
                  _context9.next = 19;
                  break;
                }

                return _context9.abrupt("return", this.resolve(value, state, choice, i));

              case 19:
                return _context9.abrupt("return", res);

              case 20:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function element(_x5, _x6, _x7) {
        return _element.apply(this, arguments);
      }

      return element;
    }()
  }, {
    key: "prefix",
    value: function () {
      var _prefix = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        var element, timer, state, style;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.element('prefix');

              case 2:
                _context10.t0 = _context10.sent;

                if (_context10.t0) {
                  _context10.next = 5;
                  break;
                }

                _context10.t0 = this.symbols;

              case 5:
                element = _context10.t0;
                timer = this.timers && this.timers.prefix;
                state = this.state;
                state.timer = timer;
                if (utils.isObject(element)) element = element[state.status] || element.pending;

                if (utils.hasColor(element)) {
                  _context10.next = 13;
                  break;
                }

                style = this.styles[state.status] || this.styles.pending;
                return _context10.abrupt("return", style(element));

              case 13:
                return _context10.abrupt("return", element);

              case 14:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function prefix() {
        return _prefix.apply(this, arguments);
      }

      return prefix;
    }()
  }, {
    key: "message",
    value: function () {
      var _message = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var message;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.element('message');

              case 2:
                message = _context11.sent;

                if (utils.hasColor(message)) {
                  _context11.next = 5;
                  break;
                }

                return _context11.abrupt("return", this.styles.strong(message));

              case 5:
                return _context11.abrupt("return", message);

              case 6:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function message() {
        return _message.apply(this, arguments);
      }

      return message;
    }()
  }, {
    key: "separator",
    value: function () {
      var _separator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
        var element, timer, state, value, ele;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.element('separator');

              case 2:
                _context12.t0 = _context12.sent;

                if (_context12.t0) {
                  _context12.next = 5;
                  break;
                }

                _context12.t0 = this.symbols;

              case 5:
                element = _context12.t0;
                timer = this.timers && this.timers.separator;
                state = this.state;
                state.timer = timer;
                value = element[state.status] || element.pending || state.separator;
                _context12.next = 12;
                return this.resolve(value, state);

              case 12:
                ele = _context12.sent;
                if (utils.isObject(ele)) ele = ele[state.status] || ele.pending;

                if (utils.hasColor(ele)) {
                  _context12.next = 16;
                  break;
                }

                return _context12.abrupt("return", this.styles.muted(ele));

              case 16:
                return _context12.abrupt("return", ele);

              case 17:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function separator() {
        return _separator.apply(this, arguments);
      }

      return separator;
    }()
  }, {
    key: "pointer",
    value: function () {
      var _pointer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(choice, i) {
        var val, styles, focused, style, ele, styled;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.element('pointer', choice, i);

              case 2:
                val = _context13.sent;

                if (!(typeof val === 'string' && utils.hasColor(val))) {
                  _context13.next = 5;
                  break;
                }

                return _context13.abrupt("return", val);

              case 5:
                if (!val) {
                  _context13.next = 14;
                  break;
                }

                styles = this.styles;
                focused = this.index === i;
                style = focused ? styles.primary : function (val) {
                  return val;
                };
                _context13.next = 11;
                return this.resolve(val[focused ? 'on' : 'off'] || val, this.state);

              case 11:
                ele = _context13.sent;
                styled = !utils.hasColor(ele) ? style(ele) : ele;
                return _context13.abrupt("return", focused ? styled : ' '.repeat(ele.length));

              case 14:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function pointer(_x8, _x9) {
        return _pointer.apply(this, arguments);
      }

      return pointer;
    }()
  }, {
    key: "indicator",
    value: function () {
      var _indicator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(choice, i) {
        var val, styles, enabled, style, ele;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.element('indicator', choice, i);

              case 2:
                val = _context14.sent;

                if (!(typeof val === 'string' && utils.hasColor(val))) {
                  _context14.next = 5;
                  break;
                }

                return _context14.abrupt("return", val);

              case 5:
                if (!val) {
                  _context14.next = 11;
                  break;
                }

                styles = this.styles;
                enabled = choice.enabled === true;
                style = enabled ? styles.success : styles.dark;
                ele = val[enabled ? 'on' : 'off'] || val;
                return _context14.abrupt("return", !utils.hasColor(ele) ? style(ele) : ele);

              case 11:
                return _context14.abrupt("return", '');

              case 12:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function indicator(_x10, _x11) {
        return _indicator.apply(this, arguments);
      }

      return indicator;
    }()
  }, {
    key: "body",
    value: function body() {
      return null;
    }
  }, {
    key: "footer",
    value: function footer() {
      if (this.state.status === 'pending') {
        return this.element('footer');
      }
    }
  }, {
    key: "header",
    value: function header() {
      if (this.state.status === 'pending') {
        return this.element('header');
      }
    }
  }, {
    key: "hint",
    value: function () {
      var _hint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var _hint2;

        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!(this.state.status === 'pending' && !this.isValue(this.state.input))) {
                  _context15.next = 7;
                  break;
                }

                _context15.next = 3;
                return this.element('hint');

              case 3:
                _hint2 = _context15.sent;

                if (utils.hasColor(_hint2)) {
                  _context15.next = 6;
                  break;
                }

                return _context15.abrupt("return", this.styles.muted(_hint2));

              case 6:
                return _context15.abrupt("return", _hint2);

              case 7:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function hint() {
        return _hint.apply(this, arguments);
      }

      return hint;
    }()
  }, {
    key: "error",
    value: function error(err) {
      return !this.state.submitted ? err || this.state.error : '';
    }
  }, {
    key: "format",
    value: function format(value) {
      return value;
    }
  }, {
    key: "result",
    value: function result(value) {
      return value;
    }
  }, {
    key: "validate",
    value: function validate(value) {
      if (this.options.required === true) {
        return this.isValue(value);
      }

      return true;
    }
  }, {
    key: "isValue",
    value: function isValue(value) {
      return value != null && value !== '';
    }
  }, {
    key: "resolve",
    value: function resolve(value) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return utils.resolve.apply(utils, [this, value].concat(args));
    }
  }, {
    key: "base",
    get: function get() {
      return Prompt.prototype;
    }
  }, {
    key: "style",
    get: function get() {
      return this.styles[this.state.status];
    }
  }, {
    key: "height",
    get: function get() {
      return this.options.rows || utils.height(this.stdout, 25);
    }
  }, {
    key: "width",
    get: function get() {
      return this.options.columns || utils.width(this.stdout, 80);
    }
  }, {
    key: "size",
    get: function get() {
      return {
        width: this.width,
        height: this.height
      };
    }
  }, {
    key: "cursor",
    set: function set(value) {
      this.state.cursor = value;
    },
    get: function get() {
      return this.state.cursor;
    }
  }, {
    key: "input",
    set: function set(value) {
      this.state.input = value;
    },
    get: function get() {
      return this.state.input;
    }
  }, {
    key: "value",
    set: function set(value) {
      this.state.value = value;
    },
    get: function get() {
      var _this$state2 = this.state,
          input = _this$state2.input,
          value = _this$state2.value;
      var result = [value, input].find(this.isValue.bind(this));
      return this.isValue(result) ? result : this.initial;
    }
  }], [{
    key: "prompt",
    get: function get() {
      var _this5 = this;

      return function (options) {
        return new _this5(options).run();
      };
    }
  }]);

  return Prompt;
}(Events);

function setOptions(prompt) {
  var isValidKey = function isValidKey(key) {
    return prompt[key] === void 0 || typeof prompt[key] === 'function';
  };

  var ignore = ['actions', 'choices', 'initial', 'margin', 'roles', 'styles', 'symbols', 'theme', 'timers', 'value'];
  var ignoreFn = ['body', 'footer', 'error', 'header', 'hint', 'indicator', 'message', 'prefix', 'separator', 'skip'];

  for (var _i = 0, _Object$keys = Object.keys(prompt.options); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    if (ignore.includes(key)) continue;
    if (/^on[A-Z]/.test(key)) continue;
    var option = prompt.options[key];

    if (typeof option === 'function' && isValidKey(key)) {
      if (!ignoreFn.includes(key)) {
        prompt[key] = option.bind(prompt);
      }
    } else if (typeof prompt[key] !== 'function') {
      prompt[key] = option;
    }
  }
}

function margin(value) {
  if (typeof value === 'number') {
    value = [value, value, value, value];
  }

  var arr = [].concat(value || []);

  var pad = function pad(i) {
    return i % 2 === 0 ? '\n' : ' ';
  };

  var res = [];

  for (var i = 0; i < 4; i++) {
    var char = pad(i);

    if (arr[i]) {
      res.push(char.repeat(arr[i]));
    } else {
      res.push('');
    }
  }

  return res;
}

module.exports = Prompt;
},{"events":"node_modules/events/events.js","ansi-colors":"node_modules/ansi-colors/index.js","./keypress":"node_modules/enquirer/lib/keypress.js","./timer":"node_modules/enquirer/lib/timer.js","./state":"node_modules/enquirer/lib/state.js","./theme":"node_modules/enquirer/lib/theme.js","./utils":"node_modules/enquirer/lib/utils.js","./ansi":"node_modules/enquirer/lib/ansi.js","process":"node_modules/process/browser.js"}],"node_modules/enquirer/lib/roles.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');

var roles = {
  default: function _default(prompt, choice) {
    return choice;
  },
  checkbox: function checkbox(prompt, choice) {
    throw new Error('checkbox role is not implemented yet');
  },
  editable: function editable(prompt, choice) {
    throw new Error('editable role is not implemented yet');
  },
  expandable: function expandable(prompt, choice) {
    throw new Error('expandable role is not implemented yet');
  },
  heading: function heading(prompt, choice) {
    choice.disabled = '';
    choice.indicator = [choice.indicator, ' '].find(function (v) {
      return v != null;
    });
    choice.message = choice.message || '';
    return choice;
  },
  input: function input(prompt, choice) {
    throw new Error('input role is not implemented yet');
  },
  option: function option(prompt, choice) {
    return roles.default(prompt, choice);
  },
  radio: function radio(prompt, choice) {
    throw new Error('radio role is not implemented yet');
  },
  separator: function separator(prompt, choice) {
    choice.disabled = '';
    choice.indicator = [choice.indicator, ' '].find(function (v) {
      return v != null;
    });
    choice.message = choice.message || prompt.symbols.line.repeat(5);
    return choice;
  },
  spacer: function spacer(prompt, choice) {
    return choice;
  }
};

module.exports = function (name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var role = utils.merge({}, roles, options.roles);
  return role[name] || role.default;
};
},{"./utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/types/array.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var colors = require('ansi-colors');

var Prompt = require('../prompt');

var roles = require('../roles');

var utils = require('../utils');

var reorder = utils.reorder,
    _scrollUp = utils.scrollUp,
    _scrollDown = utils.scrollDown,
    isObject = utils.isObject,
    _swap = utils.swap;

var ArrayPrompt = /*#__PURE__*/function (_Prompt) {
  _inherits(ArrayPrompt, _Prompt);

  var _super = _createSuper(ArrayPrompt);

  function ArrayPrompt(options) {
    var _this;

    _classCallCheck(this, ArrayPrompt);

    _this = _super.call(this, options);

    _this.cursorHide();

    _this.maxSelected = options.maxSelected || Infinity;
    _this.multiple = options.multiple || false;
    _this.initial = options.initial || 0;
    _this.delay = options.delay || 0;
    _this.longest = 0;
    _this.num = '';
    return _this;
  }

  _createClass(ArrayPrompt, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(typeof this.options.initial === 'function')) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return this.options.initial.call(this);

              case 3:
                this.initial = _context.sent;

              case 4:
                _context.next = 6;
                return this.reset(true);

              case 6:
                _context.next = 8;
                return _get(_getPrototypeOf(ArrayPrompt.prototype), "initialize", this).call(this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var _this$options, choices, initial, autofocus, suggest;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$options = this.options, choices = _this$options.choices, initial = _this$options.initial, autofocus = _this$options.autofocus, suggest = _this$options.suggest;
                this.state._choices = [];
                this.state.choices = [];
                _context2.t0 = Promise;
                _context2.next = 6;
                return this.toChoices(choices);

              case 6:
                _context2.t1 = _context2.sent;
                _context2.next = 9;
                return _context2.t0.all.call(_context2.t0, _context2.t1);

              case 9:
                this.choices = _context2.sent;
                this.choices.forEach(function (ch) {
                  return ch.enabled = false;
                });

                if (!(typeof suggest !== 'function' && this.selectable.length === 0)) {
                  _context2.next = 13;
                  break;
                }

                throw new Error('At least one choice must be selectable');

              case 13:
                if (isObject(initial)) initial = Object.keys(initial);

                if (!Array.isArray(initial)) {
                  _context2.next = 21;
                  break;
                }

                if (autofocus != null) this.index = this.findIndex(autofocus);
                initial.forEach(function (v) {
                  return _this2.enable(_this2.find(v));
                });
                _context2.next = 19;
                return this.render();

              case 19:
                _context2.next = 24;
                break;

              case 21:
                if (autofocus != null) initial = autofocus;
                if (typeof initial === 'string') initial = this.findIndex(initial);

                if (typeof initial === 'number' && initial > -1) {
                  this.index = Math.max(0, Math.min(initial, this.choices.length));
                  this.enable(this.find(this.index));
                }

              case 24:
                if (!this.isDisabled(this.focused)) {
                  _context2.next = 27;
                  break;
                }

                _context2.next = 27;
                return this.down();

              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reset() {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: "toChoices",
    value: function () {
      var _toChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(value, parent) {
        var _this3 = this;

        var choices, index, toChoices;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.state.loadingChoices = true;
                choices = [];
                index = 0;

                toChoices = /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(items, parent) {
                    var i, choice;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!(typeof items === 'function')) {
                              _context3.next = 4;
                              break;
                            }

                            _context3.next = 3;
                            return items.call(_this3);

                          case 3:
                            items = _context3.sent;

                          case 4:
                            if (!(items instanceof Promise)) {
                              _context3.next = 8;
                              break;
                            }

                            _context3.next = 7;
                            return items;

                          case 7:
                            items = _context3.sent;

                          case 8:
                            i = 0;

                          case 9:
                            if (!(i < items.length)) {
                              _context3.next = 20;
                              break;
                            }

                            _context3.next = 12;
                            return _this3.toChoice(items[i], index++, parent);

                          case 12:
                            choice = items[i] = _context3.sent;
                            choices.push(choice);

                            if (!choice.choices) {
                              _context3.next = 17;
                              break;
                            }

                            _context3.next = 17;
                            return toChoices(choice.choices, choice);

                          case 17:
                            i++;
                            _context3.next = 9;
                            break;

                          case 20:
                            return _context3.abrupt("return", choices);

                          case 21:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function toChoices(_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }();

                return _context4.abrupt("return", toChoices(value, parent).then(function (choices) {
                  _this3.state.loadingChoices = false;
                  return choices;
                }));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function toChoices(_x, _x2) {
        return _toChoices.apply(this, arguments);
      }

      return toChoices;
    }()
  }, {
    key: "toChoice",
    value: function () {
      var _toChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ele, i, parent) {
        var origVal, role, choice;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(typeof ele === 'function')) {
                  _context5.next = 4;
                  break;
                }

                _context5.next = 3;
                return ele.call(this, this);

              case 3:
                ele = _context5.sent;

              case 4:
                if (!(ele instanceof Promise)) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 7;
                return ele;

              case 7:
                ele = _context5.sent;

              case 8:
                if (typeof ele === 'string') ele = {
                  name: ele
                };

                if (!ele.normalized) {
                  _context5.next = 11;
                  break;
                }

                return _context5.abrupt("return", ele);

              case 11:
                ele.normalized = true;
                origVal = ele.value;
                role = roles(ele.role, this.options);
                ele = role(this, ele);

                if (typeof ele.disabled === 'string' && !ele.hint) {
                  ele.hint = ele.disabled;
                  ele.disabled = true;
                }

                if (ele.disabled === true && ele.hint == null) {
                  ele.hint = '(disabled)';
                } // if the choice was already normalized, return it


                if (!(ele.index != null)) {
                  _context5.next = 19;
                  break;
                }

                return _context5.abrupt("return", ele);

              case 19:
                ele.name = ele.name || ele.key || ele.title || ele.value || ele.message;
                ele.message = ele.message || ele.name || '';
                ele.value = [ele.value, ele.name].find(this.isValue.bind(this));
                ele.input = '';
                ele.index = i;
                ele.cursor = 0;
                utils.define(ele, 'parent', parent);
                ele.level = parent ? parent.level + 1 : 1;

                if (ele.indent == null) {
                  ele.indent = parent ? parent.indent + '  ' : ele.indent || '';
                }

                ele.path = parent ? parent.path + '.' + ele.name : ele.name;
                ele.enabled = !!(this.multiple && !this.isDisabled(ele) && (ele.enabled || this.isSelected(ele)));

                if (!this.isDisabled(ele)) {
                  this.longest = Math.max(this.longest, colors.unstyle(ele.message).length);
                } // shallow clone the choice first


                choice = _objectSpread({}, ele); // then allow the choice to be reset using the "original" values

                ele.reset = function () {
                  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : choice.input;
                  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : choice.value;

                  for (var _i = 0, _Object$keys = Object.keys(choice); _i < _Object$keys.length; _i++) {
                    var key = _Object$keys[_i];
                    ele[key] = choice[key];
                  }

                  ele.input = input;
                  ele.value = value;
                };

                if (!(origVal == null && typeof ele.initial === 'function')) {
                  _context5.next = 37;
                  break;
                }

                _context5.next = 36;
                return ele.initial.call(this, this.state, ele, i);

              case 36:
                ele.input = _context5.sent;

              case 37:
                return _context5.abrupt("return", ele);

              case 38:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function toChoice(_x5, _x6, _x7) {
        return _toChoice.apply(this, arguments);
      }

      return toChoice;
    }()
  }, {
    key: "onChoice",
    value: function () {
      var _onChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(choice, i) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.emit('choice', choice, i, this);

                if (!(typeof choice.onChoice === 'function')) {
                  _context6.next = 4;
                  break;
                }

                _context6.next = 4;
                return choice.onChoice.call(this, this.state, choice, i);

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function onChoice(_x8, _x9) {
        return _onChoice.apply(this, arguments);
      }

      return onChoice;
    }()
  }, {
    key: "addChoice",
    value: function () {
      var _addChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(ele, i, parent) {
        var choice;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.toChoice(ele, i, parent);

              case 2:
                choice = _context7.sent;
                this.choices.push(choice);
                this.index = this.choices.length - 1;
                this.limit = this.choices.length;
                return _context7.abrupt("return", choice);

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function addChoice(_x10, _x11, _x12) {
        return _addChoice.apply(this, arguments);
      }

      return addChoice;
    }()
  }, {
    key: "newItem",
    value: function () {
      var _newItem = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(item, i, parent) {
        var ele, choice;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                ele = _objectSpread({
                  name: 'New choice name?',
                  editable: true,
                  newChoice: true
                }, item);
                _context8.next = 3;
                return this.addChoice(ele, i, parent);

              case 3:
                choice = _context8.sent;

                choice.updateChoice = function () {
                  delete choice.newChoice;
                  choice.name = choice.message = choice.input;
                  choice.input = '';
                  choice.cursor = 0;
                };

                return _context8.abrupt("return", this.render());

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function newItem(_x13, _x14, _x15) {
        return _newItem.apply(this, arguments);
      }

      return newItem;
    }()
  }, {
    key: "indent",
    value: function indent(choice) {
      if (choice.indent == null) {
        return choice.level > 1 ? '  '.repeat(choice.level - 1) : '';
      }

      return choice.indent;
    }
  }, {
    key: "dispatch",
    value: function dispatch(s, key) {
      if (this.multiple && this[key.name]) return this[key.name]();
      this.alert();
    }
  }, {
    key: "focus",
    value: function focus(choice, enabled) {
      if (typeof enabled !== 'boolean') enabled = choice.enabled;

      if (enabled && !choice.enabled && this.selected.length >= this.maxSelected) {
        return this.alert();
      }

      this.index = choice.index;
      choice.enabled = enabled && !this.isDisabled(choice);
      return choice;
    }
  }, {
    key: "space",
    value: function space() {
      if (!this.multiple) return this.alert();
      this.toggle(this.focused);
      return this.render();
    }
  }, {
    key: "a",
    value: function a() {
      if (this.maxSelected < this.choices.length) return this.alert();
      var enabled = this.selectable.every(function (ch) {
        return ch.enabled;
      });
      this.choices.forEach(function (ch) {
        return ch.enabled = !enabled;
      });
      return this.render();
    }
  }, {
    key: "i",
    value: function i() {
      // don't allow choices to be inverted if it will result in
      // more than the maximum number of allowed selected items.
      if (this.choices.length - this.selected.length > this.maxSelected) {
        return this.alert();
      }

      this.choices.forEach(function (ch) {
        return ch.enabled = !ch.enabled;
      });
      return this.render();
    }
  }, {
    key: "g",
    value: function g() {
      var choice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.focused;
      if (!this.choices.some(function (ch) {
        return !!ch.parent;
      })) return this.a();
      this.toggle(choice.parent && !choice.choices ? choice.parent : choice);
      return this.render();
    }
  }, {
    key: "toggle",
    value: function toggle(choice, enabled) {
      var _this4 = this;

      if (!choice.enabled && this.selected.length >= this.maxSelected) {
        return this.alert();
      }

      if (typeof enabled !== 'boolean') enabled = !choice.enabled;
      choice.enabled = enabled;

      if (choice.choices) {
        choice.choices.forEach(function (ch) {
          return _this4.toggle(ch, enabled);
        });
      }

      var parent = choice.parent;

      while (parent) {
        var choices = parent.choices.filter(function (ch) {
          return _this4.isDisabled(ch);
        });
        parent.enabled = choices.every(function (ch) {
          return ch.enabled === true;
        });
        parent = parent.parent;
      }

      reset(this, this.choices);
      this.emit('toggle', choice, this);
      return choice;
    }
  }, {
    key: "enable",
    value: function enable(choice) {
      if (this.selected.length >= this.maxSelected) return this.alert();
      choice.enabled = !this.isDisabled(choice);
      choice.choices && choice.choices.forEach(this.enable.bind(this));
      return choice;
    }
  }, {
    key: "disable",
    value: function disable(choice) {
      choice.enabled = false;
      choice.choices && choice.choices.forEach(this.disable.bind(this));
      return choice;
    }
  }, {
    key: "number",
    value: function number(n) {
      var _this5 = this;

      this.num += n;

      var number = function number(num) {
        var i = Number(num);
        if (i > _this5.choices.length - 1) return _this5.alert();
        var focused = _this5.focused;

        var choice = _this5.choices.find(function (ch) {
          return i === ch.index;
        });

        if (!choice.enabled && _this5.selected.length >= _this5.maxSelected) {
          return _this5.alert();
        }

        if (_this5.visible.indexOf(choice) === -1) {
          var choices = reorder(_this5.choices);
          var actualIdx = choices.indexOf(choice);

          if (focused.index > actualIdx) {
            var start = choices.slice(actualIdx, actualIdx + _this5.limit);
            var end = choices.filter(function (ch) {
              return !start.includes(ch);
            });
            _this5.choices = start.concat(end);
          } else {
            var pos = actualIdx - _this5.limit + 1;
            _this5.choices = choices.slice(pos).concat(choices.slice(0, pos));
          }
        }

        _this5.index = _this5.choices.indexOf(choice);

        _this5.toggle(_this5.focused);

        return _this5.render();
      };

      clearTimeout(this.numberTimeout);
      return new Promise(function (resolve) {
        var len = _this5.choices.length;
        var num = _this5.num;

        var handle = function handle() {
          var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          var res = arguments.length > 1 ? arguments[1] : undefined;
          clearTimeout(_this5.numberTimeout);
          if (val) res = number(num);
          _this5.num = '';
          resolve(res);
        };

        if (num === '0' || num.length === 1 && Number(num + '0') > len) {
          return handle(true);
        }

        if (Number(num) > len) {
          return handle(false, _this5.alert());
        }

        _this5.numberTimeout = setTimeout(function () {
          return handle(true);
        }, _this5.delay);
      });
    }
  }, {
    key: "home",
    value: function home() {
      this.choices = reorder(this.choices);
      this.index = 0;
      return this.render();
    }
  }, {
    key: "end",
    value: function end() {
      var pos = this.choices.length - this.limit;
      var choices = reorder(this.choices);
      this.choices = choices.slice(pos).concat(choices.slice(0, pos));
      this.index = this.limit - 1;
      return this.render();
    }
  }, {
    key: "first",
    value: function first() {
      this.index = 0;
      return this.render();
    }
  }, {
    key: "last",
    value: function last() {
      this.index = this.visible.length - 1;
      return this.render();
    }
  }, {
    key: "prev",
    value: function prev() {
      if (this.visible.length <= 1) return this.alert();
      return this.up();
    }
  }, {
    key: "next",
    value: function next() {
      if (this.visible.length <= 1) return this.alert();
      return this.down();
    }
  }, {
    key: "right",
    value: function right() {
      if (this.cursor >= this.input.length) return this.alert();
      this.cursor++;
      return this.render();
    }
  }, {
    key: "left",
    value: function left() {
      if (this.cursor <= 0) return this.alert();
      this.cursor--;
      return this.render();
    }
  }, {
    key: "up",
    value: function up() {
      var len = this.choices.length;
      var vis = this.visible.length;
      var idx = this.index;

      if (this.options.scroll === false && idx === 0) {
        return this.alert();
      }

      if (len > vis && idx === 0) {
        return this.scrollUp();
      }

      this.index = (idx - 1 % len + len) % len;

      if (this.isDisabled()) {
        return this.up();
      }

      return this.render();
    }
  }, {
    key: "down",
    value: function down() {
      var len = this.choices.length;
      var vis = this.visible.length;
      var idx = this.index;

      if (this.options.scroll === false && idx === vis - 1) {
        return this.alert();
      }

      if (len > vis && idx === vis - 1) {
        return this.scrollDown();
      }

      this.index = (idx + 1) % len;

      if (this.isDisabled()) {
        return this.down();
      }

      return this.render();
    }
  }, {
    key: "scrollUp",
    value: function scrollUp() {
      var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.choices = _scrollUp(this.choices);
      this.index = i;

      if (this.isDisabled()) {
        return this.up();
      }

      return this.render();
    }
  }, {
    key: "scrollDown",
    value: function scrollDown() {
      var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.visible.length - 1;
      this.choices = _scrollDown(this.choices);
      this.index = i;

      if (this.isDisabled()) {
        return this.down();
      }

      return this.render();
    }
  }, {
    key: "shiftUp",
    value: function () {
      var _shiftUp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(this.options.sort === true)) {
                  _context9.next = 7;
                  break;
                }

                this.sorting = true;
                this.swap(this.index - 1);
                _context9.next = 5;
                return this.up();

              case 5:
                this.sorting = false;
                return _context9.abrupt("return");

              case 7:
                return _context9.abrupt("return", this.scrollUp(this.index));

              case 8:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function shiftUp() {
        return _shiftUp.apply(this, arguments);
      }

      return shiftUp;
    }()
  }, {
    key: "shiftDown",
    value: function () {
      var _shiftDown = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!(this.options.sort === true)) {
                  _context10.next = 7;
                  break;
                }

                this.sorting = true;
                this.swap(this.index + 1);
                _context10.next = 5;
                return this.down();

              case 5:
                this.sorting = false;
                return _context10.abrupt("return");

              case 7:
                return _context10.abrupt("return", this.scrollDown(this.index));

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function shiftDown() {
        return _shiftDown.apply(this, arguments);
      }

      return shiftDown;
    }()
  }, {
    key: "pageUp",
    value: function pageUp() {
      if (this.visible.length <= 1) return this.alert();
      this.limit = Math.max(this.limit - 1, 0);
      this.index = Math.min(this.limit - 1, this.index);
      this._limit = this.limit;

      if (this.isDisabled()) {
        return this.up();
      }

      return this.render();
    }
  }, {
    key: "pageDown",
    value: function pageDown() {
      if (this.visible.length >= this.choices.length) return this.alert();
      this.index = Math.max(0, this.index);
      this.limit = Math.min(this.limit + 1, this.choices.length);
      this._limit = this.limit;

      if (this.isDisabled()) {
        return this.down();
      }

      return this.render();
    }
  }, {
    key: "swap",
    value: function swap(pos) {
      _swap(this.choices, this.index, pos);
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      var choice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.focused;
      var keys = ['disabled', 'collapsed', 'hidden', 'completing', 'readonly'];

      if (choice && keys.some(function (key) {
        return choice[key] === true;
      })) {
        return true;
      }

      return choice && choice.role === 'heading';
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      var _this6 = this;

      var choice = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.focused;
      if (Array.isArray(choice)) return choice.every(function (ch) {
        return _this6.isEnabled(ch);
      });

      if (choice.choices) {
        var choices = choice.choices.filter(function (ch) {
          return !_this6.isDisabled(ch);
        });
        return choice.enabled && choices.every(function (ch) {
          return _this6.isEnabled(ch);
        });
      }

      return choice.enabled && !this.isDisabled(choice);
    }
  }, {
    key: "isChoice",
    value: function isChoice(choice, value) {
      return choice.name === value || choice.index === Number(value);
    }
  }, {
    key: "isSelected",
    value: function isSelected(choice) {
      var _this7 = this;

      if (Array.isArray(this.initial)) {
        return this.initial.some(function (value) {
          return _this7.isChoice(choice, value);
        });
      }

      return this.isChoice(choice, this.initial);
    }
  }, {
    key: "map",
    value: function map() {
      var _this8 = this;

      var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';
      return [].concat(names || []).reduce(function (acc, name) {
        acc[name] = _this8.find(name, prop);
        return acc;
      }, {});
    }
  }, {
    key: "filter",
    value: function filter(value, prop) {
      var isChoice = function isChoice(ele, i) {
        return [ele.name, i].includes(value);
      };

      var fn = typeof value === 'function' ? value : isChoice;
      var choices = this.options.multiple ? this.state._choices : this.choices;
      var result = choices.filter(fn);

      if (prop) {
        return result.map(function (ch) {
          return ch[prop];
        });
      }

      return result;
    }
  }, {
    key: "find",
    value: function find(value, prop) {
      if (isObject(value)) return prop ? value[prop] : value;

      var isChoice = function isChoice(ele, i) {
        return [ele.name, i].includes(value);
      };

      var fn = typeof value === 'function' ? value : isChoice;
      var choice = this.choices.find(fn);

      if (choice) {
        return prop ? choice[prop] : choice;
      }
    }
  }, {
    key: "findIndex",
    value: function findIndex(value) {
      return this.choices.indexOf(this.find(value));
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var choice, _this$options2, reorder, sort, multi, value;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                choice = this.focused;

                if (choice) {
                  _context11.next = 3;
                  break;
                }

                return _context11.abrupt("return", this.alert());

              case 3:
                if (!choice.newChoice) {
                  _context11.next = 8;
                  break;
                }

                if (choice.input) {
                  _context11.next = 6;
                  break;
                }

                return _context11.abrupt("return", this.alert());

              case 6:
                choice.updateChoice();
                return _context11.abrupt("return", this.render());

              case 8:
                if (!this.choices.some(function (ch) {
                  return ch.newChoice;
                })) {
                  _context11.next = 10;
                  break;
                }

                return _context11.abrupt("return", this.alert());

              case 10:
                _this$options2 = this.options, reorder = _this$options2.reorder, sort = _this$options2.sort;
                multi = this.multiple === true;
                value = this.selected;

                if (!(value === void 0)) {
                  _context11.next = 15;
                  break;
                }

                return _context11.abrupt("return", this.alert());

              case 15:
                // re-sort choices to original order
                if (Array.isArray(value) && reorder !== false && sort !== true) {
                  value = utils.reorder(value);
                }

                this.value = multi ? value.map(function (ch) {
                  return ch.name;
                }) : value.name;
                return _context11.abrupt("return", _get(_getPrototypeOf(ArrayPrompt.prototype), "submit", this).call(this));

              case 18:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "choices",
    set: function set() {
      var _this9 = this;

      var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.state._choices = this.state._choices || [];
      this.state.choices = choices;

      var _iterator = _createForOfIteratorHelper(choices),
          _step;

      try {
        var _loop = function _loop() {
          var choice = _step.value;

          if (!_this9.state._choices.some(function (ch) {
            return ch.name === choice.name;
          })) {
            _this9.state._choices.push(choice);
          }
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!this._initial && this.options.initial) {
        this._initial = true;
        var init = this.initial;

        if (typeof init === 'string' || typeof init === 'number') {
          var choice = this.find(init);

          if (choice) {
            this.initial = choice.index;
            this.focus(choice, true);
          }
        }
      }
    },
    get: function get() {
      return reset(this, this.state.choices || []);
    }
  }, {
    key: "visible",
    set: function set(visible) {
      this.state.visible = visible;
    },
    get: function get() {
      return (this.state.visible || this.choices).slice(0, this.limit);
    }
  }, {
    key: "limit",
    set: function set(num) {
      this.state.limit = num;
    },
    get: function get() {
      var state = this.state,
          options = this.options,
          choices = this.choices;
      var limit = state.limit || this._limit || options.limit || choices.length;
      return Math.min(limit, this.height);
    }
  }, {
    key: "value",
    set: function set(value) {
      _set(_getPrototypeOf(ArrayPrompt.prototype), "value", value, this, true);
    },
    get: function get() {
      if (typeof _get(_getPrototypeOf(ArrayPrompt.prototype), "value", this) !== 'string' && _get(_getPrototypeOf(ArrayPrompt.prototype), "value", this) === this.initial) {
        return this.input;
      }

      return _get(_getPrototypeOf(ArrayPrompt.prototype), "value", this);
    }
  }, {
    key: "index",
    set: function set(i) {
      this.state.index = i;
    },
    get: function get() {
      return Math.max(0, this.state ? this.state.index : 0);
    }
  }, {
    key: "enabled",
    get: function get() {
      return this.filter(this.isEnabled.bind(this));
    }
  }, {
    key: "focused",
    get: function get() {
      var choice = this.choices[this.index];

      if (choice && this.state.submitted && this.multiple !== true) {
        choice.enabled = true;
      }

      return choice;
    }
  }, {
    key: "selectable",
    get: function get() {
      var _this10 = this;

      return this.choices.filter(function (choice) {
        return !_this10.isDisabled(choice);
      });
    }
  }, {
    key: "selected",
    get: function get() {
      return this.multiple ? this.enabled : this.focused;
    }
  }]);

  return ArrayPrompt;
}(Prompt);

function reset(prompt, choices) {
  if (choices instanceof Promise) return choices;

  if (typeof choices === 'function') {
    if (utils.isAsyncFn(choices)) return choices;
    choices = choices.call(prompt, prompt);
  }

  var _iterator2 = _createForOfIteratorHelper(choices),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var choice = _step2.value;

      if (Array.isArray(choice.choices)) {
        var items = choice.choices.filter(function (ch) {
          return !prompt.isDisabled(ch);
        });
        choice.enabled = items.every(function (ch) {
          return ch.enabled === true;
        });
      }

      if (prompt.isDisabled(choice) === true) {
        delete choice.enabled;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return choices;
}

module.exports = ArrayPrompt;
},{"ansi-colors":"node_modules/ansi-colors/index.js","../prompt":"node_modules/enquirer/lib/prompt.js","../roles":"node_modules/enquirer/lib/roles.js","../utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/prompts/select.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ArrayPrompt = require('../types/array');

var utils = require('../utils');

var SelectPrompt = /*#__PURE__*/function (_ArrayPrompt) {
  _inherits(SelectPrompt, _ArrayPrompt);

  var _super = _createSuper(SelectPrompt);

  function SelectPrompt(options) {
    var _this;

    _classCallCheck(this, SelectPrompt);

    _this = _super.call(this, options);
    _this.emptyError = _this.options.emptyError || 'No items were selected';
    return _this;
  }

  _createClass(SelectPrompt, [{
    key: "dispatch",
    value: function () {
      var _dispatch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(s, key) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.multiple) {
                  _context.next = 11;
                  break;
                }

                if (!this[key.name]) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return this[key.name](s, key);

              case 4:
                _context.t0 = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.next = 9;
                return _get(_getPrototypeOf(SelectPrompt.prototype), "dispatch", this).call(this, s, key);

              case 9:
                _context.t0 = _context.sent;

              case 10:
                return _context.abrupt("return", _context.t0);

              case 11:
                this.alert();

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function dispatch(_x, _x2) {
        return _dispatch.apply(this, arguments);
      }

      return dispatch;
    }()
  }, {
    key: "separator",
    value: function separator() {
      if (this.options.separator) return _get(_getPrototypeOf(SelectPrompt.prototype), "separator", this).call(this);
      var sep = this.styles.muted(this.symbols.ellipsis);
      return this.state.submitted ? _get(_getPrototypeOf(SelectPrompt.prototype), "separator", this).call(this) : sep;
    }
  }, {
    key: "pointer",
    value: function pointer(choice, i) {
      return !this.multiple || this.options.pointer ? _get(_getPrototypeOf(SelectPrompt.prototype), "pointer", this).call(this, choice, i) : '';
    }
  }, {
    key: "indicator",
    value: function indicator(choice, i) {
      return this.multiple ? _get(_getPrototypeOf(SelectPrompt.prototype), "indicator", this).call(this, choice, i) : '';
    }
  }, {
    key: "choiceMessage",
    value: function choiceMessage(choice, i) {
      var message = this.resolve(choice.message, this.state, choice, i);

      if (choice.role === 'heading' && !utils.hasColor(message)) {
        message = this.styles.strong(message);
      }

      return this.resolve(message, this.state, choice, i);
    }
  }, {
    key: "choiceSeparator",
    value: function choiceSeparator() {
      return ':';
    }
  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(choice, i) {
        var _this2 = this;

        var focused, pointer, check, hint, ind, msg, line;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.onChoice(choice, i);

              case 2:
                focused = this.index === i;
                _context2.next = 5;
                return this.pointer(choice, i);

              case 5:
                pointer = _context2.sent;
                _context2.next = 8;
                return this.indicator(choice, i);

              case 8:
                _context2.t0 = _context2.sent;
                _context2.t1 = choice.pad || '';
                check = _context2.t0 + _context2.t1;
                _context2.next = 13;
                return this.resolve(choice.hint, this.state, choice, i);

              case 13:
                hint = _context2.sent;

                if (hint && !utils.hasColor(hint)) {
                  hint = this.styles.muted(hint);
                }

                ind = this.indent(choice);
                _context2.next = 18;
                return this.choiceMessage(choice, i);

              case 18:
                msg = _context2.sent;

                line = function line() {
                  return [_this2.margin[3], ind + pointer + check, msg, _this2.margin[1], hint].filter(Boolean).join(' ');
                };

                if (!(choice.role === 'heading')) {
                  _context2.next = 22;
                  break;
                }

                return _context2.abrupt("return", line());

              case 22:
                if (!choice.disabled) {
                  _context2.next = 25;
                  break;
                }

                if (!utils.hasColor(msg)) {
                  msg = this.styles.disabled(msg);
                }

                return _context2.abrupt("return", line());

              case 25:
                if (focused) {
                  msg = this.styles.em(msg);
                }

                return _context2.abrupt("return", line());

              case 27:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function renderChoice(_x3, _x4) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "renderChoices",
    value: function () {
      var _renderChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this3 = this;

        var choices, visible, result, header;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.state.loading === 'choices')) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", this.styles.warning('Loading choices'));

              case 2:
                if (!this.state.submitted) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return", '');

              case 4:
                choices = this.visible.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ch, i) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this3.renderChoice(ch, i);

                          case 2:
                            return _context3.abrupt("return", _context3.sent);

                          case 3:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x5, _x6) {
                    return _ref.apply(this, arguments);
                  };
                }());
                _context4.next = 7;
                return Promise.all(choices);

              case 7:
                visible = _context4.sent;
                if (!visible.length) visible.push(this.styles.danger('No matching choices'));
                result = this.margin[0] + visible.join('\n');

                if (!this.options.choicesHeader) {
                  _context4.next = 14;
                  break;
                }

                _context4.next = 13;
                return this.resolve(this.options.choicesHeader, this.state);

              case 13:
                header = _context4.sent;

              case 14:
                return _context4.abrupt("return", [header, result].filter(Boolean).join('\n'));

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function renderChoices() {
        return _renderChoices.apply(this, arguments);
      }

      return renderChoices;
    }()
  }, {
    key: "format",
    value: function format() {
      var _this4 = this;

      if (!this.state.submitted || this.state.cancelled) return '';

      if (Array.isArray(this.selected)) {
        return this.selected.map(function (choice) {
          return _this4.styles.primary(choice.name);
        }).join(', ');
      }

      return this.styles.primary(this.selected.name);
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this$state, submitted, size, prompt, header, prefix, separator, message, output, help, body, footer;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this$state = this.state, submitted = _this$state.submitted, size = _this$state.size;
                prompt = '';
                _context5.next = 4;
                return this.header();

              case 4:
                header = _context5.sent;
                _context5.next = 7;
                return this.prefix();

              case 7:
                prefix = _context5.sent;
                _context5.next = 10;
                return this.separator();

              case 10:
                separator = _context5.sent;
                _context5.next = 13;
                return this.message();

              case 13:
                message = _context5.sent;

                if (this.options.promptLine !== false) {
                  prompt = [prefix, message, separator, ''].join(' ');
                  this.state.prompt = prompt;
                }

                _context5.next = 17;
                return this.format();

              case 17:
                output = _context5.sent;
                _context5.next = 20;
                return this.error();

              case 20:
                _context5.t0 = _context5.sent;

                if (_context5.t0) {
                  _context5.next = 25;
                  break;
                }

                _context5.next = 24;
                return this.hint();

              case 24:
                _context5.t0 = _context5.sent;

              case 25:
                help = _context5.t0;
                _context5.next = 28;
                return this.renderChoices();

              case 28:
                body = _context5.sent;
                _context5.next = 31;
                return this.footer();

              case 31:
                footer = _context5.sent;
                if (output) prompt += output;
                if (help && !prompt.includes(help)) prompt += ' ' + help;

                if (submitted && !output && !body.trim() && this.multiple && this.emptyError != null) {
                  prompt += this.styles.danger(this.emptyError);
                }

                this.clear(size);
                this.write([header, prompt, body, footer].filter(Boolean).join('\n'));
                this.write(this.margin[2]);
                this.restore();

              case 39:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return SelectPrompt;
}(ArrayPrompt);

module.exports = SelectPrompt;
},{"../types/array":"node_modules/enquirer/lib/types/array.js","../utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/prompts/autocomplete.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Select = require('./select');

var highlight = function highlight(input, color) {
  var val = input.toLowerCase();
  return function (str) {
    var s = str.toLowerCase();
    var i = s.indexOf(val);
    var colored = color(str.slice(i, i + val.length));
    return i >= 0 ? str.slice(0, i) + colored + str.slice(i + val.length) : str;
  };
};

var AutoComplete = /*#__PURE__*/function (_Select) {
  _inherits(AutoComplete, _Select);

  var _super = _createSuper(AutoComplete);

  function AutoComplete(options) {
    var _this;

    _classCallCheck(this, AutoComplete);

    _this = _super.call(this, options);

    _this.cursorShow();

    return _this;
  }

  _createClass(AutoComplete, [{
    key: "moveCursor",
    value: function moveCursor(n) {
      this.state.cursor += n;
    }
  }, {
    key: "dispatch",
    value: function dispatch(ch) {
      return this.append(ch);
    }
  }, {
    key: "space",
    value: function space(ch) {
      return this.options.multiple ? _get(_getPrototypeOf(AutoComplete.prototype), "space", this).call(this, ch) : this.append(ch);
    }
  }, {
    key: "append",
    value: function append(ch) {
      var _this$state = this.state,
          cursor = _this$state.cursor,
          input = _this$state.input;
      this.input = input.slice(0, cursor) + ch + input.slice(cursor);
      this.moveCursor(1);
      return this.complete();
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _this$state2 = this.state,
          cursor = _this$state2.cursor,
          input = _this$state2.input;
      if (!input) return this.alert();
      this.input = input.slice(0, cursor - 1) + input.slice(cursor);
      this.moveCursor(-1);
      return this.complete();
    }
  }, {
    key: "deleteForward",
    value: function deleteForward() {
      var _this$state3 = this.state,
          cursor = _this$state3.cursor,
          input = _this$state3.input;
      if (input[cursor] === void 0) return this.alert();
      this.input = "".concat(input).slice(0, cursor) + "".concat(input).slice(cursor + 1);
      return this.complete();
    }
  }, {
    key: "number",
    value: function number(ch) {
      return this.append(ch);
    }
  }, {
    key: "complete",
    value: function () {
      var _complete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.completing = true;
                _context.next = 3;
                return this.suggest(this.input, this.state._choices);

              case 3:
                this.choices = _context.sent;
                this.state.limit = void 0; // allow getter/setter to reset limit

                this.index = Math.min(Math.max(this.visible.length - 1, 0), this.index);
                _context.next = 8;
                return this.render();

              case 8:
                this.completing = false;

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function complete() {
        return _complete.apply(this, arguments);
      }

      return complete;
    }()
  }, {
    key: "suggest",
    value: function suggest() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.input;
      var choices = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state._choices;

      if (typeof this.options.suggest === 'function') {
        return this.options.suggest.call(this, input, choices);
      }

      var str = input.toLowerCase();
      return choices.filter(function (ch) {
        return ch.message.toLowerCase().includes(str);
      });
    }
  }, {
    key: "pointer",
    value: function pointer() {
      return '';
    }
  }, {
    key: "format",
    value: function format() {
      var _this2 = this;

      if (!this.focused) return this.input;

      if (this.options.multiple && this.state.submitted) {
        return this.selected.map(function (ch) {
          return _this2.styles.primary(ch.message);
        }).join(', ');
      }

      if (this.state.submitted) {
        var value = this.value = this.input = this.focused.value;
        return this.styles.primary(value);
      }

      return this.input;
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var style, color, choices;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.state.status !== 'pending')) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", _get(_getPrototypeOf(AutoComplete.prototype), "render", this).call(this));

              case 2:
                style = this.options.highlight ? this.options.highlight.bind(this) : this.styles.placeholder;
                color = highlight(this.input, style);
                choices = this.choices;
                this.choices = choices.map(function (ch) {
                  return _objectSpread(_objectSpread({}, ch), {}, {
                    message: color(ch.message)
                  });
                });
                _context2.next = 8;
                return _get(_getPrototypeOf(AutoComplete.prototype), "render", this).call(this);

              case 8:
                this.choices = choices;

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "submit",
    value: function submit() {
      if (this.options.multiple) {
        this.value = this.selected.map(function (ch) {
          return ch.name;
        });
      }

      return _get(_getPrototypeOf(AutoComplete.prototype), "submit", this).call(this);
    }
  }]);

  return AutoComplete;
}(Select);

module.exports = AutoComplete;
},{"./select":"node_modules/enquirer/lib/prompts/select.js"}],"node_modules/enquirer/lib/placeholder.js":[function(require,module,exports) {
'use strict';

var utils = require('./utils');
/**
 * Render a placeholder value with cursor and styling based on the
 * position of the cursor.
 *
 * @param {Object} `prompt` Prompt instance.
 * @param {String} `input` Input string.
 * @param {String} `initial` The initial user-provided value.
 * @param {Number} `pos` Current cursor position.
 * @param {Boolean} `showCursor` Render a simulated cursor using the inverse primary style.
 * @return {String} Returns the styled placeholder string.
 * @api public
 */


module.exports = function (prompt) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  prompt.cursorHide();
  var _options$input = options.input,
      input = _options$input === void 0 ? '' : _options$input,
      _options$initial = options.initial,
      initial = _options$initial === void 0 ? '' : _options$initial,
      pos = options.pos,
      _options$showCursor = options.showCursor,
      showCursor = _options$showCursor === void 0 ? true : _options$showCursor,
      color = options.color;
  var style = color || prompt.styles.placeholder;
  var inverse = utils.inverse(prompt.styles.primary);

  var blinker = function blinker(str) {
    return inverse(prompt.styles.black(str));
  };

  var output = input;
  var char = ' ';
  var reverse = blinker(char);

  if (prompt.blink && prompt.blink.off === true) {
    blinker = function blinker(str) {
      return str;
    };

    reverse = '';
  }

  if (showCursor && pos === 0 && initial === '' && input === '') {
    return blinker(char);
  }

  if (showCursor && pos === 0 && (input === initial || input === '')) {
    return blinker(initial[0]) + style(initial.slice(1));
  }

  initial = utils.isPrimitive(initial) ? "".concat(initial) : '';
  input = utils.isPrimitive(input) ? "".concat(input) : '';
  var placeholder = initial && initial.startsWith(input) && initial !== input;
  var cursor = placeholder ? blinker(initial[input.length]) : reverse;

  if (pos !== input.length && showCursor === true) {
    output = input.slice(0, pos) + blinker(input[pos]) + input.slice(pos + 1);
    cursor = '';
  }

  if (showCursor === false) {
    cursor = '';
  }

  if (placeholder) {
    var raw = prompt.styles.unstyle(output + cursor);
    return output + cursor + style(initial.slice(raw.length));
  }

  return output + cursor;
};
},{"./utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/prompts/form.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var colors = require('ansi-colors');

var SelectPrompt = require('./select');

var placeholder = require('../placeholder');

var FormPrompt = /*#__PURE__*/function (_SelectPrompt) {
  _inherits(FormPrompt, _SelectPrompt);

  var _super = _createSuper(FormPrompt);

  function FormPrompt(options) {
    var _this;

    _classCallCheck(this, FormPrompt);

    _this = _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
      multiple: true
    }));
    _this.type = 'form';
    _this.initial = _this.options.initial;
    _this.align = [_this.options.align, 'right'].find(function (v) {
      return v != null;
    });
    _this.emptyError = '';
    _this.values = {};
    return _this;
  }

  _createClass(FormPrompt, [{
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(first) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _get(_getPrototypeOf(FormPrompt.prototype), "reset", this).call(this);

              case 2:
                if (first === true) this._index = this.index;
                this.index = this._index;
                this.values = {};
                this.choices.forEach(function (choice) {
                  return choice.reset && choice.reset();
                });
                return _context.abrupt("return", this.render());

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function reset(_x) {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: "dispatch",
    value: function dispatch(char) {
      return !!char && this.append(char);
    }
  }, {
    key: "append",
    value: function append(char) {
      var choice = this.focused;
      if (!choice) return this.alert();
      var cursor = choice.cursor,
          input = choice.input;
      choice.value = choice.input = input.slice(0, cursor) + char + input.slice(cursor);
      choice.cursor++;
      return this.render();
    }
  }, {
    key: "delete",
    value: function _delete() {
      var choice = this.focused;
      if (!choice || choice.cursor <= 0) return this.alert();
      var cursor = choice.cursor,
          input = choice.input;
      choice.value = choice.input = input.slice(0, cursor - 1) + input.slice(cursor);
      choice.cursor--;
      return this.render();
    }
  }, {
    key: "deleteForward",
    value: function deleteForward() {
      var choice = this.focused;
      if (!choice) return this.alert();
      var cursor = choice.cursor,
          input = choice.input;
      if (input[cursor] === void 0) return this.alert();
      var str = "".concat(input).slice(0, cursor) + "".concat(input).slice(cursor + 1);
      choice.value = choice.input = str;
      return this.render();
    }
  }, {
    key: "right",
    value: function right() {
      var choice = this.focused;
      if (!choice) return this.alert();
      if (choice.cursor >= choice.input.length) return this.alert();
      choice.cursor++;
      return this.render();
    }
  }, {
    key: "left",
    value: function left() {
      var choice = this.focused;
      if (!choice) return this.alert();
      if (choice.cursor <= 0) return this.alert();
      choice.cursor--;
      return this.render();
    }
  }, {
    key: "space",
    value: function space(ch, key) {
      return this.dispatch(ch, key);
    }
  }, {
    key: "number",
    value: function number(ch, key) {
      return this.dispatch(ch, key);
    }
  }, {
    key: "next",
    value: function next() {
      var ch = this.focused;
      if (!ch) return this.alert();
      var initial = ch.initial,
          input = ch.input;

      if (initial && initial.startsWith(input) && input !== initial) {
        ch.value = ch.input = initial;
        ch.cursor = ch.value.length;
        return this.render();
      }

      return _get(_getPrototypeOf(FormPrompt.prototype), "next", this).call(this);
    }
  }, {
    key: "prev",
    value: function prev() {
      var ch = this.focused;
      if (!ch) return this.alert();
      if (ch.cursor === 0) return _get(_getPrototypeOf(FormPrompt.prototype), "prev", this).call(this);
      ch.value = ch.input = '';
      ch.cursor = 0;
      return this.render();
    }
  }, {
    key: "separator",
    value: function separator() {
      return '';
    }
  }, {
    key: "format",
    value: function format(value) {
      return !this.state.submitted ? _get(_getPrototypeOf(FormPrompt.prototype), "format", this).call(this, value) : '';
    }
  }, {
    key: "pointer",
    value: function pointer() {
      return '';
    }
  }, {
    key: "indicator",
    value: function indicator(choice) {
      return choice.input ? '⦿' : '⊙';
    }
  }, {
    key: "choiceSeparator",
    value: function () {
      var _choiceSeparator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(choice, i) {
        var sep;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.resolve(choice.separator, this.state, choice, i);

              case 2:
                _context2.t0 = _context2.sent;

                if (_context2.t0) {
                  _context2.next = 5;
                  break;
                }

                _context2.t0 = ':';

              case 5:
                sep = _context2.t0;
                return _context2.abrupt("return", sep ? ' ' + this.styles.disabled(sep) : '');

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function choiceSeparator(_x2, _x3) {
        return _choiceSeparator.apply(this, arguments);
      }

      return choiceSeparator;
    }()
  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(choice, i) {
        var state, styles, cursor, _choice$initial, initial, name, hint, _choice$input, input, muted, submitted, primary, danger, help, focused, validate, sep, msg, value, color, style, indicator, indent, line, _color, options;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.onChoice(choice, i);

              case 2:
                state = this.state, styles = this.styles;
                cursor = choice.cursor, _choice$initial = choice.initial, initial = _choice$initial === void 0 ? '' : _choice$initial, name = choice.name, hint = choice.hint, _choice$input = choice.input, input = _choice$input === void 0 ? '' : _choice$input;
                muted = styles.muted, submitted = styles.submitted, primary = styles.primary, danger = styles.danger;
                help = hint;
                focused = this.index === i;

                validate = choice.validate || function () {
                  return true;
                };

                _context3.next = 10;
                return this.choiceSeparator(choice, i);

              case 10:
                sep = _context3.sent;
                msg = choice.message;
                if (this.align === 'right') msg = msg.padStart(this.longest + 1, ' ');
                if (this.align === 'left') msg = msg.padEnd(this.longest + 1, ' '); // re-populate the form values (answers) object

                value = this.values[name] = input || initial;
                color = input ? 'success' : 'dark';
                _context3.next = 18;
                return validate.call(choice, value, this.state);

              case 18:
                _context3.t0 = _context3.sent;

                if (!(_context3.t0 !== true)) {
                  _context3.next = 21;
                  break;
                }

                color = 'danger';

              case 21:
                style = styles[color];
                _context3.t1 = style;
                _context3.next = 25;
                return this.indicator(choice, i);

              case 25:
                _context3.t2 = _context3.sent;
                _context3.t3 = (0, _context3.t1)(_context3.t2);
                _context3.t4 = choice.pad || '';
                indicator = _context3.t3 + _context3.t4;
                indent = this.indent(choice);

                line = function line() {
                  return [indent, indicator, msg + sep, input, help].filter(Boolean).join(' ');
                };

                if (!state.submitted) {
                  _context3.next = 36;
                  break;
                }

                msg = colors.unstyle(msg);
                input = submitted(input);
                help = '';
                return _context3.abrupt("return", line());

              case 36:
                if (!choice.format) {
                  _context3.next = 42;
                  break;
                }

                _context3.next = 39;
                return choice.format.call(this, input, choice, i);

              case 39:
                input = _context3.sent;
                _context3.next = 45;
                break;

              case 42:
                _color = this.styles.muted;
                options = {
                  input: input,
                  initial: initial,
                  pos: cursor,
                  showCursor: focused,
                  color: _color
                };
                input = placeholder(this, options);

              case 45:
                if (!this.isValue(input)) {
                  input = this.styles.muted(this.symbols.ellipsis);
                }

                if (!choice.result) {
                  _context3.next = 50;
                  break;
                }

                _context3.next = 49;
                return choice.result.call(this, value, choice, i);

              case 49:
                this.values[name] = _context3.sent;

              case 50:
                if (focused) {
                  msg = primary(msg);
                }

                if (choice.error) {
                  input += (input ? ' ' : '') + danger(choice.error.trim());
                } else if (choice.hint) {
                  input += (input ? ' ' : '') + muted(choice.hint.trim());
                }

                return _context3.abrupt("return", line());

              case 53:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function renderChoice(_x4, _x5) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.value = this.values;
                return _context4.abrupt("return", _get(_getPrototypeOf(FormPrompt.prototype), "base", this).submit.call(this));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }]);

  return FormPrompt;
}(SelectPrompt);

module.exports = FormPrompt;
},{"ansi-colors":"node_modules/ansi-colors/index.js","./select":"node_modules/enquirer/lib/prompts/select.js","../placeholder":"node_modules/enquirer/lib/placeholder.js"}],"node_modules/enquirer/lib/types/auth.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FormPrompt = require('../prompts/form');

var defaultAuthenticate = function defaultAuthenticate() {
  throw new Error('expected prompt to have a custom authenticate method');
};

var factory = function factory() {
  var authenticate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAuthenticate;

  var AuthPrompt = /*#__PURE__*/function (_FormPrompt) {
    _inherits(AuthPrompt, _FormPrompt);

    var _super = _createSuper(AuthPrompt);

    function AuthPrompt(options) {
      _classCallCheck(this, AuthPrompt);

      return _super.call(this, options);
    }

    _createClass(AuthPrompt, [{
      key: "submit",
      value: function () {
        var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return authenticate.call(this, this.values, this.state);

                case 2:
                  this.value = _context.sent;

                  _get(_getPrototypeOf(AuthPrompt.prototype), "base", this).submit.call(this);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function submit() {
          return _submit.apply(this, arguments);
        }

        return submit;
      }()
    }], [{
      key: "create",
      value: function create(authenticate) {
        return factory(authenticate);
      }
    }]);

    return AuthPrompt;
  }(FormPrompt);

  return AuthPrompt;
};

module.exports = factory();
},{"../prompts/form":"node_modules/enquirer/lib/prompts/form.js"}],"node_modules/enquirer/lib/prompts/basicauth.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AuthPrompt = require('../types/auth');

function defaultAuthenticate(value, state) {
  if (value.username === this.options.username && value.password === this.options.password) {
    return true;
  }

  return false;
}

var factory = function factory() {
  var authenticate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultAuthenticate;
  var choices = [{
    name: 'username',
    message: 'username'
  }, {
    name: 'password',
    message: 'password',
    format: function format(input) {
      if (this.options.showPassword) {
        return input;
      }

      var color = this.state.submitted ? this.styles.primary : this.styles.muted;
      return color(this.symbols.asterisk.repeat(input.length));
    }
  }];

  var BasicAuthPrompt = /*#__PURE__*/function (_AuthPrompt$create) {
    _inherits(BasicAuthPrompt, _AuthPrompt$create);

    var _super = _createSuper(BasicAuthPrompt);

    function BasicAuthPrompt(options) {
      _classCallCheck(this, BasicAuthPrompt);

      return _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
        choices: choices
      }));
    }

    _createClass(BasicAuthPrompt, null, [{
      key: "create",
      value: function create(authenticate) {
        return factory(authenticate);
      }
    }]);

    return BasicAuthPrompt;
  }(AuthPrompt.create(authenticate));

  return BasicAuthPrompt;
};

module.exports = factory();
},{"../types/auth":"node_modules/enquirer/lib/types/auth.js"}],"node_modules/enquirer/lib/types/boolean.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Prompt = require('../prompt');

var _require = require('../utils'),
    isPrimitive = _require.isPrimitive,
    hasColor = _require.hasColor;

var BooleanPrompt = /*#__PURE__*/function (_Prompt) {
  _inherits(BooleanPrompt, _Prompt);

  var _super = _createSuper(BooleanPrompt);

  function BooleanPrompt(options) {
    var _this;

    _classCallCheck(this, BooleanPrompt);

    _this = _super.call(this, options);

    _this.cursorHide();

    return _this;
  }

  _createClass(BooleanPrompt, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var initial;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.resolve(this.initial, this.state);

              case 2:
                initial = _context.sent;
                _context.next = 5;
                return this.cast(initial);

              case 5:
                this.input = _context.sent;
                _context.next = 8;
                return _get(_getPrototypeOf(BooleanPrompt.prototype), "initialize", this).call(this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "dispatch",
    value: function dispatch(ch) {
      if (!this.isValue(ch)) return this.alert();
      this.input = ch;
      return this.submit();
    }
  }, {
    key: "format",
    value: function format(value) {
      var styles = this.styles,
          state = this.state;
      return !state.submitted ? styles.primary(value) : styles.success(value);
    }
  }, {
    key: "cast",
    value: function cast(input) {
      return this.isTrue(input);
    }
  }, {
    key: "isTrue",
    value: function isTrue(input) {
      return /^[ty1]/i.test(input);
    }
  }, {
    key: "isFalse",
    value: function isFalse(input) {
      return /^[fn0]/i.test(input);
    }
  }, {
    key: "isValue",
    value: function isValue(value) {
      return isPrimitive(value) && (this.isTrue(value) || this.isFalse(value));
    }
  }, {
    key: "hint",
    value: function () {
      var _hint = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _hint2;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.state.status === 'pending')) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 3;
                return this.element('hint');

              case 3:
                _hint2 = _context2.sent;

                if (hasColor(_hint2)) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", this.styles.muted(_hint2));

              case 6:
                return _context2.abrupt("return", _hint2);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function hint() {
        return _hint.apply(this, arguments);
      }

      return hint;
    }()
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this$state, input, size, prefix, sep, msg, hint, promptLine, header, value, output, help, footer;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this$state = this.state, input = _this$state.input, size = _this$state.size;
                _context3.next = 3;
                return this.prefix();

              case 3:
                prefix = _context3.sent;
                _context3.next = 6;
                return this.separator();

              case 6:
                sep = _context3.sent;
                _context3.next = 9;
                return this.message();

              case 9:
                msg = _context3.sent;
                hint = this.styles.muted(this.default);
                promptLine = [prefix, msg, hint, sep].filter(Boolean).join(' ');
                this.state.prompt = promptLine;
                _context3.next = 15;
                return this.header();

              case 15:
                header = _context3.sent;
                value = this.value = this.cast(input);
                _context3.next = 19;
                return this.format(value);

              case 19:
                output = _context3.sent;
                _context3.next = 22;
                return this.error();

              case 22:
                _context3.t0 = _context3.sent;

                if (_context3.t0) {
                  _context3.next = 27;
                  break;
                }

                _context3.next = 26;
                return this.hint();

              case 26:
                _context3.t0 = _context3.sent;

              case 27:
                help = _context3.t0;
                _context3.next = 30;
                return this.footer();

              case 30:
                footer = _context3.sent;
                if (help && !promptLine.includes(help)) output += ' ' + help;
                promptLine += ' ' + output;
                this.clear(size);
                this.write([header, promptLine, footer].filter(Boolean).join('\n'));
                this.restore();

              case 36:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "value",
    set: function set(value) {
      _set(_getPrototypeOf(BooleanPrompt.prototype), "value", value, this, true);
    },
    get: function get() {
      return this.cast(_get(_getPrototypeOf(BooleanPrompt.prototype), "value", this));
    }
  }]);

  return BooleanPrompt;
}(Prompt);

module.exports = BooleanPrompt;
},{"../prompt":"node_modules/enquirer/lib/prompt.js","../utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/prompts/confirm.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BooleanPrompt = require('../types/boolean');

var ConfirmPrompt = /*#__PURE__*/function (_BooleanPrompt) {
  _inherits(ConfirmPrompt, _BooleanPrompt);

  var _super = _createSuper(ConfirmPrompt);

  function ConfirmPrompt(options) {
    var _this;

    _classCallCheck(this, ConfirmPrompt);

    _this = _super.call(this, options);
    _this.default = _this.options.default || (_this.initial ? '(Y/n)' : '(y/N)');
    return _this;
  }

  return ConfirmPrompt;
}(BooleanPrompt);

module.exports = ConfirmPrompt;
},{"../types/boolean":"node_modules/enquirer/lib/types/boolean.js"}],"node_modules/enquirer/lib/prompts/editable.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Select = require('./select');

var Form = require('./form');

var form = Form.prototype;

var Editable = /*#__PURE__*/function (_Select) {
  _inherits(Editable, _Select);

  var _super = _createSuper(Editable);

  function Editable(options) {
    var _this;

    _classCallCheck(this, Editable);

    _this = _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
      multiple: true
    }));
    _this.align = [_this.options.align, 'left'].find(function (v) {
      return v != null;
    });
    _this.emptyError = '';
    _this.values = {};
    return _this;
  }

  _createClass(Editable, [{
    key: "dispatch",
    value: function dispatch(char, key) {
      var choice = this.focused;
      var parent = choice.parent || {};

      if (!choice.editable && !parent.editable) {
        if (char === 'a' || char === 'i') return _get(_getPrototypeOf(Editable.prototype), char, this).call(this);
      }

      return form.dispatch.call(this, char, key);
    }
  }, {
    key: "append",
    value: function append(char, key) {
      return form.append.call(this, char, key);
    }
  }, {
    key: "delete",
    value: function _delete(char, key) {
      return form.delete.call(this, char, key);
    }
  }, {
    key: "space",
    value: function space(char) {
      return this.focused.editable ? this.append(char) : _get(_getPrototypeOf(Editable.prototype), "space", this).call(this);
    }
  }, {
    key: "number",
    value: function number(char) {
      return this.focused.editable ? this.append(char) : _get(_getPrototypeOf(Editable.prototype), "number", this).call(this, char);
    }
  }, {
    key: "next",
    value: function next() {
      return this.focused.editable ? form.next.call(this) : _get(_getPrototypeOf(Editable.prototype), "next", this).call(this);
    }
  }, {
    key: "prev",
    value: function prev() {
      return this.focused.editable ? form.prev.call(this) : _get(_getPrototypeOf(Editable.prototype), "prev", this).call(this);
    }
  }, {
    key: "indicator",
    value: function () {
      var _indicator = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(choice, i) {
        var symbol, value;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                symbol = choice.indicator || '';
                value = choice.editable ? symbol : _get(_getPrototypeOf(Editable.prototype), "indicator", this).call(this, choice, i);
                _context.next = 4;
                return this.resolve(value, this.state, choice, i);

              case 4:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 7;
                  break;
                }

                _context.t0 = '';

              case 7:
                return _context.abrupt("return", _context.t0);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function indicator(_x, _x2) {
        return _indicator.apply(this, arguments);
      }

      return indicator;
    }()
  }, {
    key: "indent",
    value: function indent(choice) {
      return choice.role === 'heading' ? '' : choice.editable ? ' ' : '  ';
    }
  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(choice, i) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                choice.indent = '';

                if (!choice.editable) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", form.renderChoice.call(this, choice, i));

              case 3:
                return _context2.abrupt("return", _get(_getPrototypeOf(Editable.prototype), "renderChoice", this).call(this, choice, i));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function renderChoice(_x3, _x4) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "error",
    value: function error() {
      return '';
    }
  }, {
    key: "footer",
    value: function footer() {
      return this.state.error;
    }
  }, {
    key: "validate",
    value: function () {
      var _validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var result, _iterator, _step, choice, val;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                result = true;
                _iterator = _createForOfIteratorHelper(this.choices);
                _context3.prev = 2;

                _iterator.s();

              case 4:
                if ((_step = _iterator.n()).done) {
                  _context3.next = 19;
                  break;
                }

                choice = _step.value;

                if (!(typeof choice.validate !== 'function')) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("continue", 17);

              case 8:
                if (!(choice.role === 'heading')) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("continue", 17);

              case 10:
                val = choice.parent ? this.value[choice.parent.name] : this.value;

                if (choice.editable) {
                  val = choice.value === choice.name ? choice.initial || '' : choice.value;
                } else if (!this.isDisabled(choice)) {
                  val = choice.enabled === true;
                }

                _context3.next = 14;
                return choice.validate(val, this.state);

              case 14:
                result = _context3.sent;

                if (!(result !== true)) {
                  _context3.next = 17;
                  break;
                }

                return _context3.abrupt("break", 19);

              case 17:
                _context3.next = 4;
                break;

              case 19:
                _context3.next = 24;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](2);

                _iterator.e(_context3.t0);

              case 24:
                _context3.prev = 24;

                _iterator.f();

                return _context3.finish(24);

              case 27:
                if (result !== true) {
                  this.state.error = typeof result === 'string' ? result : 'Invalid Input';
                }

                return _context3.abrupt("return", result);

              case 29:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 21, 24, 27]]);
      }));

      function validate() {
        return _validate.apply(this, arguments);
      }

      return validate;
    }()
  }, {
    key: "submit",
    value: function submit() {
      if (this.focused.newChoice === true) return _get(_getPrototypeOf(Editable.prototype), "submit", this).call(this);

      if (this.choices.some(function (ch) {
        return ch.newChoice;
      })) {
        return this.alert();
      }

      this.value = {};

      var _iterator2 = _createForOfIteratorHelper(this.choices),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var choice = _step2.value;
          var val = choice.parent ? this.value[choice.parent.name] : this.value;

          if (choice.role === 'heading') {
            this.value[choice.name] = {};
            continue;
          }

          if (choice.editable) {
            val[choice.name] = choice.value === choice.name ? choice.initial || '' : choice.value;
          } else if (!this.isDisabled(choice)) {
            val[choice.name] = choice.enabled === true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return this.base.submit.call(this);
    }
  }]);

  return Editable;
}(Select);

module.exports = Editable;
},{"./select":"node_modules/enquirer/lib/prompts/select.js","./form":"node_modules/enquirer/lib/prompts/form.js"}],"node_modules/enquirer/lib/types/string.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Prompt = require('../prompt');

var placeholder = require('../placeholder');

var _require = require('../utils'),
    isPrimitive = _require.isPrimitive;

var StringPrompt = /*#__PURE__*/function (_Prompt) {
  _inherits(StringPrompt, _Prompt);

  var _super = _createSuper(StringPrompt);

  function StringPrompt(options) {
    var _this;

    _classCallCheck(this, StringPrompt);

    _this = _super.call(this, options);
    _this.initial = isPrimitive(_this.initial) ? String(_this.initial) : '';
    if (_this.initial) _this.cursorHide();
    _this.state.prevCursor = 0;
    _this.state.clipboard = [];
    return _this;
  }

  _createClass(StringPrompt, [{
    key: "keypress",
    value: function () {
      var _keypress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(input) {
        var key,
            prev,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                key = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                prev = this.state.prevKeypress;
                this.state.prevKeypress = key;

                if (!(this.options.multiline === true && key.name === 'return')) {
                  _context.next = 6;
                  break;
                }

                if (!(!prev || prev.name !== 'return')) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", this.append('\n', key));

              case 6:
                return _context.abrupt("return", _get(_getPrototypeOf(StringPrompt.prototype), "keypress", this).call(this, input, key));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function keypress(_x) {
        return _keypress.apply(this, arguments);
      }

      return keypress;
    }()
  }, {
    key: "moveCursor",
    value: function moveCursor(n) {
      this.cursor += n;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.input = this.value = '';
      this.cursor = 0;
      return this.render();
    }
  }, {
    key: "dispatch",
    value: function dispatch(ch, key) {
      if (!ch || key.ctrl || key.code) return this.alert();
      this.append(ch);
    }
  }, {
    key: "append",
    value: function append(ch) {
      var _this$state = this.state,
          cursor = _this$state.cursor,
          input = _this$state.input;
      this.input = "".concat(input).slice(0, cursor) + ch + "".concat(input).slice(cursor);
      this.moveCursor(String(ch).length);
      this.render();
    }
  }, {
    key: "insert",
    value: function insert(str) {
      this.append(str);
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _this$state2 = this.state,
          cursor = _this$state2.cursor,
          input = _this$state2.input;
      if (cursor <= 0) return this.alert();
      this.input = "".concat(input).slice(0, cursor - 1) + "".concat(input).slice(cursor);
      this.moveCursor(-1);
      this.render();
    }
  }, {
    key: "deleteForward",
    value: function deleteForward() {
      var _this$state3 = this.state,
          cursor = _this$state3.cursor,
          input = _this$state3.input;
      if (input[cursor] === void 0) return this.alert();
      this.input = "".concat(input).slice(0, cursor) + "".concat(input).slice(cursor + 1);
      this.render();
    }
  }, {
    key: "cutForward",
    value: function cutForward() {
      var pos = this.cursor;
      if (this.input.length <= pos) return this.alert();
      this.state.clipboard.push(this.input.slice(pos));
      this.input = this.input.slice(0, pos);
      this.render();
    }
  }, {
    key: "cutLeft",
    value: function cutLeft() {
      var pos = this.cursor;
      if (pos === 0) return this.alert();
      var before = this.input.slice(0, pos);
      var after = this.input.slice(pos);
      var words = before.split(' ');
      this.state.clipboard.push(words.pop());
      this.input = words.join(' ');
      this.cursor = this.input.length;
      this.input += after;
      this.render();
    }
  }, {
    key: "paste",
    value: function paste() {
      if (!this.state.clipboard.length) return this.alert();
      this.insert(this.state.clipboard.pop());
      this.render();
    }
  }, {
    key: "toggleCursor",
    value: function toggleCursor() {
      if (this.state.prevCursor) {
        this.cursor = this.state.prevCursor;
        this.state.prevCursor = 0;
      } else {
        this.state.prevCursor = this.cursor;
        this.cursor = 0;
      }

      this.render();
    }
  }, {
    key: "first",
    value: function first() {
      this.cursor = 0;
      this.render();
    }
  }, {
    key: "last",
    value: function last() {
      this.cursor = this.input.length - 1;
      this.render();
    }
  }, {
    key: "next",
    value: function next() {
      var init = this.initial != null ? String(this.initial) : '';
      if (!init || !init.startsWith(this.input)) return this.alert();
      this.input = this.initial;
      this.cursor = this.initial.length;
      this.render();
    }
  }, {
    key: "prev",
    value: function prev() {
      if (!this.input) return this.alert();
      this.reset();
    }
  }, {
    key: "backward",
    value: function backward() {
      return this.left();
    }
  }, {
    key: "forward",
    value: function forward() {
      return this.right();
    }
  }, {
    key: "right",
    value: function right() {
      if (this.cursor >= this.input.length) return this.alert();
      this.moveCursor(1);
      return this.render();
    }
  }, {
    key: "left",
    value: function left() {
      if (this.cursor <= 0) return this.alert();
      this.moveCursor(-1);
      return this.render();
    }
  }, {
    key: "isValue",
    value: function isValue(value) {
      return !!value;
    }
  }, {
    key: "format",
    value: function () {
      var _format = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var input,
            initial,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                input = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : this.value;
                _context2.next = 3;
                return this.resolve(this.initial, this.state);

              case 3:
                initial = _context2.sent;

                if (this.state.submitted) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", placeholder(this, {
                  input: input,
                  initial: initial,
                  pos: this.cursor
                }));

              case 6:
                return _context2.abrupt("return", this.styles.submitted(input || initial));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function format() {
        return _format.apply(this, arguments);
      }

      return format;
    }()
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var size, prefix, separator, message, prompt, header, output, help, footer;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                size = this.state.size;
                _context3.next = 3;
                return this.prefix();

              case 3:
                prefix = _context3.sent;
                _context3.next = 6;
                return this.separator();

              case 6:
                separator = _context3.sent;
                _context3.next = 9;
                return this.message();

              case 9:
                message = _context3.sent;
                prompt = [prefix, message, separator].filter(Boolean).join(' ');
                this.state.prompt = prompt;
                _context3.next = 14;
                return this.header();

              case 14:
                header = _context3.sent;
                _context3.next = 17;
                return this.format();

              case 17:
                output = _context3.sent;
                _context3.next = 20;
                return this.error();

              case 20:
                _context3.t0 = _context3.sent;

                if (_context3.t0) {
                  _context3.next = 25;
                  break;
                }

                _context3.next = 24;
                return this.hint();

              case 24:
                _context3.t0 = _context3.sent;

              case 25:
                help = _context3.t0;
                _context3.next = 28;
                return this.footer();

              case 28:
                footer = _context3.sent;
                if (help && !output.includes(help)) output += ' ' + help;
                prompt += ' ' + output;
                this.clear(size);
                this.write([header, prompt, footer].filter(Boolean).join('\n'));
                this.restore();

              case 34:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return StringPrompt;
}(Prompt);

module.exports = StringPrompt;
},{"../prompt":"node_modules/enquirer/lib/prompt.js","../placeholder":"node_modules/enquirer/lib/placeholder.js","../utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/completer.js":[function(require,module,exports) {
'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var unique = function unique(arr) {
  return arr.filter(function (v, i) {
    return arr.lastIndexOf(v) === i;
  });
};

var compact = function compact(arr) {
  return unique(arr).filter(Boolean);
};

module.exports = function (action) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var _data$past = data.past,
      past = _data$past === void 0 ? [] : _data$past,
      _data$present = data.present,
      present = _data$present === void 0 ? '' : _data$present;
  var rest, prev;

  switch (action) {
    case 'prev':
    case 'undo':
      rest = past.slice(0, past.length - 1);
      prev = past[past.length - 1] || '';
      return {
        past: compact([value].concat(_toConsumableArray(rest))),
        present: prev
      };

    case 'next':
    case 'redo':
      rest = past.slice(1);
      prev = past[0] || '';
      return {
        past: compact([].concat(_toConsumableArray(rest), [value])),
        present: prev
      };

    case 'save':
      return {
        past: compact([].concat(_toConsumableArray(past), [value])),
        present: ''
      };

    case 'remove':
      prev = compact(past.filter(function (v) {
        return v !== value;
      }));
      present = '';

      if (prev.length) {
        present = prev.pop();
      }

      return {
        past: prev,
        present: present
      };

    default:
      {
        throw new Error("Invalid action: \"".concat(action, "\""));
      }
  }
};
},{}],"node_modules/enquirer/lib/prompts/input.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Prompt = require('../types/string');

var completer = require('../completer');

var Input = /*#__PURE__*/function (_Prompt) {
  _inherits(Input, _Prompt);

  var _super = _createSuper(Input);

  function Input(options) {
    var _this;

    _classCallCheck(this, Input);

    _this = _super.call(this, options);
    var history = _this.options.history;

    if (history && history.store) {
      var initial = history.values || _this.initial;
      _this.autosave = !!history.autosave;
      _this.store = history.store;
      _this.data = _this.store.get('values') || {
        past: [],
        present: initial
      };
      _this.initial = _this.data.present || _this.data.past[_this.data.past.length - 1];
    }

    return _this;
  }

  _createClass(Input, [{
    key: "completion",
    value: function completion(action) {
      if (!this.store) return this.alert();
      this.data = completer(action, this.data, this.input);
      if (!this.data.present) return this.alert();
      this.input = this.data.present;
      this.cursor = this.input.length;
      return this.render();
    }
  }, {
    key: "altUp",
    value: function altUp() {
      return this.completion('prev');
    }
  }, {
    key: "altDown",
    value: function altDown() {
      return this.completion('next');
    }
  }, {
    key: "prev",
    value: function prev() {
      this.save();
      return _get(_getPrototypeOf(Input.prototype), "prev", this).call(this);
    }
  }, {
    key: "save",
    value: function save() {
      if (!this.store) return;
      this.data = completer('save', this.data, this.input);
      this.store.set('values', this.data);
    }
  }, {
    key: "submit",
    value: function submit() {
      if (this.store && this.autosave === true) {
        this.save();
      }

      return _get(_getPrototypeOf(Input.prototype), "submit", this).call(this);
    }
  }]);

  return Input;
}(Prompt);

module.exports = Input;
},{"../types/string":"node_modules/enquirer/lib/types/string.js","../completer":"node_modules/enquirer/lib/completer.js"}],"node_modules/enquirer/lib/prompts/invisible.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var StringPrompt = require('../types/string');

var InvisiblePrompt = /*#__PURE__*/function (_StringPrompt) {
  _inherits(InvisiblePrompt, _StringPrompt);

  var _super = _createSuper(InvisiblePrompt);

  function InvisiblePrompt() {
    _classCallCheck(this, InvisiblePrompt);

    return _super.apply(this, arguments);
  }

  _createClass(InvisiblePrompt, [{
    key: "format",
    value: function format() {
      return '';
    }
  }]);

  return InvisiblePrompt;
}(StringPrompt);

module.exports = InvisiblePrompt;
},{"../types/string":"node_modules/enquirer/lib/types/string.js"}],"node_modules/enquirer/lib/prompts/list.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var StringPrompt = require('../types/string');

var ListPrompt = /*#__PURE__*/function (_StringPrompt) {
  _inherits(ListPrompt, _StringPrompt);

  var _super = _createSuper(ListPrompt);

  function ListPrompt() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ListPrompt);

    _this = _super.call(this, options);
    _this.sep = _this.options.separator || /, */;
    _this.initial = options.initial || '';
    return _this;
  }

  _createClass(ListPrompt, [{
    key: "split",
    value: function split() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value;
      return input ? String(input).split(this.sep) : [];
    }
  }, {
    key: "format",
    value: function format() {
      var style = this.state.submitted ? this.styles.primary : function (val) {
        return val;
      };
      return this.list.map(style).join(', ');
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = this.state.error;

                if (_context.t0) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return this.validate(this.list, this.state);

              case 4:
                _context.t0 = _context.sent;

              case 5:
                result = _context.t0;

                if (!(result !== true)) {
                  _context.next = 9;
                  break;
                }

                this.state.error = result;
                return _context.abrupt("return", _get(_getPrototypeOf(ListPrompt.prototype), "submit", this).call(this));

              case 9:
                this.value = this.list;
                return _context.abrupt("return", _get(_getPrototypeOf(ListPrompt.prototype), "submit", this).call(this));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function submit(_x) {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "list",
    get: function get() {
      return this.split();
    }
  }]);

  return ListPrompt;
}(StringPrompt);

module.exports = ListPrompt;
},{"../types/string":"node_modules/enquirer/lib/types/string.js"}],"node_modules/enquirer/lib/prompts/multiselect.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Select = require('./select');

var MultiSelect = /*#__PURE__*/function (_Select) {
  _inherits(MultiSelect, _Select);

  var _super = _createSuper(MultiSelect);

  function MultiSelect(options) {
    _classCallCheck(this, MultiSelect);

    return _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
      multiple: true
    }));
  }

  return MultiSelect;
}(Select);

module.exports = MultiSelect;
},{"./select":"node_modules/enquirer/lib/prompts/select.js"}],"node_modules/enquirer/lib/types/number.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var StringPrompt = require('./string');

var NumberPrompt = /*#__PURE__*/function (_StringPrompt) {
  _inherits(NumberPrompt, _StringPrompt);

  var _super = _createSuper(NumberPrompt);

  function NumberPrompt() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, NumberPrompt);

    _this = _super.call(this, _objectSpread({
      style: 'number'
    }, options));
    _this.min = _this.isValue(options.min) ? _this.toNumber(options.min) : -Infinity;
    _this.max = _this.isValue(options.max) ? _this.toNumber(options.max) : Infinity;
    _this.delay = options.delay != null ? options.delay : 1000;
    _this.float = options.float !== false;
    _this.round = options.round === true || options.float === false;
    _this.major = options.major || 10;
    _this.minor = options.minor || 1;
    _this.initial = options.initial != null ? options.initial : '';
    _this.input = String(_this.initial);
    _this.cursor = _this.input.length;

    _this.cursorShow();

    return _this;
  }

  _createClass(NumberPrompt, [{
    key: "append",
    value: function append(ch) {
      if (!/[-+.]/.test(ch) || ch === '.' && this.input.includes('.')) {
        return this.alert('invalid number');
      }

      return _get(_getPrototypeOf(NumberPrompt.prototype), "append", this).call(this, ch);
    }
  }, {
    key: "number",
    value: function number(ch) {
      return _get(_getPrototypeOf(NumberPrompt.prototype), "append", this).call(this, ch);
    }
  }, {
    key: "next",
    value: function next() {
      if (this.input && this.input !== this.initial) return this.alert();
      if (!this.isValue(this.initial)) return this.alert();
      this.input = this.initial;
      this.cursor = String(this.initial).length;
      return this.render();
    }
  }, {
    key: "up",
    value: function up(number) {
      var step = number || this.minor;
      var num = this.toNumber(this.input);
      if (num > this.max + step) return this.alert();
      this.input = "".concat(num + step);
      return this.render();
    }
  }, {
    key: "down",
    value: function down(number) {
      var step = number || this.minor;
      var num = this.toNumber(this.input);
      if (num < this.min - step) return this.alert();
      this.input = "".concat(num - step);
      return this.render();
    }
  }, {
    key: "shiftDown",
    value: function shiftDown() {
      return this.down(this.major);
    }
  }, {
    key: "shiftUp",
    value: function shiftUp() {
      return this.up(this.major);
    }
  }, {
    key: "format",
    value: function format() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.input;

      if (typeof this.options.format === 'function') {
        return this.options.format.call(this, input);
      }

      return this.styles.info(input);
    }
  }, {
    key: "toNumber",
    value: function toNumber() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      return this.float ? +value : Math.round(+value);
    }
  }, {
    key: "isValue",
    value: function isValue(value) {
      return /^[-+]?[0-9]+((\.)|(\.[0-9]+))?$/.test(value);
    }
  }, {
    key: "submit",
    value: function submit() {
      var _this2 = this;

      var value = [this.input, this.initial].find(function (v) {
        return _this2.isValue(v);
      });
      this.value = this.toNumber(value || 0);
      return _get(_getPrototypeOf(NumberPrompt.prototype), "submit", this).call(this);
    }
  }]);

  return NumberPrompt;
}(StringPrompt);

module.exports = NumberPrompt;
},{"./string":"node_modules/enquirer/lib/types/string.js"}],"node_modules/enquirer/lib/prompts/numeral.js":[function(require,module,exports) {
module.exports = require('../types/number');
},{"../types/number":"node_modules/enquirer/lib/types/number.js"}],"node_modules/enquirer/lib/prompts/password.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var StringPrompt = require('../types/string');

var PasswordPrompt = /*#__PURE__*/function (_StringPrompt) {
  _inherits(PasswordPrompt, _StringPrompt);

  var _super = _createSuper(PasswordPrompt);

  function PasswordPrompt(options) {
    var _this;

    _classCallCheck(this, PasswordPrompt);

    _this = _super.call(this, options);

    _this.cursorShow();

    return _this;
  }

  _createClass(PasswordPrompt, [{
    key: "format",
    value: function format() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.input;
      if (!this.keypressed) return '';
      var color = this.state.submitted ? this.styles.primary : this.styles.muted;
      return color(this.symbols.asterisk.repeat(input.length));
    }
  }]);

  return PasswordPrompt;
}(StringPrompt);

module.exports = PasswordPrompt;
},{"../types/string":"node_modules/enquirer/lib/types/string.js"}],"node_modules/enquirer/lib/prompts/scale.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var colors = require('ansi-colors');

var ArrayPrompt = require('../types/array');

var utils = require('../utils');

var LikertScale = /*#__PURE__*/function (_ArrayPrompt) {
  _inherits(LikertScale, _ArrayPrompt);

  var _super = _createSuper(LikertScale);

  function LikertScale() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LikertScale);

    _this = _super.call(this, options);
    _this.widths = [].concat(options.messageWidth || 50);
    _this.align = [].concat(options.align || 'left');
    _this.linebreak = options.linebreak || false;
    _this.edgeLength = options.edgeLength || 3;
    _this.newline = options.newline || '\n   ';
    var start = options.startNumber || 1;

    if (typeof _this.scale === 'number') {
      _this.scaleKey = false;
      _this.scale = Array(_this.scale).fill(0).map(function (v, i) {
        return {
          name: i + start
        };
      });
    }

    return _this;
  }

  _createClass(LikertScale, [{
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.tableized = false;
                _context.next = 3;
                return _get(_getPrototypeOf(LikertScale.prototype), "reset", this).call(this);

              case 3:
                return _context.abrupt("return", this.render());

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function reset() {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: "tableize",
    value: function tableize() {
      if (this.tableized === true) return;
      this.tableized = true;
      var longest = 0;

      var _iterator = _createForOfIteratorHelper(this.choices),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var ch = _step.value;
          longest = Math.max(longest, ch.message.length);
          ch.scaleIndex = ch.initial || 2;
          ch.scale = [];

          for (var i = 0; i < this.scale.length; i++) {
            ch.scale.push({
              index: i
            });
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.widths[0] = Math.min(this.widths[0], longest + 3);
    }
  }, {
    key: "dispatch",
    value: function () {
      var _dispatch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(s, key) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.multiple) {
                  _context2.next = 11;
                  break;
                }

                if (!this[key.name]) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 4;
                return this[key.name](s, key);

              case 4:
                _context2.t0 = _context2.sent;
                _context2.next = 10;
                break;

              case 7:
                _context2.next = 9;
                return _get(_getPrototypeOf(LikertScale.prototype), "dispatch", this).call(this, s, key);

              case 9:
                _context2.t0 = _context2.sent;

              case 10:
                return _context2.abrupt("return", _context2.t0);

              case 11:
                this.alert();

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function dispatch(_x, _x2) {
        return _dispatch.apply(this, arguments);
      }

      return dispatch;
    }()
  }, {
    key: "heading",
    value: function heading(msg, item, i) {
      return this.styles.strong(msg);
    }
  }, {
    key: "separator",
    value: function separator() {
      return this.styles.muted(this.symbols.ellipsis);
    }
  }, {
    key: "right",
    value: function right() {
      var choice = this.focused;
      if (choice.scaleIndex >= this.scale.length - 1) return this.alert();
      choice.scaleIndex++;
      return this.render();
    }
  }, {
    key: "left",
    value: function left() {
      var choice = this.focused;
      if (choice.scaleIndex <= 0) return this.alert();
      choice.scaleIndex--;
      return this.render();
    }
  }, {
    key: "indent",
    value: function indent() {
      return '';
    }
  }, {
    key: "format",
    value: function format() {
      var _this2 = this;

      if (this.state.submitted) {
        var values = this.choices.map(function (ch) {
          return _this2.styles.info(ch.index);
        });
        return values.join(', ');
      }

      return '';
    }
  }, {
    key: "pointer",
    value: function pointer() {
      return '';
    }
    /**
     * Render the scale "Key". Something like:
     * @return {String}
     */

  }, {
    key: "renderScaleKey",
    value: function renderScaleKey() {
      var _this3 = this;

      if (this.scaleKey === false) return '';
      if (this.state.submitted) return '';
      var scale = this.scale.map(function (item) {
        return "   ".concat(item.name, " - ").concat(item.message);
      });
      var key = [''].concat(_toConsumableArray(scale)).map(function (item) {
        return _this3.styles.muted(item);
      });
      return key.join('\n');
    }
    /**
     * Render the heading row for the scale.
     * @return {String}
     */

  }, {
    key: "renderScaleHeading",
    value: function renderScaleHeading(max) {
      var _this4 = this;

      var keys = this.scale.map(function (ele) {
        return ele.name;
      });

      if (typeof this.options.renderScaleHeading === 'function') {
        keys = this.options.renderScaleHeading.call(this, max);
      }

      var diff = this.scaleLength - keys.join('').length;
      var spacing = Math.round(diff / (keys.length - 1));
      var names = keys.map(function (key) {
        return _this4.styles.strong(key);
      });
      var headings = names.join(' '.repeat(spacing));
      var padding = ' '.repeat(this.widths[0]);
      return this.margin[3] + padding + this.margin[1] + headings;
    }
    /**
     * Render a scale indicator => ◯ or ◉ by default
     */

  }, {
    key: "scaleIndicator",
    value: function scaleIndicator(choice, item, i) {
      if (typeof this.options.scaleIndicator === 'function') {
        return this.options.scaleIndicator.call(this, choice, item, i);
      }

      var enabled = choice.scaleIndex === item.index;
      if (item.disabled) return this.styles.hint(this.symbols.radio.disabled);
      if (enabled) return this.styles.success(this.symbols.radio.on);
      return this.symbols.radio.off;
    }
    /**
     * Render the actual scale => ◯────◯────◉────◯────◯
     */

  }, {
    key: "renderScale",
    value: function renderScale(choice, i) {
      var _this5 = this;

      var scale = choice.scale.map(function (item) {
        return _this5.scaleIndicator(choice, item, i);
      });
      var padding = this.term === 'Hyper' ? '' : ' ';
      return scale.join(padding + this.symbols.line.repeat(this.edgeLength));
    }
    /**
     * Render a choice, including scale =>
     *   "The website is easy to navigate. ◯───◯───◉───◯───◯"
     */

  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(choice, i) {
        var _this6 = this;

        var focused, pointer, hint, pad, newline, ind, message, scale, margin, msg, lines;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.onChoice(choice, i);

              case 2:
                focused = this.index === i;
                _context3.next = 5;
                return this.pointer(choice, i);

              case 5:
                pointer = _context3.sent;
                _context3.next = 8;
                return choice.hint;

              case 8:
                hint = _context3.sent;

                if (hint && !utils.hasColor(hint)) {
                  hint = this.styles.muted(hint);
                }

                pad = function pad(str) {
                  return _this6.margin[3] + str.replace(/\s+$/, '').padEnd(_this6.widths[0], ' ');
                };

                newline = this.newline;
                ind = this.indent(choice);
                _context3.next = 15;
                return this.resolve(choice.message, this.state, choice, i);

              case 15:
                message = _context3.sent;
                _context3.next = 18;
                return this.renderScale(choice, i);

              case 18:
                scale = _context3.sent;
                margin = this.margin[1] + this.margin[3];
                this.scaleLength = colors.unstyle(scale).length;
                this.widths[0] = Math.min(this.widths[0], this.width - this.scaleLength - margin.length);
                msg = utils.wordWrap(message, {
                  width: this.widths[0],
                  newline: newline
                });
                lines = msg.split('\n').map(function (line) {
                  return pad(line) + _this6.margin[1];
                });

                if (focused) {
                  scale = this.styles.info(scale);
                  lines = lines.map(function (line) {
                    return _this6.styles.info(line);
                  });
                }

                lines[0] += scale;
                if (this.linebreak) lines.push('');
                return _context3.abrupt("return", [ind + pointer, lines.join('\n')].filter(Boolean));

              case 28:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function renderChoice(_x3, _x4) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "renderChoices",
    value: function () {
      var _renderChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this7 = this;

        var choices, visible, heading;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this.state.submitted) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", '');

              case 2:
                this.tableize();
                choices = this.visible.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ch, i) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return _this7.renderChoice(ch, i);

                          case 2:
                            return _context4.abrupt("return", _context4.sent);

                          case 3:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x5, _x6) {
                    return _ref.apply(this, arguments);
                  };
                }());
                _context5.next = 6;
                return Promise.all(choices);

              case 6:
                visible = _context5.sent;
                _context5.next = 9;
                return this.renderScaleHeading();

              case 9:
                heading = _context5.sent;
                return _context5.abrupt("return", this.margin[0] + [heading].concat(_toConsumableArray(visible.map(function (v) {
                  return v.join(' ');
                }))).join('\n'));

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function renderChoices() {
        return _renderChoices.apply(this, arguments);
      }

      return renderChoices;
    }()
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this$state, submitted, size, prefix, separator, message, prompt, header, output, key, help, body, footer, err;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this$state = this.state, submitted = _this$state.submitted, size = _this$state.size;
                _context6.next = 3;
                return this.prefix();

              case 3:
                prefix = _context6.sent;
                _context6.next = 6;
                return this.separator();

              case 6:
                separator = _context6.sent;
                _context6.next = 9;
                return this.message();

              case 9:
                message = _context6.sent;
                prompt = '';

                if (this.options.promptLine !== false) {
                  prompt = [prefix, message, separator, ''].join(' ');
                  this.state.prompt = prompt;
                }

                _context6.next = 14;
                return this.header();

              case 14:
                header = _context6.sent;
                _context6.next = 17;
                return this.format();

              case 17:
                output = _context6.sent;
                _context6.next = 20;
                return this.renderScaleKey();

              case 20:
                key = _context6.sent;
                _context6.next = 23;
                return this.error();

              case 23:
                _context6.t0 = _context6.sent;

                if (_context6.t0) {
                  _context6.next = 28;
                  break;
                }

                _context6.next = 27;
                return this.hint();

              case 27:
                _context6.t0 = _context6.sent;

              case 28:
                help = _context6.t0;
                _context6.next = 31;
                return this.renderChoices();

              case 31:
                body = _context6.sent;
                _context6.next = 34;
                return this.footer();

              case 34:
                footer = _context6.sent;
                err = this.emptyError;
                if (output) prompt += output;
                if (help && !prompt.includes(help)) prompt += ' ' + help;

                if (submitted && !output && !body.trim() && this.multiple && err != null) {
                  prompt += this.styles.danger(err);
                }

                this.clear(size);
                this.write([header, prompt, key, body, footer].filter(Boolean).join('\n'));

                if (!this.state.submitted) {
                  this.write(this.margin[2]);
                }

                this.restore();

              case 43:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "submit",
    value: function submit() {
      this.value = {};

      var _iterator2 = _createForOfIteratorHelper(this.choices),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var choice = _step2.value;
          this.value[choice.name] = choice.scaleIndex;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return this.base.submit.call(this);
    }
  }]);

  return LikertScale;
}(ArrayPrompt);

module.exports = LikertScale;
},{"ansi-colors":"node_modules/ansi-colors/index.js","../types/array":"node_modules/enquirer/lib/types/array.js","../utils":"node_modules/enquirer/lib/utils.js"}],"node_modules/enquirer/lib/interpolate.js":[function(require,module,exports) {
'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('ansi-colors');

var clean = function clean() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return typeof str === 'string' ? str.replace(/^['"]|['"]$/g, '') : '';
};
/**
 * This file contains the interpolation and rendering logic for
 * the Snippet prompt.
 */


var Item = function Item(token) {
  _classCallCheck(this, Item);

  this.name = token.key;
  this.field = token.field || {};
  this.value = clean(token.initial || this.field.initial || '');
  this.message = token.message || this.name;
  this.cursor = 0;
  this.input = '';
  this.lines = [];
};

var tokenize = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var options,
        defaults,
        fn,
        unique,
        fields,
        input,
        tabstops,
        items,
        keys,
        line,
        i,
        next,
        peek,
        push,
        value,
        _ret,
        last,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            defaults = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            fn = _args.length > 2 && _args[2] !== undefined ? _args[2] : function (token) {
              return token;
            };
            unique = new Set();
            fields = options.fields || [];
            input = options.template;
            tabstops = [];
            items = [];
            keys = [];
            line = 1;

            if (!(typeof input === 'function')) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return input();

          case 13:
            input = _context.sent;

          case 14:
            i = -1;

            next = function next() {
              return input[++i];
            };

            peek = function peek() {
              return input[i + 1];
            };

            push = function push(token) {
              token.line = line;
              tabstops.push(token);
            };

            push({
              type: 'bos',
              value: ''
            });

          case 19:
            if (!(i < input.length - 1)) {
              _context.next = 40;
              break;
            }

            value = next();

            if (!/^[^\S\n ]$/.test(value)) {
              _context.next = 24;
              break;
            }

            push({
              type: 'text',
              value: value
            });
            return _context.abrupt("continue", 19);

          case 24:
            if (!(value === '\n')) {
              _context.next = 28;
              break;
            }

            push({
              type: 'newline',
              value: value
            });
            line++;
            return _context.abrupt("continue", 19);

          case 28:
            if (!(value === '\\')) {
              _context.next = 32;
              break;
            }

            value += next();
            push({
              type: 'text',
              value: value
            });
            return _context.abrupt("continue", 19);

          case 32:
            if (!((value === '$' || value === '#' || value === '{') && peek() === '{')) {
              _context.next = 36;
              break;
            }

            _ret = function () {
              var n = next();
              value += n;
              var token = {
                type: 'template',
                open: value,
                inner: '',
                close: '',
                value: value
              };
              var ch = void 0;

              while (ch = next()) {
                if (ch === '}') {
                  if (peek() === '}') ch += next();
                  token.value += ch;
                  token.close = ch;
                  break;
                }

                if (ch === ':') {
                  token.initial = '';
                  token.key = token.inner;
                } else if (token.initial !== void 0) {
                  token.initial += ch;
                }

                token.value += ch;
                token.inner += ch;
              }

              token.template = token.open + (token.initial || token.inner) + token.close;
              token.key = token.key || token.inner;

              if (defaults.hasOwnProperty(token.key)) {
                token.initial = defaults[token.key];
              }

              token = fn(token);
              push(token);
              keys.push(token.key);
              unique.add(token.key);
              var item = items.find(function (item) {
                return item.name === token.key;
              });
              token.field = fields.find(function (ch) {
                return ch.name === token.key;
              });

              if (!item) {
                item = new Item(token);
                items.push(item);
              }

              item.lines.push(token.line - 1);
              return "continue";
            }();

            if (!(_ret === "continue")) {
              _context.next = 36;
              break;
            }

            return _context.abrupt("continue", 19);

          case 36:
            last = tabstops[tabstops.length - 1];

            if (last.type === 'text' && last.line === line) {
              last.value += value;
            } else {
              push({
                type: 'text',
                value: value
              });
            }

            _context.next = 19;
            break;

          case 40:
            push({
              type: 'eos',
              value: ''
            });
            return _context.abrupt("return", {
              input: input,
              tabstops: tabstops,
              unique: unique,
              keys: keys,
              items: items
            });

          case 42:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function tokenize() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(prompt) {
    var options, required, defaults, _yield$tokenize, tabstops, items, keys, result, format, isValid, isVal;

    return regeneratorRuntime.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            options = prompt.options;
            required = new Set(options.required === true ? [] : options.required || []);
            defaults = _objectSpread(_objectSpread({}, options.values), options.initial);
            _context5.next = 5;
            return tokenize(options, defaults);

          case 5:
            _yield$tokenize = _context5.sent;
            tabstops = _yield$tokenize.tabstops;
            items = _yield$tokenize.items;
            keys = _yield$tokenize.keys;
            result = createFn('result', prompt, options);
            format = createFn('format', prompt, options);
            isValid = createFn('validate', prompt, options, true);
            isVal = prompt.isValue.bind(prompt);
            return _context5.abrupt("return", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              var state,
                  submitted,
                  index,
                  validate,
                  _iterator,
                  _step,
                  _loop,
                  _ret2,
                  lines,
                  len,
                  done,
                  _iterator2,
                  _step2,
                  item,
                  _args4 = arguments;

              return regeneratorRuntime.wrap(function _callee3$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      state = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
                      submitted = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
                      index = 0;
                      state.required = required;
                      state.items = items;
                      state.keys = keys;
                      state.output = '';

                      validate = /*#__PURE__*/function () {
                        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value, state, item, index) {
                          var error;
                          return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return isValid(value, state, item, index);

                                case 2:
                                  error = _context2.sent;

                                  if (!(error === false)) {
                                    _context2.next = 5;
                                    break;
                                  }

                                  return _context2.abrupt("return", 'Invalid field ' + item.name);

                                case 5:
                                  return _context2.abrupt("return", error);

                                case 6:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        }));

                        return function validate(_x2, _x3, _x4, _x5) {
                          return _ref4.apply(this, arguments);
                        };
                      }();

                      _iterator = _createForOfIteratorHelper(tabstops);
                      _context4.prev = 9;
                      _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
                        var token, value, key, item, val, field, message, error, res, before;
                        return regeneratorRuntime.wrap(function _loop$(_context3) {
                          while (1) {
                            switch (_context3.prev = _context3.next) {
                              case 0:
                                token = _step.value;
                                value = token.value;
                                key = token.key;

                                if (!(token.type !== 'template')) {
                                  _context3.next = 6;
                                  break;
                                }

                                if (value) state.output += value;
                                return _context3.abrupt("return", "continue");

                              case 6:
                                if (!(token.type === 'template')) {
                                  _context3.next = 35;
                                  break;
                                }

                                item = items.find(function (ch) {
                                  return ch.name === key;
                                });

                                if (options.required === true) {
                                  state.required.add(item.name);
                                }

                                val = [item.input, state.values[item.value], item.value, value].find(isVal);
                                field = item.field || {};
                                message = field.message || token.inner;

                                if (!submitted) {
                                  _context3.next = 25;
                                  break;
                                }

                                _context3.next = 15;
                                return validate(state.values[key], state, item, index);

                              case 15:
                                error = _context3.sent;

                                if (!(error && typeof error === 'string' || error === false)) {
                                  _context3.next = 19;
                                  break;
                                }

                                state.invalid.set(key, error);
                                return _context3.abrupt("return", "continue");

                              case 19:
                                state.invalid.delete(key);
                                _context3.next = 22;
                                return result(state.values[key], state, item, index);

                              case 22:
                                res = _context3.sent;
                                state.output += colors.unstyle(res);
                                return _context3.abrupt("return", "continue");

                              case 25:
                                item.placeholder = false;
                                before = value;
                                _context3.next = 29;
                                return format(value, state, item, index);

                              case 29:
                                value = _context3.sent;

                                if (val !== value) {
                                  state.values[key] = val;
                                  value = prompt.styles.typing(val);
                                  state.missing.delete(message);
                                } else {
                                  state.values[key] = void 0;
                                  val = "<".concat(message, ">");
                                  value = prompt.styles.primary(val);
                                  item.placeholder = true;

                                  if (state.required.has(key)) {
                                    state.missing.add(message);
                                  }
                                }

                                if (state.missing.has(message) && state.validating) {
                                  value = prompt.styles.warning(val);
                                }

                                if (state.invalid.has(key) && state.validating) {
                                  value = prompt.styles.danger(val);
                                }

                                if (index === state.index) {
                                  if (before !== value) {
                                    value = prompt.styles.underline(value);
                                  } else {
                                    value = prompt.styles.heading(colors.unstyle(value));
                                  }
                                }

                                index++;

                              case 35:
                                if (value) {
                                  state.output += value;
                                }

                              case 36:
                              case "end":
                                return _context3.stop();
                            }
                          }
                        }, _loop);
                      });

                      _iterator.s();

                    case 12:
                      if ((_step = _iterator.n()).done) {
                        _context4.next = 19;
                        break;
                      }

                      return _context4.delegateYield(_loop(), "t0", 14);

                    case 14:
                      _ret2 = _context4.t0;

                      if (!(_ret2 === "continue")) {
                        _context4.next = 17;
                        break;
                      }

                      return _context4.abrupt("continue", 17);

                    case 17:
                      _context4.next = 12;
                      break;

                    case 19:
                      _context4.next = 24;
                      break;

                    case 21:
                      _context4.prev = 21;
                      _context4.t1 = _context4["catch"](9);

                      _iterator.e(_context4.t1);

                    case 24:
                      _context4.prev = 24;

                      _iterator.f();

                      return _context4.finish(24);

                    case 27:
                      lines = state.output.split('\n').map(function (l) {
                        return ' ' + l;
                      });
                      len = items.length;
                      done = 0;
                      _iterator2 = _createForOfIteratorHelper(items);

                      try {
                        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                          item = _step2.value;

                          if (state.invalid.has(item.name)) {
                            item.lines.forEach(function (i) {
                              if (lines[i][0] !== ' ') return;
                              lines[i] = state.styles.danger(state.symbols.bullet) + lines[i].slice(1);
                            });
                          }

                          if (prompt.isValue(state.values[item.name])) {
                            done++;
                          }
                        }
                      } catch (err) {
                        _iterator2.e(err);
                      } finally {
                        _iterator2.f();
                      }

                      state.completed = (done / len * 100).toFixed(0);
                      state.output = lines.join('\n');
                      return _context4.abrupt("return", state.output);

                    case 35:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee3, null, [[9, 21, 24, 27]]);
            })));

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

function createFn(prop, prompt, options, fallback) {
  return function (value, state, item, index) {
    if (typeof item.field[prop] === 'function') {
      return item.field[prop].call(prompt, value, state, item, index);
    }

    return [fallback, value].find(function (v) {
      return prompt.isValue(v);
    });
  };
}
},{"ansi-colors":"node_modules/ansi-colors/index.js"}],"node_modules/enquirer/lib/prompts/snippet.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var colors = require('ansi-colors');

var interpolate = require('../interpolate');

var Prompt = require('../prompt');

var SnippetPrompt = /*#__PURE__*/function (_Prompt) {
  _inherits(SnippetPrompt, _Prompt);

  var _super = _createSuper(SnippetPrompt);

  function SnippetPrompt(options) {
    var _this;

    _classCallCheck(this, SnippetPrompt);

    _this = _super.call(this, options);

    _this.cursorHide();

    _this.reset(true);

    return _this;
  }

  _createClass(SnippetPrompt, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return interpolate(this);

              case 2:
                this.interpolate = _context.sent;
                _context.next = 5;
                return _get(_getPrototypeOf(SnippetPrompt.prototype), "initialize", this).call(this);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(first) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.state.keys = [];
                this.state.invalid = new Map();
                this.state.missing = new Set();
                this.state.completed = 0;
                this.state.values = {};

                if (!(first !== true)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 8;
                return this.initialize();

              case 8:
                _context2.next = 10;
                return this.render();

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function reset(_x) {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: "moveCursor",
    value: function moveCursor(n) {
      var item = this.getItem();
      this.cursor += n;
      item.cursor += n;
    }
  }, {
    key: "dispatch",
    value: function dispatch(ch, key) {
      if (!key.code && !key.ctrl && ch != null && this.getItem()) {
        this.append(ch, key);
        return;
      }

      this.alert();
    }
  }, {
    key: "append",
    value: function append(ch, key) {
      var item = this.getItem();
      var prefix = item.input.slice(0, this.cursor);
      var suffix = item.input.slice(this.cursor);
      this.input = item.input = "".concat(prefix).concat(ch).concat(suffix);
      this.moveCursor(1);
      this.render();
    }
  }, {
    key: "delete",
    value: function _delete() {
      var item = this.getItem();
      if (this.cursor <= 0 || !item.input) return this.alert();
      var suffix = item.input.slice(this.cursor);
      var prefix = item.input.slice(0, this.cursor - 1);
      this.input = item.input = "".concat(prefix).concat(suffix);
      this.moveCursor(-1);
      this.render();
    }
  }, {
    key: "increment",
    value: function increment(i) {
      return i >= this.state.keys.length - 1 ? 0 : i + 1;
    }
  }, {
    key: "decrement",
    value: function decrement(i) {
      return i <= 0 ? this.state.keys.length - 1 : i - 1;
    }
  }, {
    key: "first",
    value: function first() {
      this.state.index = 0;
      this.render();
    }
  }, {
    key: "last",
    value: function last() {
      this.state.index = this.state.keys.length - 1;
      this.render();
    }
  }, {
    key: "right",
    value: function right() {
      if (this.cursor >= this.input.length) return this.alert();
      this.moveCursor(1);
      this.render();
    }
  }, {
    key: "left",
    value: function left() {
      if (this.cursor <= 0) return this.alert();
      this.moveCursor(-1);
      this.render();
    }
  }, {
    key: "prev",
    value: function prev() {
      this.state.index = this.decrement(this.state.index);
      this.getItem();
      this.render();
    }
  }, {
    key: "next",
    value: function next() {
      this.state.index = this.increment(this.state.index);
      this.getItem();
      this.render();
    }
  }, {
    key: "up",
    value: function up() {
      this.prev();
    }
  }, {
    key: "down",
    value: function down() {
      this.next();
    }
  }, {
    key: "format",
    value: function format(value) {
      var color = this.state.completed < 100 ? this.styles.warning : this.styles.success;

      if (this.state.submitted === true && this.state.completed !== 100) {
        color = this.styles.danger;
      }

      return color("".concat(this.state.completed, "% completed"));
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _this$state, index, _this$state$keys, keys, submitted, size, newline, prefix, separator, message, prompt, header, error, hint, body, key, input, footer, lines;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this$state = this.state, index = _this$state.index, _this$state$keys = _this$state.keys, keys = _this$state$keys === void 0 ? [] : _this$state$keys, submitted = _this$state.submitted, size = _this$state.size;
                newline = [this.options.newline, '\n'].find(function (v) {
                  return v != null;
                });
                _context3.next = 4;
                return this.prefix();

              case 4:
                prefix = _context3.sent;
                _context3.next = 7;
                return this.separator();

              case 7:
                separator = _context3.sent;
                _context3.next = 10;
                return this.message();

              case 10:
                message = _context3.sent;
                prompt = [prefix, message, separator].filter(Boolean).join(' ');
                this.state.prompt = prompt;
                _context3.next = 15;
                return this.header();

              case 15:
                header = _context3.sent;
                _context3.next = 18;
                return this.error();

              case 18:
                _context3.t0 = _context3.sent;

                if (_context3.t0) {
                  _context3.next = 21;
                  break;
                }

                _context3.t0 = '';

              case 21:
                error = _context3.t0;
                _context3.next = 24;
                return this.hint();

              case 24:
                _context3.t1 = _context3.sent;

                if (_context3.t1) {
                  _context3.next = 27;
                  break;
                }

                _context3.t1 = '';

              case 27:
                hint = _context3.t1;

                if (!submitted) {
                  _context3.next = 32;
                  break;
                }

                _context3.t2 = '';
                _context3.next = 35;
                break;

              case 32:
                _context3.next = 34;
                return this.interpolate(this.state);

              case 34:
                _context3.t2 = _context3.sent;

              case 35:
                body = _context3.t2;
                key = this.state.key = keys[index] || '';
                _context3.next = 39;
                return this.format(key);

              case 39:
                input = _context3.sent;
                _context3.next = 42;
                return this.footer();

              case 42:
                footer = _context3.sent;
                if (input) prompt += ' ' + input;
                if (hint && !input && this.state.completed === 0) prompt += ' ' + hint;
                this.clear(size);
                lines = [header, prompt, body, footer, error.trim()];
                this.write(lines.filter(Boolean).join(newline));
                this.restore();

              case 49:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "getItem",
    value: function getItem(name) {
      var _this$state2 = this.state,
          items = _this$state2.items,
          keys = _this$state2.keys,
          index = _this$state2.index;
      var item = items.find(function (ch) {
        return ch.name === keys[index];
      });

      if (item && item.input != null) {
        this.input = item.input;
        this.cursor = item.cursor;
      }

      return item;
    }
  }, {
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this$state3, invalid, missing, output, values, err, _iterator, _step, _step$value, key, value, lines, result;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(typeof this.interpolate !== 'function')) {
                  _context4.next = 3;
                  break;
                }

                _context4.next = 3;
                return this.initialize();

              case 3:
                _context4.next = 5;
                return this.interpolate(this.state, true);

              case 5:
                _this$state3 = this.state, invalid = _this$state3.invalid, missing = _this$state3.missing, output = _this$state3.output, values = _this$state3.values;

                if (!invalid.size) {
                  _context4.next = 12;
                  break;
                }

                err = '';
                _iterator = _createForOfIteratorHelper(invalid);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], value = _step$value[1];
                    err += "Invalid ".concat(key, ": ").concat(value, "\n");
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                this.state.error = err;
                return _context4.abrupt("return", _get(_getPrototypeOf(SnippetPrompt.prototype), "submit", this).call(this));

              case 12:
                if (!missing.size) {
                  _context4.next = 15;
                  break;
                }

                this.state.error = 'Required: ' + _toConsumableArray(missing.keys()).join(', ');
                return _context4.abrupt("return", _get(_getPrototypeOf(SnippetPrompt.prototype), "submit", this).call(this));

              case 15:
                lines = colors.unstyle(output).split('\n');
                result = lines.map(function (v) {
                  return v.slice(1);
                }).join('\n');
                this.value = {
                  values: values,
                  result: result
                };
                return _context4.abrupt("return", _get(_getPrototypeOf(SnippetPrompt.prototype), "submit", this).call(this));

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }]);

  return SnippetPrompt;
}(Prompt);

module.exports = SnippetPrompt;
},{"ansi-colors":"node_modules/ansi-colors/index.js","../interpolate":"node_modules/enquirer/lib/interpolate.js","../prompt":"node_modules/enquirer/lib/prompt.js"}],"node_modules/enquirer/lib/prompts/sort.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var hint = '(Use <shift>+<up/down> to sort)';

var Prompt = require('./select');

var Sort = /*#__PURE__*/function (_Prompt) {
  _inherits(Sort, _Prompt);

  var _super = _createSuper(Sort);

  function Sort(options) {
    var _this;

    _classCallCheck(this, Sort);

    _this = _super.call(this, _objectSpread(_objectSpread({}, options), {}, {
      reorder: false,
      sort: true,
      multiple: true
    }));
    _this.state.hint = [_this.options.hint, hint].find(_this.isValue.bind(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Sort, [{
    key: "indicator",
    value: function indicator() {
      return '';
    }
  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(choice, i) {
        var str, sym, pre;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _get(_getPrototypeOf(Sort.prototype), "renderChoice", this).call(this, choice, i);

              case 2:
                str = _context.sent;
                sym = this.symbols.identicalTo + ' ';
                pre = this.index === i && this.sorting ? this.styles.muted(sym) : '  ';
                if (this.options.drag === false) pre = '';

                if (!(this.options.numbered === true)) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", pre + "".concat(i + 1, " - ") + str);

              case 8:
                return _context.abrupt("return", pre + str);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function renderChoice(_x, _x2) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "submit",
    value: function submit() {
      this.value = this.choices.map(function (choice) {
        return choice.value;
      });
      return _get(_getPrototypeOf(Sort.prototype), "submit", this).call(this);
    }
  }, {
    key: "selected",
    get: function get() {
      return this.choices;
    }
  }]);

  return Sort;
}(Prompt);

module.exports = Sort;
},{"./select":"node_modules/enquirer/lib/prompts/select.js"}],"node_modules/enquirer/lib/prompts/survey.js":[function(require,module,exports) {
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ArrayPrompt = require('../types/array');

var Survey = /*#__PURE__*/function (_ArrayPrompt) {
  _inherits(Survey, _ArrayPrompt);

  var _super = _createSuper(Survey);

  function Survey() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Survey);

    _this = _super.call(this, options);
    _this.emptyError = options.emptyError || 'No items were selected';
    _this.term = "vscode";

    if (!_this.options.header) {
      var header = ['', '4 - Strongly Agree', '3 - Agree', '2 - Neutral', '1 - Disagree', '0 - Strongly Disagree', ''];
      header = header.map(function (ele) {
        return _this.styles.muted(ele);
      });
      _this.state.header = header.join('\n   ');
    }

    return _this;
  }

  _createClass(Survey, [{
    key: "toChoices",
    value: function () {
      var _toChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _get2;

        var _len,
            args,
            _key,
            choices,
            _iterator,
            _step,
            choice,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.createdScales) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", false);

              case 2:
                this.createdScales = true;

                for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }

                _context.next = 6;
                return (_get2 = _get(_getPrototypeOf(Survey.prototype), "toChoices", this)).call.apply(_get2, [this].concat(args));

              case 6:
                choices = _context.sent;
                _iterator = _createForOfIteratorHelper(choices);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    choice = _step.value;
                    choice.scale = createScale(5, this.options);
                    choice.scaleIdx = 2;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                return _context.abrupt("return", choices);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function toChoices() {
        return _toChoices.apply(this, arguments);
      }

      return toChoices;
    }()
  }, {
    key: "dispatch",
    value: function dispatch() {
      this.alert();
    }
  }, {
    key: "space",
    value: function space() {
      var choice = this.focused;
      var ele = choice.scale[choice.scaleIdx];
      var selected = ele.selected;
      choice.scale.forEach(function (e) {
        return e.selected = false;
      });
      ele.selected = !selected;
      return this.render();
    }
  }, {
    key: "indicator",
    value: function indicator() {
      return '';
    }
  }, {
    key: "pointer",
    value: function pointer() {
      return '';
    }
  }, {
    key: "separator",
    value: function separator() {
      return this.styles.muted(this.symbols.ellipsis);
    }
  }, {
    key: "right",
    value: function right() {
      var choice = this.focused;
      if (choice.scaleIdx >= choice.scale.length - 1) return this.alert();
      choice.scaleIdx++;
      return this.render();
    }
  }, {
    key: "left",
    value: function left() {
      var choice = this.focused;
      if (choice.scaleIdx <= 0) return this.alert();
      choice.scaleIdx--;
      return this.render();
    }
  }, {
    key: "indent",
    value: function indent() {
      return '   ';
    }
  }, {
    key: "renderChoice",
    value: function () {
      var _renderChoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
        var _this2 = this;

        var focused, isHyper, n, s, ln, sp, dot, num, color, msg, indent, scale, val, next, line, lines;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.onChoice(item, i);

              case 2:
                focused = this.index === i;
                isHyper = this.term === 'Hyper';
                n = !isHyper ? 8 : 9;
                s = !isHyper ? ' ' : '';
                ln = this.symbols.line.repeat(n);
                sp = ' '.repeat(n + (isHyper ? 0 : 1));

                dot = function dot(enabled) {
                  return (enabled ? _this2.styles.success('◉') : '◯') + s;
                };

                num = i + 1 + '.';
                color = focused ? this.styles.heading : this.styles.noop;
                _context2.next = 13;
                return this.resolve(item.message, this.state, item, i);

              case 13:
                msg = _context2.sent;
                indent = this.indent(item);
                scale = indent + item.scale.map(function (e, i) {
                  return dot(i === item.scaleIdx);
                }).join(ln);

                val = function val(i) {
                  return i === item.scaleIdx ? color(i) : i;
                };

                next = indent + item.scale.map(function (e, i) {
                  return val(i);
                }).join(sp);

                line = function line() {
                  return [num, msg].filter(Boolean).join(' ');
                };

                lines = function lines() {
                  return [line(), scale, next, ' '].filter(Boolean).join('\n');
                };

                if (focused) {
                  scale = this.styles.cyan(scale);
                  next = this.styles.cyan(next);
                }

                return _context2.abrupt("return", lines());

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function renderChoice(_x, _x2) {
        return _renderChoice.apply(this, arguments);
      }

      return renderChoice;
    }()
  }, {
    key: "renderChoices",
    value: function () {
      var _renderChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _this3 = this;

        var choices, visible;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this.state.submitted) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", '');

              case 2:
                choices = this.visible.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ch, i) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this3.renderChoice(ch, i);

                          case 2:
                            return _context3.abrupt("return", _context3.sent);

                          case 3:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }());
                _context4.next = 5;
                return Promise.all(choices);

              case 5:
                visible = _context4.sent;
                if (!visible.length) visible.push(this.styles.danger('No matching choices'));
                return _context4.abrupt("return", visible.join('\n'));

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function renderChoices() {
        return _renderChoices.apply(this, arguments);
      }

      return renderChoices;
    }()
  }, {
    key: "format",
    value: function format() {
      var _this4 = this;

      if (this.state.submitted) {
        var values = this.choices.map(function (ch) {
          return _this4.styles.info(ch.scaleIdx);
        });
        return values.join(', ');
      }

      return '';
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var _this$state, submitted, size, prefix, separator, message, prompt, header, output, help, body, footer;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this$state = this.state, submitted = _this$state.submitted, size = _this$state.size;
                _context5.next = 3;
                return this.prefix();

              case 3:
                prefix = _context5.sent;
                _context5.next = 6;
                return this.separator();

              case 6:
                separator = _context5.sent;
                _context5.next = 9;
                return this.message();

              case 9:
                message = _context5.sent;
                prompt = [prefix, message, separator].filter(Boolean).join(' ');
                this.state.prompt = prompt;
                _context5.next = 14;
                return this.header();

              case 14:
                header = _context5.sent;
                _context5.next = 17;
                return this.format();

              case 17:
                output = _context5.sent;
                _context5.next = 20;
                return this.error();

              case 20:
                _context5.t0 = _context5.sent;

                if (_context5.t0) {
                  _context5.next = 25;
                  break;
                }

                _context5.next = 24;
                return this.hint();

              case 24:
                _context5.t0 = _context5.sent;

              case 25:
                help = _context5.t0;
                _context5.next = 28;
                return this.renderChoices();

              case 28:
                body = _context5.sent;
                _context5.next = 31;
                return this.footer();

              case 31:
                footer = _context5.sent;
                if (output || !help) prompt += ' ' + output;
                if (help && !prompt.includes(help)) prompt += ' ' + help;

                if (submitted && !output && !body && this.multiple && this.type !== 'form') {
                  prompt += this.styles.danger(this.emptyError);
                }

                this.clear(size);
                this.write([prompt, header, body, footer].filter(Boolean).join('\n'));
                this.restore();

              case 38:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }, {
    key: "submit",
    value: function submit() {
      this.value = {};

      var _iterator2 = _createForOfIteratorHelper(this.choices),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var choice = _step2.value;
          this.value[choice.name] = choice.scaleIdx;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return this.base.submit.call(this);
    }
  }]);

  return Survey;
}(ArrayPrompt);

function createScale(n) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (Array.isArray(options.scale)) {
    return options.scale.map(function (ele) {
      return _objectSpread({}, ele);
    });
  }

  var scale = [];

  for (var i = 1; i < n + 1; i++) {
    scale.push({
      i: i,
      selected: false
    });
  }

  return scale;
}

module.exports = Survey;
},{"../types/array":"node_modules/enquirer/lib/types/array.js"}],"node_modules/enquirer/lib/prompts/text.js":[function(require,module,exports) {
module.exports = require('./input');
},{"./input":"node_modules/enquirer/lib/prompts/input.js"}],"node_modules/enquirer/lib/prompts/toggle.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BooleanPrompt = require('../types/boolean');

var TogglePrompt = /*#__PURE__*/function (_BooleanPrompt) {
  _inherits(TogglePrompt, _BooleanPrompt);

  var _super = _createSuper(TogglePrompt);

  function TogglePrompt() {
    _classCallCheck(this, TogglePrompt);

    return _super.apply(this, arguments);
  }

  _createClass(TogglePrompt, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _get(_getPrototypeOf(TogglePrompt.prototype), "initialize", this).call(this);

              case 2:
                this.value = this.initial = !!this.options.initial;
                this.disabled = this.options.disabled || 'no';
                this.enabled = this.options.enabled || 'yes';
                _context.next = 7;
                return this.render();

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initialize() {
        return _initialize.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: "reset",
    value: function reset() {
      this.value = this.initial;
      this.render();
    }
  }, {
    key: "delete",
    value: function _delete() {
      this.alert();
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.value = !this.value;
      this.render();
    }
  }, {
    key: "enable",
    value: function enable() {
      if (this.value === true) return this.alert();
      this.value = true;
      this.render();
    }
  }, {
    key: "disable",
    value: function disable() {
      if (this.value === false) return this.alert();
      this.value = false;
      this.render();
    }
  }, {
    key: "up",
    value: function up() {
      this.toggle();
    }
  }, {
    key: "down",
    value: function down() {
      this.toggle();
    }
  }, {
    key: "right",
    value: function right() {
      this.toggle();
    }
  }, {
    key: "left",
    value: function left() {
      this.toggle();
    }
  }, {
    key: "next",
    value: function next() {
      this.toggle();
    }
  }, {
    key: "prev",
    value: function prev() {
      this.toggle();
    }
  }, {
    key: "dispatch",
    value: function dispatch() {
      var ch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var key = arguments.length > 1 ? arguments[1] : undefined;

      switch (ch.toLowerCase()) {
        case ' ':
          return this.toggle();

        case '1':
        case 'y':
        case 't':
          return this.enable();

        case '0':
        case 'n':
        case 'f':
          return this.disable();

        default:
          {
            return this.alert();
          }
      }
    }
  }, {
    key: "format",
    value: function format() {
      var _this = this;

      var active = function active(str) {
        return _this.styles.primary.underline(str);
      };

      var value = [this.value ? this.disabled : active(this.disabled), this.value ? active(this.enabled) : this.enabled];
      return value.join(this.styles.muted(' / '));
    }
  }, {
    key: "render",
    value: function () {
      var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var size, header, prefix, separator, message, output, help, footer, prompt;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                size = this.state.size;
                _context2.next = 3;
                return this.header();

              case 3:
                header = _context2.sent;
                _context2.next = 6;
                return this.prefix();

              case 6:
                prefix = _context2.sent;
                _context2.next = 9;
                return this.separator();

              case 9:
                separator = _context2.sent;
                _context2.next = 12;
                return this.message();

              case 12:
                message = _context2.sent;
                _context2.next = 15;
                return this.format();

              case 15:
                output = _context2.sent;
                _context2.next = 18;
                return this.error();

              case 18:
                _context2.t0 = _context2.sent;

                if (_context2.t0) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 22;
                return this.hint();

              case 22:
                _context2.t0 = _context2.sent;

              case 23:
                help = _context2.t0;
                _context2.next = 26;
                return this.footer();

              case 26:
                footer = _context2.sent;
                prompt = [prefix, message, separator, output].join(' ');
                this.state.prompt = prompt;
                if (help && !prompt.includes(help)) prompt += ' ' + help;
                this.clear(size);
                this.write([header, prompt, footer].filter(Boolean).join('\n'));
                this.write(this.margin[2]);
                this.restore();

              case 34:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return TogglePrompt;
}(BooleanPrompt);

module.exports = TogglePrompt;
},{"../types/boolean":"node_modules/enquirer/lib/types/boolean.js"}],"node_modules/enquirer/lib/prompts/quiz.js":[function(require,module,exports) {
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SelectPrompt = require('./select');

var Quiz = /*#__PURE__*/function (_SelectPrompt) {
  _inherits(Quiz, _SelectPrompt);

  var _super = _createSuper(Quiz);

  function Quiz(options) {
    var _this;

    _classCallCheck(this, Quiz);

    _this = _super.call(this, options);

    if (typeof _this.options.correctChoice !== 'number' || _this.options.correctChoice < 0) {
      throw new Error('Please specify the index of the correct answer from the list of choices');
    }

    return _this;
  }

  _createClass(Quiz, [{
    key: "toChoices",
    value: function () {
      var _toChoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, parent) {
        var choices;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _get(_getPrototypeOf(Quiz.prototype), "toChoices", this).call(this, value, parent);

              case 2:
                choices = _context.sent;

                if (!(choices.length < 2)) {
                  _context.next = 5;
                  break;
                }

                throw new Error('Please give at least two choices to the user');

              case 5:
                if (!(this.options.correctChoice > choices.length)) {
                  _context.next = 7;
                  break;
                }

                throw new Error('Please specify the index of the correct answer from the list of choices');

              case 7:
                return _context.abrupt("return", choices);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function toChoices(_x, _x2) {
        return _toChoices.apply(this, arguments);
      }

      return toChoices;
    }()
  }, {
    key: "check",
    value: function check(state) {
      return state.index === this.options.correctChoice;
    }
  }, {
    key: "result",
    value: function () {
      var _result = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(selected) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = selected;
                _context2.t1 = this.options.choices[this.options.correctChoice].value;
                _context2.next = 4;
                return this.check(this.state);

              case 4:
                _context2.t2 = _context2.sent;
                return _context2.abrupt("return", {
                  selectedAnswer: _context2.t0,
                  correctAnswer: _context2.t1,
                  correct: _context2.t2
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function result(_x3) {
        return _result.apply(this, arguments);
      }

      return result;
    }()
  }]);

  return Quiz;
}(SelectPrompt);

module.exports = Quiz;
},{"./select":"node_modules/enquirer/lib/prompts/select.js"}],"node_modules/enquirer/lib/prompts/index.js":[function(require,module,exports) {

'use strict';

var utils = require('../utils');

var define = function define(key, fn) {
  utils.defineExport(exports, key, fn);
  utils.defineExport(exports, key.toLowerCase(), fn);
};

define('AutoComplete', function () {
  return require('./autocomplete');
});
define('BasicAuth', function () {
  return require('./basicauth');
});
define('Confirm', function () {
  return require('./confirm');
});
define('Editable', function () {
  return require('./editable');
});
define('Form', function () {
  return require('./form');
});
define('Input', function () {
  return require('./input');
});
define('Invisible', function () {
  return require('./invisible');
});
define('List', function () {
  return require('./list');
});
define('MultiSelect', function () {
  return require('./multiselect');
});
define('Numeral', function () {
  return require('./numeral');
});
define('Password', function () {
  return require('./password');
});
define('Scale', function () {
  return require('./scale');
});
define('Select', function () {
  return require('./select');
});
define('Snippet', function () {
  return require('./snippet');
});
define('Sort', function () {
  return require('./sort');
});
define('Survey', function () {
  return require('./survey');
});
define('Text', function () {
  return require('./text');
});
define('Toggle', function () {
  return require('./toggle');
});
define('Quiz', function () {
  return require('./quiz');
});
},{"../utils":"node_modules/enquirer/lib/utils.js","./autocomplete":"node_modules/enquirer/lib/prompts/autocomplete.js","./basicauth":"node_modules/enquirer/lib/prompts/basicauth.js","./confirm":"node_modules/enquirer/lib/prompts/confirm.js","./editable":"node_modules/enquirer/lib/prompts/editable.js","./form":"node_modules/enquirer/lib/prompts/form.js","./input":"node_modules/enquirer/lib/prompts/input.js","./invisible":"node_modules/enquirer/lib/prompts/invisible.js","./list":"node_modules/enquirer/lib/prompts/list.js","./multiselect":"node_modules/enquirer/lib/prompts/multiselect.js","./numeral":"node_modules/enquirer/lib/prompts/numeral.js","./password":"node_modules/enquirer/lib/prompts/password.js","./scale":"node_modules/enquirer/lib/prompts/scale.js","./select":"node_modules/enquirer/lib/prompts/select.js","./snippet":"node_modules/enquirer/lib/prompts/snippet.js","./sort":"node_modules/enquirer/lib/prompts/sort.js","./survey":"node_modules/enquirer/lib/prompts/survey.js","./text":"node_modules/enquirer/lib/prompts/text.js","./toggle":"node_modules/enquirer/lib/prompts/toggle.js","./quiz":"node_modules/enquirer/lib/prompts/quiz.js"}],"node_modules/enquirer/lib/types/index.js":[function(require,module,exports) {
module.exports = {
  ArrayPrompt: require('./array'),
  AuthPrompt: require('./auth'),
  BooleanPrompt: require('./boolean'),
  NumberPrompt: require('./number'),
  StringPrompt: require('./string')
};
},{"./array":"node_modules/enquirer/lib/types/array.js","./auth":"node_modules/enquirer/lib/types/auth.js","./boolean":"node_modules/enquirer/lib/types/boolean.js","./number":"node_modules/enquirer/lib/types/number.js","./string":"node_modules/enquirer/lib/types/string.js"}],"node_modules/enquirer/index.js":[function(require,module,exports) {
'use strict';

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var assert = require('assert');

var Events = require('events');

var utils = require('./lib/utils');
/**
 * Create an instance of `Enquirer`.
 *
 * ```js
 * const Enquirer = require('enquirer');
 * const enquirer = new Enquirer();
 * ```
 * @name Enquirer
 * @param {Object} `options` (optional) Options to use with all prompts.
 * @param {Object} `answers` (optional) Answers object to initialize with.
 * @api public
 */


var Enquirer = /*#__PURE__*/function (_Events) {
  _inherits(Enquirer, _Events);

  var _super = _createSuper(Enquirer);

  function Enquirer(options, answers) {
    var _this;

    _classCallCheck(this, Enquirer);

    _this = _super.call(this);
    _this.options = utils.merge({}, options);
    _this.answers = _objectSpread({}, answers);
    return _this;
  }
  /**
   * Register a custom prompt type.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   * enquirer.register('customType', require('./custom-prompt'));
   * ```
   * @name register()
   * @param {String} `type`
   * @param {Function|Prompt} `fn` `Prompt` class, or a function that returns a `Prompt` class.
   * @return {Object} Returns the Enquirer instance
   * @api public
   */


  _createClass(Enquirer, [{
    key: "register",
    value: function register(type, fn) {
      if (utils.isObject(type)) {
        for (var _i = 0, _Object$keys = Object.keys(type); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          this.register(key, type[key]);
        }

        return this;
      }

      assert.equal(_typeof(fn), 'function', 'expected a function');
      var name = type.toLowerCase();

      if (fn.prototype instanceof this.Prompt) {
        this.prompts[name] = fn;
      } else {
        this.prompts[name] = fn(this.Prompt, this);
      }

      return this;
    }
    /**
     * Prompt function that takes a "question" object or array of question objects,
     * and returns an object with responses from the user.
     *
     * ```js
     * const Enquirer = require('enquirer');
     * const enquirer = new Enquirer();
     *
     * const response = await enquirer.prompt({
     *   type: 'input',
     *   name: 'username',
     *   message: 'What is your username?'
     * });
     * console.log(response);
     * ```
     * @name prompt()
     * @param {Array|Object} `questions` Options objects for one or more prompts to run.
     * @return {Promise} Promise that returns an "answers" object with the user's responses.
     * @api public
     */

  }, {
    key: "prompt",
    value: function () {
      var _prompt = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var questions,
            _iterator,
            _step,
            question,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                questions = _args.length > 0 && _args[0] !== undefined ? _args[0] : [];
                _iterator = _createForOfIteratorHelper([].concat(questions));
                _context.prev = 2;

                _iterator.s();

              case 4:
                if ((_step = _iterator.n()).done) {
                  _context.next = 20;
                  break;
                }

                question = _step.value;
                _context.prev = 6;

                if (!(typeof question === 'function')) {
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return question.call(this);

              case 10:
                question = _context.sent;

              case 11:
                _context.next = 13;
                return this.ask(utils.merge({}, this.options, question));

              case 13:
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](6);
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 18:
                _context.next = 4;
                break;

              case 20:
                _context.next = 25;
                break;

              case 22:
                _context.prev = 22;
                _context.t1 = _context["catch"](2);

                _iterator.e(_context.t1);

              case 25:
                _context.prev = 25;

                _iterator.f();

                return _context.finish(25);

              case 28:
                return _context.abrupt("return", this.answers);

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 22, 25, 28], [6, 15]]);
      }));

      function prompt() {
        return _prompt.apply(this, arguments);
      }

      return prompt;
    }()
  }, {
    key: "ask",
    value: function () {
      var _ask = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(question) {
        var _this2 = this;

        var opts, _question, type, name, set, get, prompt, value, emit;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(typeof question === 'function')) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 3;
                return question.call(this);

              case 3:
                question = _context2.sent;

              case 4:
                opts = utils.merge({}, this.options, question);
                _question = question, type = _question.type, name = _question.name;
                set = utils.set, get = utils.get;

                if (!(typeof type === 'function')) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 10;
                return type.call(this, question, this.answers);

              case 10:
                type = _context2.sent;

              case 11:
                if (type) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", this.answers[name]);

              case 13:
                assert(this.prompts[type], "Prompt \"".concat(type, "\" is not registered"));
                prompt = new this.prompts[type](opts);
                value = get(this.answers, name);
                prompt.state.answers = this.answers;
                prompt.enquirer = this;

                if (name) {
                  prompt.on('submit', function (value) {
                    _this2.emit('answer', name, value, prompt);

                    set(_this2.answers, name, value);
                  });
                } // bubble events


                emit = prompt.emit.bind(prompt);

                prompt.emit = function () {
                  var _this2$emit;

                  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  (_this2$emit = _this2.emit).call.apply(_this2$emit, [_this2].concat(args));

                  return emit.apply(void 0, args);
                };

                this.emit('prompt', prompt, this);

                if (!(opts.autofill && value != null)) {
                  _context2.next = 29;
                  break;
                }

                prompt.value = prompt.input = value; // if "autofill=show" render the prompt, otherwise stay "silent"

                if (!(opts.autofill === 'show')) {
                  _context2.next = 27;
                  break;
                }

                _context2.next = 27;
                return prompt.submit();

              case 27:
                _context2.next = 32;
                break;

              case 29:
                _context2.next = 31;
                return prompt.run();

              case 31:
                value = prompt.value = _context2.sent;

              case 32:
                return _context2.abrupt("return", value);

              case 33:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function ask(_x) {
        return _ask.apply(this, arguments);
      }

      return ask;
    }()
    /**
     * Use an enquirer plugin.
     *
     * ```js
     * const Enquirer = require('enquirer');
     * const enquirer = new Enquirer();
     * const plugin = enquirer => {
     *   // do stuff to enquire instance
     * };
     * enquirer.use(plugin);
     * ```
     * @name use()
     * @param {Function} `plugin` Plugin function that takes an instance of Enquirer.
     * @return {Object} Returns the Enquirer instance.
     * @api public
     */

  }, {
    key: "use",
    value: function use(plugin) {
      plugin.call(this, this);
      return this;
    }
  }, {
    key: "Prompt",
    set: function set(value) {
      this._Prompt = value;
    },
    get: function get() {
      return this._Prompt || this.constructor.Prompt;
    }
  }, {
    key: "prompts",
    get: function get() {
      return this.constructor.prompts;
    }
  }], [{
    key: "Prompt",
    set: function set(value) {
      this._Prompt = value;
    },
    get: function get() {
      return this._Prompt || require('./lib/prompt');
    }
  }, {
    key: "prompts",
    get: function get() {
      return require('./lib/prompts');
    }
  }, {
    key: "types",
    get: function get() {
      return require('./lib/types');
    }
    /**
     * Prompt function that takes a "question" object or array of question objects,
     * and returns an object with responses from the user.
     *
     * ```js
     * const { prompt } = require('enquirer');
     * const response = await prompt({
     *   type: 'input',
     *   name: 'username',
     *   message: 'What is your username?'
     * });
     * console.log(response);
     * ```
     * @name Enquirer#prompt
     * @param {Array|Object} `questions` Options objects for one or more prompts to run.
     * @return {Promise} Promise that returns an "answers" object with the user's responses.
     * @api public
     */

  }, {
    key: "prompt",
    get: function get() {
      var _this3 = this;

      var fn = function fn(questions) {
        for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          rest[_key2 - 1] = arguments[_key2];
        }

        var enquirer = _construct(_this3, rest);

        var emit = enquirer.emit.bind(enquirer);

        enquirer.emit = function () {
          fn.emit.apply(fn, arguments);
          return emit.apply(void 0, arguments);
        };

        return enquirer.prompt(questions);
      };

      utils.mixinEmitter(fn, new Events());
      return fn;
    }
  }]);

  return Enquirer;
}(Events);

utils.mixinEmitter(Enquirer, new Events());
var prompts = Enquirer.prompts;

var _loop = function _loop() {
  var name = _Object$keys2[_i2];
  var key = name.toLowerCase();

  var run = function run(options) {
    return new prompts[name](options).run();
  };

  Enquirer.prompt[key] = run;
  Enquirer[key] = run;

  if (!Enquirer[name]) {
    Reflect.defineProperty(Enquirer, name, {
      get: function get() {
        return prompts[name];
      }
    });
  }
};

for (var _i2 = 0, _Object$keys2 = Object.keys(prompts); _i2 < _Object$keys2.length; _i2++) {
  _loop();
}

var exp = function exp(name) {
  utils.defineExport(Enquirer, name, function () {
    return Enquirer.types[name];
  });
};

exp('ArrayPrompt');
exp('AuthPrompt');
exp('BooleanPrompt');
exp('NumberPrompt');
exp('StringPrompt');
module.exports = Enquirer;
},{"assert":"node_modules/assert/assert.js","events":"node_modules/events/events.js","./lib/utils":"node_modules/enquirer/lib/utils.js","./lib/prompt":"node_modules/enquirer/lib/prompt.js","./lib/prompts":"node_modules/enquirer/lib/prompts/index.js","./lib/types":"node_modules/enquirer/lib/types/index.js"}],"utils/shell.meta.js":[function(require,module,exports) {
var shellRcPaths = ["".concat("/Users/lorendav", "/.zshrc"), "".concat("/Users/lorendav", "/.bashrc"), "".concat("/Users/lorendav", "/.bash_profile")];
module.exports = {
  shellRcPaths: shellRcPaths
};
},{}],"cli/commandless/installAliasInShellRc.js":[function(require,module,exports) {
var process = require("process");
var colors = require("colors/safe"),
    config = require("../../config"),
    enquirer = require("enquirer"),
    fs = require("fs"),
    _require = require("../../utils/shell.meta"),
    shellRcPaths = _require.shellRcPaths; // setup an autocomplete to be used later 🤓


var shellRcSelectAutocomplete = new enquirer.AutoComplete({
  name: "shellPath",
  message: "What is the path to your shell config?",
  stdout: process.stderr,
  choices: shellRcPaths.map(function (shellPath) {
    return {
      title: shellPath,
      value: {
        shellPath: shellPath,
        toString: function toString() {
          return shellPath;
        }
      }
    };
  })
});

module.exports = function (cli, db, flags, next) {
  if (flags.install === true) {
    // Trigger the installation process of the shell command
    shellRcSelectAutocomplete.run().then(function (_ref) {
      var shellPath = _ref.shellPath;
      var rcFileExists = fs.existsSync(shellPath);
      var bWrite = false;

      try {
        if (rcFileExists) {
          var rcFileContents = fs.readFileSync(shellPath);

          if (!rcFileContents) {
            throw new Error("Could not read the file contents");
          } else if (rcFileContents.includes(config.shellCommands.shellAliasGetterString)) {
            console.log(colors.bold.inverse(" Seems to be installed already ✅ "));
          } else {
            bWrite = true;
          }
        } else {
          bWrite = true;
        }

        if (bWrite) {
          fs.appendFileSync(shellPath, "\n\n#project-butler:\n".concat(config.shellCommands.shellAliasGetterEvalString, "\n"));
          console.log(colors.bold.inverse("Well done. You are ready! ✅"));
        }
      } catch (e) {
        console.log(colors.bold.inverse("Could not access your files. Please add the line manually to your shell config:"));
        console.log("");
        console.log(colors.bold(config.shellCommands.shellAliasGetterEvalString));
        console.log("");
        console.log(e);
      }
    });
  } else {
    next();
  }
};
},{"colors/safe":"node_modules/colors/safe.js","../../config":"config.js","enquirer":"node_modules/enquirer/index.js","fs":"node_modules/parcel-bundler/src/builtins/_empty.js","../../utils/shell.meta":"utils/shell.meta.js","process":"node_modules/process/browser.js"}],"cli/commandless/catchAll.js":[function(require,module,exports) {
var process = require("process");
var getCWD = process.cwd,
    enquirer = require("enquirer"),
    config = require("../../config");

module.exports = function (cli, db, flags) {
  db.fetchAll().then(function (projectListResult) {
    if (!projectListResult || !Array.isArray(projectListResult.resultData)) {
      throw new Error("Invalid Result");
    }

    var projectsArray = projectListResult.resultData;
    var longestDirectoryNameLength = projectsArray.reduce(function (longestInt, _ref) {
      var directoryName = _ref.directoryName;
      return longestInt > directoryName.length ? longestInt : directoryName.length;
    }, 0);
    new enquirer.AutoComplete({
      name: "project",
      message: "Choose a project (type for autocompletion)",
      stdout: process.stderr,
      choices: projectsArray.map(function (_ref2) {
        var absPath = _ref2.absPath,
            directoryName = _ref2.directoryName,
            aliases = _ref2.aliases;
        var homeDirRx = new RegExp("^" + config.homedir, "i");
        return {
          value: {
            absPath: absPath,
            directoryName: directoryName,
            aliases: aliases,
            toString: function toString() {
              return absPath;
            }
          },
          // name: absPath,
          message: "".concat(directoryName.padEnd(longestDirectoryNameLength, " "), " ").concat(absPath.replace(homeDirRx, "~"))
        };
      })
    }).run().then(function (_ref3) {
      var aliases = _ref3.aliases,
          absPath = _ref3.absPath;

      if (!fs.existsSync(absPath)) {
        console.log("--------------------");
        new enquirer.Confirm({
          message: "ℹ️  The directory is gone! Delete it?  ",
          stdout: process.stderr,
          initial: "Y"
        }).run().then(function (boolDoDelete) {
          if (!boolDoDelete) {
            console.log("No worries I left it in the List!");
          }
        }).catch(console.error);
      } else {
        console.log("Switching to the directory now");
        openProjectOrCallAction(aliases[0], path.resolve(getCWD()));
      }
    }).catch(console.error);
  });
};
},{"enquirer":"node_modules/enquirer/index.js","../../config":"config.js","process":"node_modules/process/browser.js"}],"bin.js":[function(require,module,exports) {
var process = require("process");
require("./utils/stdoutToStderrProxy"); // ! ^ we require this so that Stdout is redirected immediately after

/**
 * Important:
 * This is an interface layer for an overlaying shell caller.
 * This is because node can only fork/spawn but cannot actually manipulate
 * the open shell.
 */


var _require = require("./package.json"),
    VERSION = _require.version;

var cli = require("commander"),
    ensureStorageExistence = require("./db/ensureStorageExistence"),
    getDatabaseManager = require("./db/getDatabaseManager"),
    // ------------------------------
setupCommand_addProject = require("./cli/addProject"),
    setupCommand_removeProject = require("./cli/removeProject"),
    setupCommand_openProjectOrCallCommand = require("./cli/openProjectOrCallCommand"),
    // ------------------------------
cli_returnShellScript = require("./cli/commandless/shellScript"),
    cli_installAliasInShellRc = require("./cli/commandless/installAliasInShellRc"),
    cli_catchAll = require("./cli/commandless/catchAll"); // gotta make sure we can write to the Database! Safety first!


ensureStorageExistence(); // now connect to the Database and get a Manager instance where we can fetch and write

var db = getDatabaseManager(); //----------------------------------------

cli.version(VERSION, "-v, --version", "output the current version").option("-s, --shell-script", "Return the shell script").option("-i, --install", "Tries to install the shell script");
setupCommand_addProject(cli, db);
setupCommand_removeProject(cli, db);
setupCommand_openProjectOrCallCommand(cli, db); // parse the cli arguments

var parsedCliArgs = cli.parse(process.argv);

if (!parsedCliArgs.args || parsedCliArgs.args.length == 0) {
  // ! Each of the following functions will only run if the previous one returned Boolean(true)
  // ! This makes them mutual exclusive and the catchAll only runs if the others did not apply
  var mutualExclusiveCliEvaluators = [cli_returnShellScript, // option -s --shell-script
  cli_installAliasInShellRc, // option -i --install-alias
  cli_catchAll // if nothing was met this will execute
  ]; // * We follow the same approach as "express" by waiting for the previous "next()" function
  // * to be called. So we execute the next promise only if the previous one resolved!

  var lastPromise = Promise.resolve();
  mutualExclusiveCliEvaluators.forEach(function (cliEvaluator) {
    lastPromise = lastPromise.then(function () {
      return new Promise(function (next) {
        cliEvaluator(cli, db, parsedCliArgs, next);
      });
    });
  });
}
},{"./utils/stdoutToStderrProxy":"utils/stdoutToStderrProxy.js","./package.json":"package.json","commander":"node_modules/commander/index.js","./db/ensureStorageExistence":"db/ensureStorageExistence.js","./db/getDatabaseManager":"db/getDatabaseManager.js","./cli/addProject":"cli/addProject.js","./cli/removeProject":"cli/removeProject.js","./cli/openProjectOrCallCommand":"cli/openProjectOrCallCommand.js","./cli/commandless/shellScript":"cli/commandless/shellScript.js","./cli/commandless/installAliasInShellRc":"cli/commandless/installAliasInShellRc.js","./cli/commandless/catchAll":"cli/commandless/catchAll.js","process":"node_modules/process/browser.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51088" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","bin.js"], null)
//# sourceMappingURL=/bin.js.map