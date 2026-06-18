import { getIt } from "get-it";
import { adapter, environment } from "get-it";
import { retry, jsonRequest, jsonResponse, progress, observable } from "get-it/middleware";
import { Observable, defer, of, isObservable, mergeMap, from, lastValueFrom, shareReplay, catchError, concat, throwError, timer, tap, finalize, share, merge, EMPTY } from "rxjs";
import { stegaClean } from "./_chunks-es/stegaClean.js";
import { combineLatestWith, map, filter, finalize as finalize$1 } from "rxjs/operators";
class ClientError extends Error {
  response;
  statusCode = 400;
  responseBody;
  details;
  constructor(res) {
    const props = extractErrorProps(res);
    super(props.message), Object.assign(this, props);
  }
}
class ServerError extends Error {
  response;
  statusCode = 500;
  responseBody;
  details;
  constructor(res) {
    const props = extractErrorProps(res);
    super(props.message), Object.assign(this, props);
  }
}
function extractErrorProps(res) {
  const body = res.body, props = {
    response: res,
    statusCode: res.statusCode,
    responseBody: stringifyBody(body, res),
    message: "",
    details: void 0
  };
  if (body.error && body.message)
    return props.message = `${body.error} - ${body.message}`, props;
  if (isMutationError(body) || isActionError(body)) {
    const allItems = body.error.items || [], items = allItems.slice(0, 5).map((item) => item.error?.description).filter(Boolean);
    let itemsStr = items.length ? `:
- ${items.join(`
- `)}` : "";
    return allItems.length > 5 && (itemsStr += `
...and ${allItems.length - 5} more`), props.message = `${body.error.description}${itemsStr}`, props.details = body.error, props;
  }
  return body.error && body.error.description ? (props.message = body.error.description, props.details = body.error, props) : (props.message = body.error || body.message || httpErrorMessage(res), props);
}
function isMutationError(body) {
  return isPlainObject(body) && isPlainObject(body.error) && body.error.type === "mutationError" && typeof body.error.description == "string";
}
function isActionError(body) {
  return isPlainObject(body) && isPlainObject(body.error) && body.error.type === "actionError" && typeof body.error.description == "string";
}
function isPlainObject(obj) {
  return typeof obj == "object" && obj !== null && !Array.isArray(obj);
}
function httpErrorMessage(res) {
  const statusMessage = res.statusMessage ? ` ${res.statusMessage}` : "";
  return `${res.method}-request to ${res.url} resulted in HTTP ${res.statusCode}${statusMessage}`;
}
function stringifyBody(body, res) {
  return (res.headers["content-type"] || "").toLowerCase().indexOf("application/json") !== -1 ? JSON.stringify(body, null, 2) : body;
}
class CorsOriginError extends Error {
  projectId;
  addOriginUrl;
  constructor({ projectId: projectId2 }) {
    super("CorsOriginError"), this.name = "CorsOriginError", this.projectId = projectId2;
    const url = new URL(`https://sanity.io/manage/project/${projectId2}/api`);
    if (typeof location < "u") {
      const { origin } = location;
      url.searchParams.set("cors", "add"), url.searchParams.set("origin", origin), this.addOriginUrl = url, this.message = `The current origin is not allowed to connect to the Live Content API. Add it here: ${url}`;
    } else
      this.message = `The current origin is not allowed to connect to the Live Content API. Change your configuration here: ${url}`;
  }
}
const httpError = {
  onResponse: (res) => {
    if (res.statusCode >= 500)
      throw new ServerError(res);
    if (res.statusCode >= 400)
      throw new ClientError(res);
    return res;
  }
};
function printWarnings() {
  const seen = {};
  return {
    onResponse: (res) => {
      const warn = res.headers["x-sanity-warning"], warnings = Array.isArray(warn) ? warn : [warn];
      for (const msg of warnings)
        !msg || seen[msg] || (seen[msg] = !0, console.warn(msg));
      return res;
    }
  };
}
function defineHttpRequest(envMiddleware2) {
  return getIt([
    retry({ shouldRetry }),
    ...envMiddleware2,
    printWarnings(),
    jsonRequest(),
    jsonResponse(),
    progress(),
    httpError,
    observable({ implementation: Observable })
  ]);
}
function shouldRetry(err, attempt, options) {
  if (options.maxRetries === 0) return !1;
  const isSafe = options.method === "GET" || options.method === "HEAD", isQuery2 = (options.uri || options.url).startsWith("/data/query"), isRetriableResponse = err.response && (err.response.statusCode === 429 || err.response.statusCode === 502 || err.response.statusCode === 503);
  return (isSafe || isQuery2) && isRetriableResponse ? !0 : retry.shouldRetry(err, attempt, options);
}
const BASE_URL = "https://www.sanity.io/help/";
function generateHelpUrl(slug) {
  return BASE_URL + slug;
}
const VALID_ASSET_TYPES = ["image", "file"], VALID_INSERT_LOCATIONS = ["before", "after", "replace"], dataset = (name) => {
  if (!/^(~[a-z0-9]{1}[-\w]{0,63}|[a-z0-9]{1}[-\w]{0,63})$/.test(name))
    throw new Error(
      "Datasets can only contain lowercase characters, numbers, underscores and dashes, and start with tilde, and be maximum 64 characters"
    );
}, projectId = (id) => {
  if (!/^[-a-z0-9]+$/i.test(id))
    throw new Error("`projectId` can only contain only a-z, 0-9 and dashes");
}, validateAssetType = (type) => {
  if (VALID_ASSET_TYPES.indexOf(type) === -1)
    throw new Error(`Invalid asset type: ${type}. Must be one of ${VALID_ASSET_TYPES.join(", ")}`);
}, validateObject = (op, val) => {
  if (val === null || typeof val != "object" || Array.isArray(val))
    throw new Error(`${op}() takes an object of properties`);
}, validateDocumentId = (op, id) => {
  if (typeof id != "string" || !/^[a-z0-9_][a-z0-9_.-]{0,127}$/i.test(id) || id.includes(".."))
    throw new Error(`${op}(): "${id}" is not a valid document ID`);
}, requireDocumentId = (op, doc) => {
  if (!doc._id)
    throw new Error(`${op}() requires that the document contains an ID ("_id" property)`);
  validateDocumentId(op, doc._id);
}, validateInsert = (at, selector, items) => {
  const signature = "insert(at, selector, items)";
  if (VALID_INSERT_LOCATIONS.indexOf(at) === -1) {
    const valid = VALID_INSERT_LOCATIONS.map((loc) => `"${loc}"`).join(", ");
    throw new Error(`${signature} takes an "at"-argument which is one of: ${valid}`);
  }
  if (typeof selector != "string")
    throw new Error(`${signature} takes a "selector"-argument which must be a string`);
  if (!Array.isArray(items))
    throw new Error(`${signature} takes an "items"-argument which must be an array`);
}, hasDataset = (config) => {
  if (!config.dataset)
    throw new Error("`dataset` must be provided to perform queries");
  return config.dataset || "";
}, requestTag = (tag) => {
  if (typeof tag != "string" || !/^[a-z0-9._-]{1,75}$/i.test(tag))
    throw new Error(
      "Tag can only contain alphanumeric characters, underscores, dashes and dots, and be between one and 75 characters long."
    );
  return tag;
}, resourceConfig = (config) => {
  if (!config["~experimental_resource"])
    throw new Error("`resource` must be provided to perform resource queries");
  const { type, id } = config["~experimental_resource"];
  switch (type) {
    case "dataset": {
      if (id.split(".").length !== 2)
        throw new Error('Dataset resource ID must be in the format "project.dataset"');
      return;
    }
    case "dashboard":
    case "media-library":
    case "canvas":
      return;
    default:
      throw new Error(`Unsupported resource type: ${type.toString()}`);
  }
}, resourceGuard = (service, config) => {
  if (config["~experimental_resource"])
    throw new Error(`\`${service}\` does not support resource-based operations`);
};
function once(fn) {
  let didCall = !1, returnValue;
  return (...args) => (didCall || (returnValue = fn(...args), didCall = !0), returnValue);
}
const createWarningPrinter = (message) => (
  // eslint-disable-next-line no-console
  once((...args) => console.warn(message.join(" "), ...args))
), printCdnAndWithCredentialsWarning = createWarningPrinter([
  "Because you set `withCredentials` to true, we will override your `useCdn`",
  "setting to be false since (cookie-based) credentials are never set on the CDN"
]), printCdnWarning = createWarningPrinter([
  "Since you haven't set a value for `useCdn`, we will deliver content using our",
  "global, edge-cached API-CDN. If you wish to have content delivered faster, set",
  "`useCdn: false` to use the Live API. Note: You may incur higher costs using the live API."
]), printCdnPreviewDraftsWarning = createWarningPrinter([
  "The Sanity client is configured with the `perspective` set to `drafts` or `previewDrafts`, which doesn't support the API-CDN.",
  "The Live API will be used instead. Set `useCdn: false` in your configuration to hide this warning."
]), printPreviewDraftsDeprecationWarning = createWarningPrinter([
  "The `previewDrafts` perspective has been renamed to  `drafts` and will be removed in a future API version"
]), printBrowserTokenWarning = createWarningPrinter([
  "You have configured Sanity client to use a token in the browser. This may cause unintentional security issues.",
  `See ${generateHelpUrl(
    "js-client-browser-token"
  )} for more information and how to hide this warning.`
]), printCredentialedTokenWarning = createWarningPrinter([
  "You have configured Sanity client to use a token, but also provided `withCredentials: true`.",
  "This is no longer supported - only token will be used - remove `withCredentials: true`."
]), printNoApiVersionSpecifiedWarning = createWarningPrinter([
  "Using the Sanity client without specifying an API version is deprecated.",
  `See ${generateHelpUrl("js-client-api-version")}`
]), printNoDefaultExport = createWarningPrinter([
  "The default export of @sanity/client has been deprecated. Use the named export `createClient` instead."
]), defaultCdnHost = "apicdn.sanity.io", defaultConfig = {
  apiHost: "https://api.sanity.io",
  apiVersion: "1",
  useProjectHostname: !0,
  stega: { enabled: !1 }
}, LOCALHOSTS = ["localhost", "127.0.0.1", "0.0.0.0"], isLocal = (host) => LOCALHOSTS.indexOf(host) !== -1;
function validateApiVersion(apiVersion) {
  if (apiVersion === "1" || apiVersion === "X")
    return;
  const apiDate = new Date(apiVersion);
  if (!(/^\d{4}-\d{2}-\d{2}$/.test(apiVersion) && apiDate instanceof Date && apiDate.getTime() > 0))
    throw new Error("Invalid API version string, expected `1` or date in format `YYYY-MM-DD`");
}
function validateApiPerspective(perspective) {
  if (Array.isArray(perspective) && perspective.length > 1 && perspective.includes("raw"))
    throw new TypeError(
      'Invalid API perspective value: "raw". The raw-perspective can not be combined with other perspectives'
    );
}
const initConfig = (config, prevConfig) => {
  const specifiedConfig = {
    ...prevConfig,
    ...config,
    stega: {
      ...typeof prevConfig.stega == "boolean" ? { enabled: prevConfig.stega } : prevConfig.stega || defaultConfig.stega,
      ...typeof config.stega == "boolean" ? { enabled: config.stega } : config.stega || {}
    }
  };
  specifiedConfig.apiVersion || printNoApiVersionSpecifiedWarning();
  const newConfig = {
    ...defaultConfig,
    ...specifiedConfig
  }, projectBased = newConfig.useProjectHostname && !newConfig["~experimental_resource"];
  if (typeof Promise > "u") {
    const helpUrl = generateHelpUrl("js-client-promise-polyfill");
    throw new Error(`No native Promise-implementation found, polyfill needed - see ${helpUrl}`);
  }
  if (projectBased && !newConfig.projectId)
    throw new Error("Configuration must contain `projectId`");
  if (newConfig["~experimental_resource"] && resourceConfig(newConfig), typeof newConfig.perspective < "u" && validateApiPerspective(newConfig.perspective), "encodeSourceMap" in newConfig)
    throw new Error(
      "It looks like you're using options meant for '@sanity/preview-kit/client'. 'encodeSourceMap' is not supported in '@sanity/client'. Did you mean 'stega.enabled'?"
    );
  if ("encodeSourceMapAtPath" in newConfig)
    throw new Error(
      "It looks like you're using options meant for '@sanity/preview-kit/client'. 'encodeSourceMapAtPath' is not supported in '@sanity/client'. Did you mean 'stega.filter'?"
    );
  if (typeof newConfig.stega.enabled != "boolean")
    throw new Error(`stega.enabled must be a boolean, received ${newConfig.stega.enabled}`);
  if (newConfig.stega.enabled && newConfig.stega.studioUrl === void 0)
    throw new Error("stega.studioUrl must be defined when stega.enabled is true");
  if (newConfig.stega.enabled && typeof newConfig.stega.studioUrl != "string" && typeof newConfig.stega.studioUrl != "function")
    throw new Error(
      `stega.studioUrl must be a string or a function, received ${newConfig.stega.studioUrl}`
    );
  const isBrowser = typeof window < "u" && window.location && window.location.hostname, isLocalhost = isBrowser && isLocal(window.location.hostname), hasToken = !!newConfig.token;
  newConfig.withCredentials && hasToken && (printCredentialedTokenWarning(), newConfig.withCredentials = !1), isBrowser && isLocalhost && hasToken && newConfig.ignoreBrowserTokenWarning !== !0 ? printBrowserTokenWarning() : typeof newConfig.useCdn > "u" && printCdnWarning(), projectBased && projectId(newConfig.projectId), newConfig.dataset && dataset(newConfig.dataset), "requestTagPrefix" in newConfig && (newConfig.requestTagPrefix = newConfig.requestTagPrefix ? requestTag(newConfig.requestTagPrefix).replace(/\.+$/, "") : void 0), newConfig.apiVersion = `${newConfig.apiVersion}`.replace(/^v/, ""), newConfig.isDefaultApi = newConfig.apiHost === defaultConfig.apiHost, newConfig.useCdn === !0 && newConfig.withCredentials && printCdnAndWithCredentialsWarning(), newConfig.useCdn = newConfig.useCdn !== !1 && !newConfig.withCredentials, validateApiVersion(newConfig.apiVersion);
  const hostParts = newConfig.apiHost.split("://", 2), protocol = hostParts[0], host = hostParts[1], cdnHost = newConfig.isDefaultApi ? defaultCdnHost : host;
  return projectBased ? (newConfig.url = `${protocol}://${newConfig.projectId}.${host}/v${newConfig.apiVersion}`, newConfig.cdnUrl = `${protocol}://${newConfig.projectId}.${cdnHost}/v${newConfig.apiVersion}`) : (newConfig.url = `${newConfig.apiHost}/v${newConfig.apiVersion}`, newConfig.cdnUrl = newConfig.url), newConfig;
};
class ConnectionFailedError extends Error {
  name = "ConnectionFailedError";
}
class DisconnectError extends Error {
  name = "DisconnectError";
  reason;
  constructor(message, reason, options = {}) {
    super(message, options), this.reason = reason;
  }
}
class ChannelError extends Error {
  name = "ChannelError";
  data;
  constructor(message, data) {
    super(message), this.data = data;
  }
}
class MessageError extends Error {
  name = "MessageError";
  data;
  constructor(message, data, options = {}) {
    super(message, options), this.data = data;
  }
}
class MessageParseError extends Error {
  name = "MessageParseError";
}
const REQUIRED_EVENTS = ["channelError", "disconnect"];
function connectEventSource(initEventSource, events) {
  return defer(() => {
    const es = initEventSource();
    return isObservable(es) ? es : of(es);
  }).pipe(mergeMap((es) => connectWithESInstance(es, events)));
}
function connectWithESInstance(es, events) {
  return new Observable((observer) => {
    const emitOpen = events.includes("open"), emitReconnect = events.includes("reconnect");
    function onError(evt) {
      if ("data" in evt) {
        const [parseError, event] = parseEvent(evt);
        observer.error(
          parseError ? new MessageParseError("Unable to parse EventSource error message", { cause: event }) : new MessageError((event?.data).message, event)
        );
        return;
      }
      es.readyState === es.CLOSED ? observer.error(new ConnectionFailedError("EventSource connection failed")) : emitReconnect && observer.next({ type: "reconnect" });
    }
    function onOpen() {
      observer.next({ type: "open" });
    }
    function onMessage(message) {
      const [parseError, event] = parseEvent(message);
      if (parseError) {
        observer.error(
          new MessageParseError("Unable to parse EventSource message", { cause: parseError })
        );
        return;
      }
      if (message.type === "channelError") {
        observer.error(new ChannelError(extractErrorMessage(event?.data), event.data));
        return;
      }
      if (message.type === "disconnect") {
        observer.error(
          new DisconnectError(
            `Server disconnected client: ${event.data?.reason || "unknown error"}`
          )
        );
        return;
      }
      observer.next({
        type: message.type,
        id: message.lastEventId,
        ...event.data ? { data: event.data } : {}
      });
    }
    es.addEventListener("error", onError), emitOpen && es.addEventListener("open", onOpen);
    const cleanedEvents = [.../* @__PURE__ */ new Set([...REQUIRED_EVENTS, ...events])].filter((type) => type !== "error" && type !== "open" && type !== "reconnect");
    return cleanedEvents.forEach((type) => es.addEventListener(type, onMessage)), () => {
      es.removeEventListener("error", onError), emitOpen && es.removeEventListener("open", onOpen), cleanedEvents.forEach((type) => es.removeEventListener(type, onMessage)), es.close();
    };
  });
}
function parseEvent(message) {
  try {
    const data = typeof message.data == "string" && JSON.parse(message.data);
    return [
      null,
      {
        type: message.type,
        id: message.lastEventId,
        ...isEmptyObject(data) ? {} : { data }
      }
    ];
  } catch (err) {
    return [err, null];
  }
}
function extractErrorMessage(err) {
  return err.error ? err.error.description ? err.error.description : typeof err.error == "string" ? err.error : JSON.stringify(err.error, null, 2) : err.message || "Unknown listener error";
}
function isEmptyObject(data) {
  for (const _ in data)
    return !1;
  return !0;
}
function getSelection(sel) {
  if (typeof sel == "string")
    return { id: sel };
  if (Array.isArray(sel))
    return { query: "*[_id in $ids]", params: { ids: sel } };
  if (typeof sel == "object" && sel !== null && "query" in sel && typeof sel.query == "string")
    return "params" in sel && typeof sel.params == "object" && sel.params !== null ? { query: sel.query, params: sel.params } : { query: sel.query };
  const selectionOpts = [
    "* Document ID (<docId>)",
    "* Array of document IDs",
    "* Object containing `query`"
  ].join(`
`);
  throw new Error(`Unknown selection - must be one of:

${selectionOpts}`);
}
class BasePatch {
  selection;
  operations;
  constructor(selection, operations = {}) {
    this.selection = selection, this.operations = operations;
  }
  /**
   * Sets the given attributes to the document. Does NOT merge objects.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
   */
  set(attrs) {
    return this._assign("set", attrs);
  }
  /**
   * Sets the given attributes to the document if they are not currently set. Does NOT merge objects.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
   */
  setIfMissing(attrs) {
    return this._assign("setIfMissing", attrs);
  }
  /**
   * Performs a "diff-match-patch" operation on the string attributes provided.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to perform operation on. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "dmp"\}
   */
  diffMatchPatch(attrs) {
    return validateObject("diffMatchPatch", attrs), this._assign("diffMatchPatch", attrs);
  }
  /**
   * Unsets the attribute paths provided.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attribute paths to unset.
   */
  unset(attrs) {
    if (!Array.isArray(attrs))
      throw new Error("unset(attrs) takes an array of attributes to unset, non-array given");
    return this.operations = Object.assign({}, this.operations, { unset: attrs }), this;
  }
  /**
   * Increment a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
   *
   * @param attrs - Object of attribute paths to increment, values representing the number to increment by.
   */
  inc(attrs) {
    return this._assign("inc", attrs);
  }
  /**
   * Decrement a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
   *
   * @param attrs - Object of attribute paths to decrement, values representing the number to decrement by.
   */
  dec(attrs) {
    return this._assign("dec", attrs);
  }
  /**
   * Provides methods for modifying arrays, by inserting, appending and replacing elements via a JSONPath expression.
   *
   * @param at - Location to insert at, relative to the given selector, or 'replace' the matched path
   * @param selector - JSONPath expression, eg `comments[-1]` or `blocks[_key=="abc123"]`
   * @param items - Array of items to insert/replace
   */
  insert(at, selector, items) {
    return validateInsert(at, selector, items), this._assign("insert", { [at]: selector, items });
  }
  /**
   * Append the given items to the array at the given JSONPath
   *
   * @param selector - Attribute/path to append to, eg `comments` or `person.hobbies`
   * @param items - Array of items to append to the array
   */
  append(selector, items) {
    return this.insert("after", `${selector}[-1]`, items);
  }
  /**
   * Prepend the given items to the array at the given JSONPath
   *
   * @param selector - Attribute/path to prepend to, eg `comments` or `person.hobbies`
   * @param items - Array of items to prepend to the array
   */
  prepend(selector, items) {
    return this.insert("before", `${selector}[0]`, items);
  }
  /**
   * Change the contents of an array by removing existing elements and/or adding new elements.
   *
   * @param selector - Attribute or JSONPath expression for array
   * @param start - Index at which to start changing the array (with origin 0). If greater than the length of the array, actual starting index will be set to the length of the array. If negative, will begin that many elements from the end of the array (with origin -1) and will be set to 0 if absolute value is greater than the length of the array.x
   * @param deleteCount - An integer indicating the number of old array elements to remove.
   * @param items - The elements to add to the array, beginning at the start index. If you don't specify any elements, splice() will only remove elements from the array.
   */
  splice(selector, start, deleteCount, items) {
    const delAll = typeof deleteCount > "u" || deleteCount === -1, startIndex = start < 0 ? start - 1 : start, delCount = delAll ? -1 : Math.max(0, start + deleteCount), delRange = startIndex < 0 && delCount >= 0 ? "" : delCount, rangeSelector = `${selector}[${startIndex}:${delRange}]`;
    return this.insert("replace", rangeSelector, items || []);
  }
  /**
   * Adds a revision clause, preventing the document from being patched if the `_rev` property does not match the given value
   *
   * @param rev - Revision to lock the patch to
   */
  ifRevisionId(rev) {
    return this.operations.ifRevisionID = rev, this;
  }
  /**
   * Return a plain JSON representation of the patch
   */
  serialize() {
    return { ...getSelection(this.selection), ...this.operations };
  }
  /**
   * Return a plain JSON representation of the patch
   */
  toJSON() {
    return this.serialize();
  }
  /**
   * Clears the patch of all operations
   */
  reset() {
    return this.operations = {}, this;
  }
  _assign(op, props, merge2 = !0) {
    return validateObject(op, props), this.operations = Object.assign({}, this.operations, {
      [op]: Object.assign({}, merge2 && this.operations[op] || {}, props)
    }), this;
  }
  _set(op, props) {
    return this._assign(op, props, !1);
  }
}
class ObservablePatch extends BasePatch {
  #client;
  constructor(selection, operations, client) {
    super(selection, operations), this.#client = client;
  }
  /**
   * Clones the patch
   */
  clone() {
    return new ObservablePatch(this.selection, { ...this.operations }, this.#client);
  }
  commit(options) {
    if (!this.#client)
      throw new Error(
        "No `client` passed to patch, either provide one or pass the patch to a clients `mutate()` method"
      );
    const returnFirst = typeof this.selection == "string", opts = Object.assign({ returnFirst, returnDocuments: !0 }, options);
    return this.#client.mutate({ patch: this.serialize() }, opts);
  }
}
class Patch extends BasePatch {
  #client;
  constructor(selection, operations, client) {
    super(selection, operations), this.#client = client;
  }
  /**
   * Clones the patch
   */
  clone() {
    return new Patch(this.selection, { ...this.operations }, this.#client);
  }
  commit(options) {
    if (!this.#client)
      throw new Error(
        "No `client` passed to patch, either provide one or pass the patch to a clients `mutate()` method"
      );
    const returnFirst = typeof this.selection == "string", opts = Object.assign({ returnFirst, returnDocuments: !0 }, options);
    return this.#client.mutate({ patch: this.serialize() }, opts);
  }
}
const defaultMutateOptions = { returnDocuments: !1 };
class BaseTransaction {
  operations;
  trxId;
  constructor(operations = [], transactionId) {
    this.operations = operations, this.trxId = transactionId;
  }
  /**
   * Creates a new Sanity document. If `_id` is provided and already exists, the mutation will fail. If no `_id` is given, one will automatically be generated by the database.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create. Requires a `_type` property.
   */
  create(doc) {
    return validateObject("create", doc), this._add({ create: doc });
  }
  /**
   * Creates a new Sanity document. If a document with the same `_id` already exists, the create operation will be ignored.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create if it does not already exist. Requires `_id` and `_type` properties.
   */
  createIfNotExists(doc) {
    const op = "createIfNotExists";
    return validateObject(op, doc), requireDocumentId(op, doc), this._add({ [op]: doc });
  }
  /**
   * Creates a new Sanity document, or replaces an existing one if the same `_id` is already used.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create or replace. Requires `_id` and `_type` properties.
   */
  createOrReplace(doc) {
    const op = "createOrReplace";
    return validateObject(op, doc), requireDocumentId(op, doc), this._add({ [op]: doc });
  }
  /**
   * Deletes the document with the given document ID
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param documentId - Document ID to delete
   */
  delete(documentId) {
    return validateDocumentId("delete", documentId), this._add({ delete: { id: documentId } });
  }
  transactionId(id) {
    return id ? (this.trxId = id, this) : this.trxId;
  }
  /**
   * Return a plain JSON representation of the transaction
   */
  serialize() {
    return [...this.operations];
  }
  /**
   * Return a plain JSON representation of the transaction
   */
  toJSON() {
    return this.serialize();
  }
  /**
   * Clears the transaction of all operations
   */
  reset() {
    return this.operations = [], this;
  }
  _add(mut) {
    return this.operations.push(mut), this;
  }
}
class Transaction extends BaseTransaction {
  #client;
  constructor(operations, client, transactionId) {
    super(operations, transactionId), this.#client = client;
  }
  /**
   * Clones the transaction
   */
  clone() {
    return new Transaction([...this.operations], this.#client, this.trxId);
  }
  commit(options) {
    if (!this.#client)
      throw new Error(
        "No `client` passed to transaction, either provide one or pass the transaction to a clients `mutate()` method"
      );
    return this.#client.mutate(
      this.serialize(),
      Object.assign({ transactionId: this.trxId }, defaultMutateOptions, options || {})
    );
  }
  patch(patchOrDocumentId, patchOps) {
    const isBuilder = typeof patchOps == "function", isPatch = typeof patchOrDocumentId != "string" && patchOrDocumentId instanceof Patch, isMutationSelection = typeof patchOrDocumentId == "object" && ("query" in patchOrDocumentId || "id" in patchOrDocumentId);
    if (isPatch)
      return this._add({ patch: patchOrDocumentId.serialize() });
    if (isBuilder) {
      const patch = patchOps(new Patch(patchOrDocumentId, {}, this.#client));
      if (!(patch instanceof Patch))
        throw new Error("function passed to `patch()` must return the patch");
      return this._add({ patch: patch.serialize() });
    }
    if (isMutationSelection) {
      const patch = new Patch(patchOrDocumentId, patchOps || {}, this.#client);
      return this._add({ patch: patch.serialize() });
    }
    return this._add({ patch: { id: patchOrDocumentId, ...patchOps } });
  }
}
class ObservableTransaction extends BaseTransaction {
  #client;
  constructor(operations, client, transactionId) {
    super(operations, transactionId), this.#client = client;
  }
  /**
   * Clones the transaction
   */
  clone() {
    return new ObservableTransaction([...this.operations], this.#client, this.trxId);
  }
  commit(options) {
    if (!this.#client)
      throw new Error(
        "No `client` passed to transaction, either provide one or pass the transaction to a clients `mutate()` method"
      );
    return this.#client.mutate(
      this.serialize(),
      Object.assign({ transactionId: this.trxId }, defaultMutateOptions, options || {})
    );
  }
  patch(patchOrDocumentId, patchOps) {
    const isBuilder = typeof patchOps == "function";
    if (typeof patchOrDocumentId != "string" && patchOrDocumentId instanceof ObservablePatch)
      return this._add({ patch: patchOrDocumentId.serialize() });
    if (isBuilder) {
      const patch = patchOps(new ObservablePatch(patchOrDocumentId, {}, this.#client));
      if (!(patch instanceof ObservablePatch))
        throw new Error("function passed to `patch()` must return the patch");
      return this._add({ patch: patch.serialize() });
    }
    return this._add({ patch: { id: patchOrDocumentId, ...patchOps } });
  }
}
const projectHeader = "X-Sanity-Project-ID";
function requestOptions(config, overrides = {}) {
  const headers = {}, token = overrides.token || config.token;
  token && (headers.Authorization = `Bearer ${token}`), !overrides.useGlobalApi && !config.useProjectHostname && config.projectId && (headers[projectHeader] = config.projectId);
  const withCredentials = !!(typeof overrides.withCredentials > "u" ? config.withCredentials : overrides.withCredentials), timeout = typeof overrides.timeout > "u" ? config.timeout : overrides.timeout;
  return Object.assign({}, overrides, {
    headers: Object.assign({}, headers, overrides.headers || {}),
    timeout: typeof timeout > "u" ? 5 * 60 * 1e3 : timeout,
    proxy: overrides.proxy || config.proxy,
    json: !0,
    withCredentials,
    fetch: typeof overrides.fetch == "object" && typeof config.fetch == "object" ? { ...config.fetch, ...overrides.fetch } : overrides.fetch || config.fetch
  });
}
const encodeQueryString = ({
  query,
  params = {},
  options = {}
}) => {
  const searchParams = new URLSearchParams(), { tag, includeMutations, returnQuery, ...opts } = options;
  tag && searchParams.append("tag", tag), searchParams.append("query", query);
  for (const [key, value] of Object.entries(params))
    searchParams.append(`$${key}`, JSON.stringify(value));
  for (const [key, value] of Object.entries(opts))
    value && searchParams.append(key, `${value}`);
  return returnQuery === !1 && searchParams.append("returnQuery", "false"), includeMutations === !1 && searchParams.append("includeMutations", "false"), `?${searchParams}`;
}, excludeFalsey = (param, defValue) => param === !1 ? void 0 : typeof param > "u" ? defValue : param, getMutationQuery = (options = {}) => ({
  dryRun: options.dryRun,
  returnIds: !0,
  returnDocuments: excludeFalsey(options.returnDocuments, !0),
  visibility: options.visibility || "sync",
  autoGenerateArrayKeys: options.autoGenerateArrayKeys,
  skipCrossDatasetReferenceValidation: options.skipCrossDatasetReferenceValidation
}), isResponse = (event) => event.type === "response", getBody = (event) => event.body, indexBy = (docs, attr) => docs.reduce((indexed, doc) => (indexed[attr(doc)] = doc, indexed), /* @__PURE__ */ Object.create(null)), getQuerySizeLimit = 11264;
function _fetch(client, httpRequest, _stega, query, _params = {}, options = {}) {
  const stega = "stega" in options ? {
    ..._stega || {},
    ...typeof options.stega == "boolean" ? { enabled: options.stega } : options.stega || {}
  } : _stega, params = stega.enabled ? stegaClean(_params) : _params, mapResponse = options.filterResponse === !1 ? (res) => res : (res) => res.result, { cache, next, ...opts } = {
    // Opt out of setting a `signal` on an internal `fetch` if one isn't provided.
    // This is necessary in React Server Components to avoid opting out of Request Memoization.
    useAbortSignal: typeof options.signal < "u",
    // Set `resultSourceMap' when stega is enabled, as it's required for encoding.
    resultSourceMap: stega.enabled ? "withKeyArraySelector" : options.resultSourceMap,
    ...options,
    // Default to not returning the query, unless `filterResponse` is `false`,
    // or `returnQuery` is explicitly set. `true` is the default in Content Lake, so skip if truthy
    returnQuery: options.filterResponse === !1 && options.returnQuery !== !1
  }, reqOpts = typeof cache < "u" || typeof next < "u" ? { ...opts, fetch: { cache, next } } : opts, $request = _dataRequest(client, httpRequest, "query", { query, params }, reqOpts);
  return stega.enabled ? $request.pipe(
    combineLatestWith(
      from(
        import("./_chunks-es/stegaEncodeSourceMap.js").then(function(n) {
          return n.stegaEncodeSourceMap$1;
        }).then(
          ({ stegaEncodeSourceMap }) => stegaEncodeSourceMap
        )
      )
    ),
    map(
      ([res, stegaEncodeSourceMap]) => {
        const result = stegaEncodeSourceMap(res.result, res.resultSourceMap, stega);
        return mapResponse({ ...res, result });
      }
    )
  ) : $request.pipe(map(mapResponse));
}
function _getDocument(client, httpRequest, id, opts = {}) {
  const options = {
    uri: _getDataUrl(client, "doc", id),
    json: !0,
    tag: opts.tag,
    signal: opts.signal
  };
  return _requestObservable(client, httpRequest, options).pipe(
    filter(isResponse),
    map((event) => event.body.documents && event.body.documents[0])
  );
}
function _getDocuments(client, httpRequest, ids, opts = {}) {
  const options = {
    uri: _getDataUrl(client, "doc", ids.join(",")),
    json: !0,
    tag: opts.tag,
    signal: opts.signal
  };
  return _requestObservable(client, httpRequest, options).pipe(
    filter(isResponse),
    map((event) => {
      const indexed = indexBy(event.body.documents || [], (doc) => doc._id);
      return ids.map((id) => indexed[id] || null);
    })
  );
}
function _createIfNotExists(client, httpRequest, doc, options) {
  return requireDocumentId("createIfNotExists", doc), _create(client, httpRequest, doc, "createIfNotExists", options);
}
function _createOrReplace(client, httpRequest, doc, options) {
  return requireDocumentId("createOrReplace", doc), _create(client, httpRequest, doc, "createOrReplace", options);
}
function _delete(client, httpRequest, selection, options) {
  return _dataRequest(
    client,
    httpRequest,
    "mutate",
    { mutations: [{ delete: getSelection(selection) }] },
    options
  );
}
function _mutate(client, httpRequest, mutations, options) {
  let mut;
  mutations instanceof Patch || mutations instanceof ObservablePatch ? mut = { patch: mutations.serialize() } : mutations instanceof Transaction || mutations instanceof ObservableTransaction ? mut = mutations.serialize() : mut = mutations;
  const muts = Array.isArray(mut) ? mut : [mut], transactionId = options && options.transactionId || void 0;
  return _dataRequest(client, httpRequest, "mutate", { mutations: muts, transactionId }, options);
}
function _action(client, httpRequest, actions, options) {
  const acts = Array.isArray(actions) ? actions : [actions], transactionId = options && options.transactionId || void 0, skipCrossDatasetReferenceValidation = options && options.skipCrossDatasetReferenceValidation || void 0, dryRun = options && options.dryRun || void 0;
  return _dataRequest(
    client,
    httpRequest,
    "actions",
    { actions: acts, transactionId, skipCrossDatasetReferenceValidation, dryRun },
    options
  );
}
function _dataRequest(client, httpRequest, endpoint, body, options = {}) {
  const isMutation = endpoint === "mutate", isAction = endpoint === "actions", isQuery2 = endpoint === "query", strQuery = isMutation || isAction ? "" : encodeQueryString(body), useGet = !isMutation && !isAction && strQuery.length < getQuerySizeLimit, stringQuery = useGet ? strQuery : "", returnFirst = options.returnFirst, { timeout, token, tag, headers, returnQuery, lastLiveEventId, cacheMode } = options, uri = _getDataUrl(client, endpoint, stringQuery), reqOptions = {
    method: useGet ? "GET" : "POST",
    uri,
    json: !0,
    body: useGet ? void 0 : body,
    query: isMutation && getMutationQuery(options),
    timeout,
    headers,
    token,
    tag,
    returnQuery,
    perspective: options.perspective,
    resultSourceMap: options.resultSourceMap,
    lastLiveEventId: Array.isArray(lastLiveEventId) ? lastLiveEventId[0] : lastLiveEventId,
    cacheMode,
    canUseCdn: isQuery2,
    signal: options.signal,
    fetch: options.fetch,
    useAbortSignal: options.useAbortSignal,
    useCdn: options.useCdn
  };
  return _requestObservable(client, httpRequest, reqOptions).pipe(
    filter(isResponse),
    map(getBody),
    map((res) => {
      if (!isMutation)
        return res;
      const results = res.results || [];
      if (options.returnDocuments)
        return returnFirst ? results[0] && results[0].document : results.map((mut) => mut.document);
      const key = returnFirst ? "documentId" : "documentIds", ids = returnFirst ? results[0] && results[0].id : results.map((mut) => mut.id);
      return {
        transactionId: res.transactionId,
        results,
        [key]: ids
      };
    })
  );
}
function _create(client, httpRequest, doc, op, options = {}) {
  const mutation = { [op]: doc }, opts = Object.assign({ returnFirst: !0, returnDocuments: !0 }, options);
  return _dataRequest(client, httpRequest, "mutate", { mutations: [mutation] }, opts);
}
const hasDataConfig = (client) => client.config().dataset !== void 0 && client.config().projectId !== void 0 || client.config()["~experimental_resource"] !== void 0, isQuery = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "query")), isMutate = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "mutate")), isDoc = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "doc", "")), isListener = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "listen")), isHistory = (client, uri) => hasDataConfig(client) && uri.startsWith(_getDataUrl(client, "history", "")), isData = (client, uri) => uri.startsWith("/data/") || isQuery(client, uri) || isMutate(client, uri) || isDoc(client, uri) || isListener(client, uri) || isHistory(client, uri);
function _requestObservable(client, httpRequest, options) {
  const uri = options.url || options.uri, config = client.config(), canUseCdn = typeof options.canUseCdn > "u" ? ["GET", "HEAD"].indexOf(options.method || "GET") >= 0 && isData(client, uri) : options.canUseCdn;
  let useCdn = (options.useCdn ?? config.useCdn) && canUseCdn;
  const tag = options.tag && config.requestTagPrefix ? [config.requestTagPrefix, options.tag].join(".") : options.tag || config.requestTagPrefix;
  if (tag && options.tag !== null && (options.query = { tag: requestTag(tag), ...options.query }), ["GET", "HEAD", "POST"].indexOf(options.method || "GET") >= 0 && isQuery(client, uri)) {
    const resultSourceMap = options.resultSourceMap ?? config.resultSourceMap;
    resultSourceMap !== void 0 && resultSourceMap !== !1 && (options.query = { resultSourceMap, ...options.query });
    const perspectiveOption = options.perspective || config.perspective;
    typeof perspectiveOption < "u" && (perspectiveOption === "previewDrafts" && printPreviewDraftsDeprecationWarning(), validateApiPerspective(perspectiveOption), options.query = {
      perspective: Array.isArray(perspectiveOption) ? perspectiveOption.join(",") : perspectiveOption,
      ...options.query
    }, (Array.isArray(perspectiveOption) && perspectiveOption.length > 0 || // previewDrafts was renamed to drafts, but keep for backwards compat
    perspectiveOption === "previewDrafts" || perspectiveOption === "drafts") && useCdn && (useCdn = !1, printCdnPreviewDraftsWarning())), options.lastLiveEventId && (options.query = { ...options.query, lastLiveEventId: options.lastLiveEventId }), options.returnQuery === !1 && (options.query = { returnQuery: "false", ...options.query }), useCdn && options.cacheMode == "noStale" && (options.query = { cacheMode: "noStale", ...options.query });
  }
  const reqOptions = requestOptions(
    config,
    Object.assign({}, options, {
      url: _getUrl(client, uri, useCdn)
    })
  ), request = new Observable(
    (subscriber) => httpRequest(reqOptions, config.requester).subscribe(subscriber)
  );
  return options.signal ? request.pipe(_withAbortSignal(options.signal)) : request;
}
function _request(client, httpRequest, options) {
  return _requestObservable(client, httpRequest, options).pipe(
    filter((event) => event.type === "response"),
    map((event) => event.body)
  );
}
function _getDataUrl(client, operation, path) {
  const config = client.config();
  if (config["~experimental_resource"]) {
    resourceConfig(config);
    const resourceBase = resourceDataBase(config), uri2 = path !== void 0 ? `${operation}/${path}` : operation;
    return `${resourceBase}/${uri2}`.replace(/\/($|\?)/, "$1");
  }
  const catalog = hasDataset(config), baseUri = `/${operation}/${catalog}`;
  return `/data${path !== void 0 ? `${baseUri}/${path}` : baseUri}`.replace(/\/($|\?)/, "$1");
}
function _getUrl(client, uri, canUseCdn = !1) {
  const { url, cdnUrl } = client.config();
  return `${canUseCdn ? cdnUrl : url}/${uri.replace(/^\//, "")}`;
}
function _withAbortSignal(signal) {
  return (input) => new Observable((observer) => {
    const abort = () => observer.error(_createAbortError(signal));
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const subscription = input.subscribe(observer);
    return signal.addEventListener("abort", abort), () => {
      signal.removeEventListener("abort", abort), subscription.unsubscribe();
    };
  });
}
const isDomExceptionSupported = !!globalThis.DOMException;
function _createAbortError(signal) {
  if (isDomExceptionSupported)
    return new DOMException(signal?.reason ?? "The operation was aborted.", "AbortError");
  const error = new Error(signal?.reason ?? "The operation was aborted.");
  return error.name = "AbortError", error;
}
const resourceDataBase = (config) => {
  if (!config["~experimental_resource"])
    throw new Error("`resource` must be provided to perform resource queries");
  const { type, id } = config["~experimental_resource"];
  switch (type) {
    case "dataset": {
      const segments = id.split(".");
      if (segments.length !== 2)
        throw new Error('Dataset ID must be in the format "project.dataset"');
      return `/projects/${segments[0]}/datasets/${segments[1]}`;
    }
    case "canvas":
      return `/canvases/${id}`;
    case "media-library":
      return `/media-libraries/${id}`;
    case "dashboard":
      return `/dashboards/${id}`;
    default:
      throw new Error(`Unsupported resource type: ${type.toString()}`);
  }
};
class ObservableAssetsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  upload(assetType, body, options) {
    return _upload(this.#client, this.#httpRequest, assetType, body, options);
  }
}
class AssetsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  upload(assetType, body, options) {
    const observable2 = _upload(this.#client, this.#httpRequest, assetType, body, options);
    return lastValueFrom(
      observable2.pipe(
        filter((event) => event.type === "response"),
        map(
          (event) => event.body.document
        )
      )
    );
  }
}
function _upload(client, httpRequest, assetType, body, opts = {}) {
  validateAssetType(assetType);
  let meta = opts.extract || void 0;
  meta && !meta.length && (meta = ["none"]);
  const config = client.config(), options = optionsFromFile(opts, body), { tag, label, title, description, creditLine, filename, source } = options, query = {
    label,
    title,
    description,
    filename,
    meta,
    creditLine
  };
  return source && (query.sourceId = source.id, query.sourceName = source.name, query.sourceUrl = source.url), _requestObservable(client, httpRequest, {
    tag,
    method: "POST",
    timeout: options.timeout || 0,
    uri: buildAssetUploadUrl(config, assetType),
    headers: options.contentType ? { "Content-Type": options.contentType } : {},
    query,
    body
  });
}
function buildAssetUploadUrl(config, assetType) {
  const assetTypeEndpoint = assetType === "image" ? "images" : "files";
  if (config["~experimental_resource"]) {
    const { type, id } = config["~experimental_resource"];
    switch (type) {
      case "dataset":
        throw new Error(
          "Assets are not supported for dataset resources, yet. Configure the client with `{projectId: <projectId>, dataset: <datasetId>}` instead."
        );
      case "canvas":
        return `/canvases/${id}/assets/${assetTypeEndpoint}`;
      case "media-library":
        return `/media-libraries/${id}/upload`;
      case "dashboard":
        return `/dashboards/${id}/assets/${assetTypeEndpoint}`;
      default:
        throw new Error(`Unsupported resource type: ${type.toString()}`);
    }
  }
  const dataset2 = hasDataset(config);
  return `assets/${assetTypeEndpoint}/${dataset2}`;
}
function optionsFromFile(opts, file) {
  return typeof File > "u" || !(file instanceof File) ? opts : Object.assign(
    {
      filename: opts.preserveFilename === !1 ? void 0 : file.name,
      contentType: file.type
    },
    opts
  );
}
var defaults = (obj, defaults2) => Object.keys(defaults2).concat(Object.keys(obj)).reduce((target, prop) => (target[prop] = typeof obj[prop] > "u" ? defaults2[prop] : obj[prop], target), {});
const pick = (obj, props) => props.reduce((selection, prop) => (typeof obj[prop] > "u" || (selection[prop] = obj[prop]), selection), {}), eventSourcePolyfill = defer(() => import("@sanity/eventsource")).pipe(
  map(({ default: EventSource2 }) => EventSource2),
  shareReplay(1)
);
function reconnectOnConnectionFailure() {
  return function(source) {
    return source.pipe(
      catchError((err, caught) => err instanceof ConnectionFailedError ? concat(of({ type: "reconnect" }), timer(1e3).pipe(mergeMap(() => caught))) : throwError(() => err))
    );
  };
}
const MAX_URL_LENGTH = 14800, possibleOptions = [
  "includePreviousRevision",
  "includeResult",
  "includeMutations",
  "includeAllVersions",
  "visibility",
  "effectFormat",
  "tag"
], defaultOptions = {
  includeResult: !0
};
function _listen(query, params, opts = {}) {
  const { url, token, withCredentials, requestTagPrefix } = this.config(), tag = opts.tag && requestTagPrefix ? [requestTagPrefix, opts.tag].join(".") : opts.tag, options = { ...defaults(opts, defaultOptions), tag }, listenOpts = pick(options, possibleOptions), qs = encodeQueryString({ query, params, options: { tag, ...listenOpts } }), uri = `${url}${_getDataUrl(this, "listen", qs)}`;
  if (uri.length > MAX_URL_LENGTH)
    return throwError(() => new Error("Query too large for listener"));
  const listenFor = options.events ? options.events : ["mutation"], esOptions = {};
  return withCredentials && (esOptions.withCredentials = !0), token && (esOptions.headers = {
    Authorization: `Bearer ${token}`
  }), connectEventSource(() => (
    // use polyfill if there is no global EventSource or if we need to set headers
    (typeof EventSource > "u" || esOptions.headers ? eventSourcePolyfill : of(EventSource)).pipe(map((EventSource2) => new EventSource2(uri, esOptions)))
  ), listenFor).pipe(
    reconnectOnConnectionFailure(),
    filter((event) => listenFor.includes(event.type)),
    map(
      (event) => ({
        type: event.type,
        ..."data" in event ? event.data : {}
      })
    )
  );
}
function shareReplayLatest(configOrPredicate, config) {
  return _shareReplayLatest(
    typeof configOrPredicate == "function" ? { predicate: configOrPredicate, ...config } : configOrPredicate
  );
}
function _shareReplayLatest(config) {
  return (source) => {
    let latest, emitted = !1;
    const { predicate, ...shareConfig } = config, wrapped = source.pipe(
      tap((value) => {
        config.predicate(value) && (emitted = !0, latest = value);
      }),
      finalize(() => {
        emitted = !1, latest = void 0;
      }),
      share(shareConfig)
    ), emitLatest = new Observable((subscriber) => {
      emitted && subscriber.next(
        // this cast is safe because of the emitted check which asserts that we got T from the source
        latest
      ), subscriber.complete();
    });
    return merge(wrapped, emitLatest);
  };
}
const requiredApiVersion = "2021-03-25";
class LiveClient {
  #client;
  constructor(client) {
    this.#client = client;
  }
  /**
   * Requires `apiVersion` to be `2021-03-25` or later.
   */
  events({
    includeDrafts = !1,
    tag: _tag
  } = {}) {
    resourceGuard("live", this.#client.config());
    const {
      projectId: projectId2,
      apiVersion: _apiVersion,
      token,
      withCredentials,
      requestTagPrefix
    } = this.#client.config(), apiVersion = _apiVersion.replace(/^v/, "");
    if (apiVersion !== "X" && apiVersion < requiredApiVersion)
      throw new Error(
        `The live events API requires API version ${requiredApiVersion} or later. The current API version is ${apiVersion}. Please update your API version to use this feature.`
      );
    if (includeDrafts && !token && !withCredentials)
      throw new Error(
        "The live events API requires a token or withCredentials when 'includeDrafts: true'. Please update your client configuration. The token should have the lowest possible access role."
      );
    const path = _getDataUrl(this.#client, "live/events"), url = new URL(this.#client.getUrl(path, !1)), tag = _tag && requestTagPrefix ? [requestTagPrefix, _tag].join(".") : _tag;
    tag && url.searchParams.set("tag", tag), includeDrafts && url.searchParams.set("includeDrafts", "true");
    const esOptions = {};
    includeDrafts && token && (esOptions.headers = {
      Authorization: `Bearer ${token}`
    }), includeDrafts && withCredentials && (esOptions.withCredentials = !0);
    const key = `${url.href}::${JSON.stringify(esOptions)}`, existing = eventsCache.get(key);
    if (existing)
      return existing;
    const events = connectEventSource(() => (
      // use polyfill if there is no global EventSource or if we need to set headers
      (typeof EventSource > "u" || esOptions.headers ? eventSourcePolyfill : of(EventSource)).pipe(map((EventSource2) => new EventSource2(url.href, esOptions)))
    ), [
      "message",
      "restart",
      "welcome",
      "reconnect",
      "goaway"
    ]).pipe(
      reconnectOnConnectionFailure(),
      map((event) => {
        if (event.type === "message") {
          const { data, ...rest } = event;
          return { ...rest, tags: data.tags };
        }
        return event;
      })
    ), checkCors = fetchObservable(url, {
      method: "OPTIONS",
      mode: "cors",
      credentials: esOptions.withCredentials ? "include" : "omit",
      headers: esOptions.headers
    }).pipe(
      mergeMap(() => EMPTY),
      catchError(() => {
        throw new CorsOriginError({ projectId: projectId2 });
      })
    ), observable2 = concat(checkCors, events).pipe(
      finalize$1(() => eventsCache.delete(key)),
      shareReplayLatest({
        predicate: (event) => event.type === "welcome"
      })
    );
    return eventsCache.set(key, observable2), observable2;
  }
}
function fetchObservable(url, init) {
  return new Observable((observer) => {
    const controller = new AbortController(), signal = controller.signal;
    return fetch(url, { ...init, signal: controller.signal }).then(
      (response) => {
        observer.next(response), observer.complete();
      },
      (err) => {
        signal.aborted || observer.error(err);
      }
    ), () => controller.abort();
  });
}
const eventsCache = /* @__PURE__ */ new Map();
class ObservableDatasetsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
   * Create a new dataset with the given name
   *
   * @param name - Name of the dataset to create
   * @param options - Options for the dataset
   */
  create(name, options) {
    return _modify(this.#client, this.#httpRequest, "PUT", name, options);
  }
  /**
   * Edit a dataset with the given name
   *
   * @param name - Name of the dataset to edit
   * @param options - New options for the dataset
   */
  edit(name, options) {
    return _modify(this.#client, this.#httpRequest, "PATCH", name, options);
  }
  /**
   * Delete a dataset with the given name
   *
   * @param name - Name of the dataset to delete
   */
  delete(name) {
    return _modify(this.#client, this.#httpRequest, "DELETE", name);
  }
  /**
   * Fetch a list of datasets for the configured project
   */
  list() {
    return _request(this.#client, this.#httpRequest, {
      uri: "/datasets",
      tag: null
    });
  }
}
class DatasetsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
   * Create a new dataset with the given name
   *
   * @param name - Name of the dataset to create
   * @param options - Options for the dataset
   */
  create(name, options) {
    return resourceGuard("dataset", this.#client.config()), lastValueFrom(
      _modify(this.#client, this.#httpRequest, "PUT", name, options)
    );
  }
  /**
   * Edit a dataset with the given name
   *
   * @param name - Name of the dataset to edit
   * @param options - New options for the dataset
   */
  edit(name, options) {
    return resourceGuard("dataset", this.#client.config()), lastValueFrom(
      _modify(this.#client, this.#httpRequest, "PATCH", name, options)
    );
  }
  /**
   * Delete a dataset with the given name
   *
   * @param name - Name of the dataset to delete
   */
  delete(name) {
    return resourceGuard("dataset", this.#client.config()), lastValueFrom(_modify(this.#client, this.#httpRequest, "DELETE", name));
  }
  /**
   * Fetch a list of datasets for the configured project
   */
  list() {
    return resourceGuard("dataset", this.#client.config()), lastValueFrom(
      _request(this.#client, this.#httpRequest, { uri: "/datasets", tag: null })
    );
  }
}
function _modify(client, httpRequest, method, name, options) {
  return resourceGuard("dataset", client.config()), dataset(name), _request(client, httpRequest, {
    method,
    uri: `/datasets/${name}`,
    body: options,
    tag: null
  });
}
class ObservableProjectsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  list(options) {
    resourceGuard("projects", this.#client.config());
    const uri = options?.includeMembers === !1 ? "/projects?includeMembers=false" : "/projects";
    return _request(this.#client, this.#httpRequest, { uri });
  }
  /**
   * Fetch a project by project ID
   *
   * @param projectId - ID of the project to fetch
   */
  getById(projectId2) {
    return resourceGuard("projects", this.#client.config()), _request(this.#client, this.#httpRequest, { uri: `/projects/${projectId2}` });
  }
}
class ProjectsClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  list(options) {
    resourceGuard("projects", this.#client.config());
    const uri = options?.includeMembers === !1 ? "/projects?includeMembers=false" : "/projects";
    return lastValueFrom(_request(this.#client, this.#httpRequest, { uri }));
  }
  /**
   * Fetch a project by project ID
   *
   * @param projectId - ID of the project to fetch
   */
  getById(projectId2) {
    return resourceGuard("projects", this.#client.config()), lastValueFrom(
      _request(this.#client, this.#httpRequest, { uri: `/projects/${projectId2}` })
    );
  }
}
class ObservableUsersClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
   * Fetch a user by user ID
   *
   * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
   */
  getById(id) {
    return _request(
      this.#client,
      this.#httpRequest,
      { uri: `/users/${id}` }
    );
  }
}
class UsersClient {
  #client;
  #httpRequest;
  constructor(client, httpRequest) {
    this.#client = client, this.#httpRequest = httpRequest;
  }
  /**
   * Fetch a user by user ID
   *
   * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
   */
  getById(id) {
    return lastValueFrom(
      _request(this.#client, this.#httpRequest, {
        uri: `/users/${id}`
      })
    );
  }
}
class ObservableSanityClient {
  assets;
  datasets;
  live;
  projects;
  users;
  /**
   * Private properties
   */
  #clientConfig;
  #httpRequest;
  /**
   * Instance properties
   */
  listen = _listen;
  constructor(httpRequest, config = defaultConfig) {
    this.config(config), this.#httpRequest = httpRequest, this.assets = new ObservableAssetsClient(this, this.#httpRequest), this.datasets = new ObservableDatasetsClient(this, this.#httpRequest), this.live = new LiveClient(this), this.projects = new ObservableProjectsClient(this, this.#httpRequest), this.users = new ObservableUsersClient(this, this.#httpRequest);
  }
  /**
   * Clone the client - returns a new instance
   */
  clone() {
    return new ObservableSanityClient(this.#httpRequest, this.config());
  }
  config(newConfig) {
    if (newConfig === void 0)
      return { ...this.#clientConfig };
    if (this.#clientConfig && this.#clientConfig.allowReconfigure === !1)
      throw new Error(
        "Existing client instance cannot be reconfigured - use `withConfig(newConfig)` to return a new client"
      );
    return this.#clientConfig = initConfig(newConfig, this.#clientConfig || {}), this;
  }
  /**
   * Clone the client with a new (partial) configuration.
   *
   * @param newConfig - New client configuration properties, shallowly merged with existing configuration
   */
  withConfig(newConfig) {
    const thisConfig = this.config();
    return new ObservableSanityClient(this.#httpRequest, {
      ...thisConfig,
      ...newConfig,
      stega: {
        ...thisConfig.stega || {},
        ...typeof newConfig?.stega == "boolean" ? { enabled: newConfig.stega } : newConfig?.stega || {}
      }
    });
  }
  fetch(query, params, options) {
    return _fetch(
      this,
      this.#httpRequest,
      this.#clientConfig.stega,
      query,
      params,
      options
    );
  }
  /**
   * Fetch a single document with the given ID.
   *
   * @param id - Document ID to fetch
   * @param options - Request options
   */
  getDocument(id, options) {
    return _getDocument(this, this.#httpRequest, id, options);
  }
  /**
   * Fetch multiple documents in one request.
   * Should be used sparingly - performing a query is usually a better option.
   * The order/position of documents is preserved based on the original array of IDs.
   * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
   *
   * @param ids - Document IDs to fetch
   * @param options - Request options
   */
  getDocuments(ids, options) {
    return _getDocuments(this, this.#httpRequest, ids, options);
  }
  create(document, options) {
    return _create(this, this.#httpRequest, document, "create", options);
  }
  createIfNotExists(document, options) {
    return _createIfNotExists(this, this.#httpRequest, document, options);
  }
  createOrReplace(document, options) {
    return _createOrReplace(this, this.#httpRequest, document, options);
  }
  delete(selection, options) {
    return _delete(this, this.#httpRequest, selection, options);
  }
  mutate(operations, options) {
    return _mutate(this, this.#httpRequest, operations, options);
  }
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param selection - Document ID, an array of document IDs, or an object with `query` and optional `params`, defining which document(s) to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(selection, operations) {
    return new ObservablePatch(selection, operations, this);
  }
  /**
   * Create a new transaction of mutations
   *
   * @param operations - Optional array of mutation operations to initialize the transaction instance with
   */
  transaction(operations) {
    return new ObservableTransaction(operations, this);
  }
  /**
   * Perform action operations against the configured dataset
   *
   * @param operations - Action operation(s) to execute
   * @param options - Action options
   */
  action(operations, options) {
    return _action(this, this.#httpRequest, operations, options);
  }
  /**
   * Perform an HTTP request against the Sanity API
   *
   * @param options - Request options
   */
  request(options) {
    return _request(this, this.#httpRequest, options);
  }
  /**
   * Get a Sanity API URL for the URI provided
   *
   * @param uri - URI/path to build URL for
   * @param canUseCdn - Whether or not to allow using the API CDN for this route
   */
  getUrl(uri, canUseCdn) {
    return _getUrl(this, uri, canUseCdn);
  }
  /**
   * Get a Sanity API URL for the data operation and path provided
   *
   * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
   * @param path - Path to append after the operation
   */
  getDataUrl(operation, path) {
    return _getDataUrl(this, operation, path);
  }
}
class SanityClient {
  assets;
  datasets;
  live;
  projects;
  users;
  /**
   * Observable version of the Sanity client, with the same configuration as the promise-based one
   */
  observable;
  /**
   * Private properties
   */
  #clientConfig;
  #httpRequest;
  /**
   * Instance properties
   */
  listen = _listen;
  constructor(httpRequest, config = defaultConfig) {
    this.config(config), this.#httpRequest = httpRequest, this.assets = new AssetsClient(this, this.#httpRequest), this.datasets = new DatasetsClient(this, this.#httpRequest), this.live = new LiveClient(this), this.projects = new ProjectsClient(this, this.#httpRequest), this.users = new UsersClient(this, this.#httpRequest), this.observable = new ObservableSanityClient(httpRequest, config);
  }
  /**
   * Clone the client - returns a new instance
   */
  clone() {
    return new SanityClient(this.#httpRequest, this.config());
  }
  config(newConfig) {
    if (newConfig === void 0)
      return { ...this.#clientConfig };
    if (this.#clientConfig && this.#clientConfig.allowReconfigure === !1)
      throw new Error(
        "Existing client instance cannot be reconfigured - use `withConfig(newConfig)` to return a new client"
      );
    return this.observable && this.observable.config(newConfig), this.#clientConfig = initConfig(newConfig, this.#clientConfig || {}), this;
  }
  /**
   * Clone the client with a new (partial) configuration.
   *
   * @param newConfig - New client configuration properties, shallowly merged with existing configuration
   */
  withConfig(newConfig) {
    const thisConfig = this.config();
    return new SanityClient(this.#httpRequest, {
      ...thisConfig,
      ...newConfig,
      stega: {
        ...thisConfig.stega || {},
        ...typeof newConfig?.stega == "boolean" ? { enabled: newConfig.stega } : newConfig?.stega || {}
      }
    });
  }
  fetch(query, params, options) {
    return lastValueFrom(
      _fetch(
        this,
        this.#httpRequest,
        this.#clientConfig.stega,
        query,
        params,
        options
      )
    );
  }
  /**
   * Fetch a single document with the given ID.
   *
   * @param id - Document ID to fetch
   * @param options - Request options
   */
  getDocument(id, options) {
    return lastValueFrom(_getDocument(this, this.#httpRequest, id, options));
  }
  /**
   * Fetch multiple documents in one request.
   * Should be used sparingly - performing a query is usually a better option.
   * The order/position of documents is preserved based on the original array of IDs.
   * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
   *
   * @param ids - Document IDs to fetch
   * @param options - Request options
   */
  getDocuments(ids, options) {
    return lastValueFrom(_getDocuments(this, this.#httpRequest, ids, options));
  }
  create(document, options) {
    return lastValueFrom(
      _create(this, this.#httpRequest, document, "create", options)
    );
  }
  createIfNotExists(document, options) {
    return lastValueFrom(
      _createIfNotExists(this, this.#httpRequest, document, options)
    );
  }
  createOrReplace(document, options) {
    return lastValueFrom(
      _createOrReplace(this, this.#httpRequest, document, options)
    );
  }
  delete(selection, options) {
    return lastValueFrom(_delete(this, this.#httpRequest, selection, options));
  }
  mutate(operations, options) {
    return lastValueFrom(_mutate(this, this.#httpRequest, operations, options));
  }
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param selection - Document ID, an array of document IDs, or an object with `query` and optional `params`, defining which document(s) to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(documentId, operations) {
    return new Patch(documentId, operations, this);
  }
  /**
   * Create a new transaction of mutations
   *
   * @param operations - Optional array of mutation operations to initialize the transaction instance with
   */
  transaction(operations) {
    return new Transaction(operations, this);
  }
  /**
   * Perform action operations against the configured dataset
   * Returns a promise that resolves to the transaction result
   *
   * @param operations - Action operation(s) to execute
   * @param options - Action options
   */
  action(operations, options) {
    return lastValueFrom(_action(this, this.#httpRequest, operations, options));
  }
  /**
   * Perform a request against the Sanity API
   * NOTE: Only use this for Sanity API endpoints, not for your own APIs!
   *
   * @param options - Request options
   * @returns Promise resolving to the response body
   */
  request(options) {
    return lastValueFrom(_request(this, this.#httpRequest, options));
  }
  /**
   * Perform an HTTP request a `/data` sub-endpoint
   * NOTE: Considered internal, thus marked as deprecated. Use `request` instead.
   *
   * @deprecated - Use `request()` or your own HTTP library instead
   * @param endpoint - Endpoint to hit (mutate, query etc)
   * @param body - Request body
   * @param options - Request options
   * @internal
   */
  dataRequest(endpoint, body, options) {
    return lastValueFrom(_dataRequest(this, this.#httpRequest, endpoint, body, options));
  }
  /**
   * Get a Sanity API URL for the URI provided
   *
   * @param uri - URI/path to build URL for
   * @param canUseCdn - Whether or not to allow using the API CDN for this route
   */
  getUrl(uri, canUseCdn) {
    return _getUrl(this, uri, canUseCdn);
  }
  /**
   * Get a Sanity API URL for the data operation and path provided
   *
   * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
   * @param path - Path to append after the operation
   */
  getDataUrl(operation, path) {
    return _getDataUrl(this, operation, path);
  }
}
function defineCreateClientExports(envMiddleware2, ClassConstructor) {
  return { requester: defineHttpRequest(envMiddleware2), createClient: (config) => {
    const clientRequester = defineHttpRequest(envMiddleware2);
    return new ClassConstructor(
      (options, requester2) => (requester2 || clientRequester)({
        maxRedirects: 0,
        maxRetries: config.maxRetries,
        retryDelay: config.retryDelay,
        ...options
      }),
      config
    );
  } };
}
function defineDeprecatedCreateClient(createClient2) {
  return function(config) {
    return printNoDefaultExport(), createClient2(config);
  };
}
var envMiddleware = [];
const exp = defineCreateClientExports(envMiddleware, SanityClient), requester = exp.requester, createClient = exp.createClient, deprecatedCreateClient = defineDeprecatedCreateClient(createClient);
export {
  BasePatch,
  BaseTransaction,
  ChannelError,
  ClientError,
  ConnectionFailedError,
  CorsOriginError,
  DisconnectError,
  MessageError,
  MessageParseError,
  ObservablePatch,
  ObservableSanityClient,
  ObservableTransaction,
  Patch,
  SanityClient,
  ServerError,
  Transaction,
  connectEventSource,
  createClient,
  deprecatedCreateClient as default,
  requester,
  adapter as unstable__adapter,
  environment as unstable__environment,
  validateApiPerspective
};
//# sourceMappingURL=index.browser.js.map
