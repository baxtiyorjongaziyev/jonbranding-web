import type {ContentSourceMapDocuments as ContentSourceMapDocuments_2} from '@sanity/client/csm'
import {ContentSourceMapParsedPath} from '@sanity/client/csm'
import {ContentSourceMapParsedPathKeyedSegment} from '@sanity/client/csm'
import {Observable} from 'rxjs'
import {Requester} from 'get-it'
import type {ResolveStudioUrl} from '@sanity/client/csm'
import {StudioBaseRoute} from '@sanity/client/csm'
import {StudioBaseUrl} from '@sanity/client/csm'
import {StudioUrl} from '@sanity/client/csm'
import {adapter as unstable__adapter} from 'get-it'
import {environment as unstable__environment} from 'get-it'

/** @public */
export declare type Action =
  | CreateAction
  | ReplaceDraftAction
  | EditAction
  | DeleteAction
  | DiscardAction
  | PublishAction
  | UnpublishAction

/** @internal */
export declare interface ActionError {
  error: {
    type: 'actionError'
    description: string
    items?: ActionErrorItem[]
  }
}

/** @internal */
export declare interface ActionErrorItem {
  error: {
    type: string
    description: string
    value?: unknown
  }
  index: number
}

/** @internal */
export declare type AllDocumentIdsMutationOptions = BaseMutationOptions & {
  returnFirst: false
  returnDocuments: false
}

/** @internal */
export declare type AllDocumentsMutationOptions = BaseMutationOptions & {
  returnFirst: false
  returnDocuments?: true
}

/**
 * Used to tag types that is set to `any` as a temporary measure, but should be replaced with proper typings in the future
 * @internal
 */
export declare type Any = any

/** @internal */
export declare interface ApiError {
  error: string
  message: string
  statusCode: number
}

/** @public */
export declare type AssetMetadataType =
  | 'location'
  | 'exif'
  | 'image'
  | 'palette'
  | 'lqip'
  | 'blurhash'
  | 'none'

/** @internal */
export declare class AssetsClient {
  #private
  constructor(client: SanityClient, httpRequest: HttpRequest)
  /**
   * Uploads a file asset to the configured dataset
   *
   * @param assetType - Asset type (file)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'file',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Promise<SanityAssetDocument>
  /**
   * Uploads an image asset to the configured dataset
   *
   * @param assetType - Asset type (image)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'image',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Promise<SanityImageAssetDocument>
  /**
   * Uploads a file or an image asset to the configured dataset
   *
   * @param assetType - Asset type (file/image)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'file' | 'image',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Promise<SanityAssetDocument | SanityImageAssetDocument>
}

/** @internal */
export declare type AttributeSet = {
  [key: string]: Any
}

/** @internal */
export declare interface AuthProvider {
  name: string
  title: string
  url: string
}

/** @internal */
export declare type AuthProviderResponse = {
  providers: AuthProvider[]
}

/** @internal */
export declare type BaseActionOptions = RequestOptions & {
  transactionId?: string
  skipCrossDatasetReferenceValidation?: boolean
  dryRun?: boolean
}

/** @internal */
export declare type BaseMutationOptions = RequestOptions & {
  visibility?: 'sync' | 'async' | 'deferred'
  returnDocuments?: boolean
  returnFirst?: boolean
  dryRun?: boolean
  autoGenerateArrayKeys?: boolean
  skipCrossDatasetReferenceValidation?: boolean
  transactionId?: string
}

/** @internal */
export declare class BasePatch {
  protected selection: PatchSelection
  protected operations: PatchOperations
  constructor(selection: PatchSelection, operations?: PatchOperations)
  /**
   * Sets the given attributes to the document. Does NOT merge objects.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
   */
  set(attrs: AttributeSet): this
  /**
   * Sets the given attributes to the document if they are not currently set. Does NOT merge objects.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to set. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "value"\}
   */
  setIfMissing(attrs: AttributeSet): this
  /**
   * Performs a "diff-match-patch" operation on the string attributes provided.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attributes to perform operation on. To set a deep attribute, use JSONMatch, eg: \{"nested.prop": "dmp"\}
   */
  diffMatchPatch(attrs: AttributeSet): this
  /**
   * Unsets the attribute paths provided.
   * The operation is added to the current patch, ready to be commited by `commit()`
   *
   * @param attrs - Attribute paths to unset.
   */
  unset(attrs: string[]): this
  /**
   * Increment a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
   *
   * @param attrs - Object of attribute paths to increment, values representing the number to increment by.
   */
  inc(attrs: {[key: string]: number}): this
  /**
   * Decrement a numeric value. Each entry in the argument is either an attribute or a JSON path. The value may be a positive or negative integer or floating-point value. The operation will fail if target value is not a numeric value, or doesn't exist.
   *
   * @param attrs - Object of attribute paths to decrement, values representing the number to decrement by.
   */
  dec(attrs: {[key: string]: number}): this
  /**
   * Provides methods for modifying arrays, by inserting, appending and replacing elements via a JSONPath expression.
   *
   * @param at - Location to insert at, relative to the given selector, or 'replace' the matched path
   * @param selector - JSONPath expression, eg `comments[-1]` or `blocks[_key=="abc123"]`
   * @param items - Array of items to insert/replace
   */
  insert(at: 'before' | 'after' | 'replace', selector: string, items: Any[]): this
  /**
   * Append the given items to the array at the given JSONPath
   *
   * @param selector - Attribute/path to append to, eg `comments` or `person.hobbies`
   * @param items - Array of items to append to the array
   */
  append(selector: string, items: Any[]): this
  /**
   * Prepend the given items to the array at the given JSONPath
   *
   * @param selector - Attribute/path to prepend to, eg `comments` or `person.hobbies`
   * @param items - Array of items to prepend to the array
   */
  prepend(selector: string, items: Any[]): this
  /**
   * Change the contents of an array by removing existing elements and/or adding new elements.
   *
   * @param selector - Attribute or JSONPath expression for array
   * @param start - Index at which to start changing the array (with origin 0). If greater than the length of the array, actual starting index will be set to the length of the array. If negative, will begin that many elements from the end of the array (with origin -1) and will be set to 0 if absolute value is greater than the length of the array.x
   * @param deleteCount - An integer indicating the number of old array elements to remove.
   * @param items - The elements to add to the array, beginning at the start index. If you don't specify any elements, splice() will only remove elements from the array.
   */
  splice(selector: string, start: number, deleteCount?: number, items?: Any[]): this
  /**
   * Adds a revision clause, preventing the document from being patched if the `_rev` property does not match the given value
   *
   * @param rev - Revision to lock the patch to
   */
  ifRevisionId(rev: string): this
  /**
   * Return a plain JSON representation of the patch
   */
  serialize(): PatchMutationOperation
  /**
   * Return a plain JSON representation of the patch
   */
  toJSON(): PatchMutationOperation
  /**
   * Clears the patch of all operations
   */
  reset(): this
  protected _assign(op: keyof PatchOperations, props: Any, merge?: boolean): this
  protected _set(op: keyof PatchOperations, props: Any): this
}

/** @internal */
export declare class BaseTransaction {
  protected operations: Mutation[]
  protected trxId?: string
  constructor(operations?: Mutation[], transactionId?: string)
  /**
   * Creates a new Sanity document. If `_id` is provided and already exists, the mutation will fail. If no `_id` is given, one will automatically be generated by the database.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create. Requires a `_type` property.
   */
  create<R extends Record<string, Any> = Record<string, Any>>(doc: SanityDocumentStub<R>): this
  /**
   * Creates a new Sanity document. If a document with the same `_id` already exists, the create operation will be ignored.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create if it does not already exist. Requires `_id` and `_type` properties.
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    doc: IdentifiedSanityDocumentStub<R>,
  ): this
  /**
   * Creates a new Sanity document, or replaces an existing one if the same `_id` is already used.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param doc - Document to create or replace. Requires `_id` and `_type` properties.
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    doc: IdentifiedSanityDocumentStub<R>,
  ): this
  /**
   * Deletes the document with the given document ID
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param documentId - Document ID to delete
   */
  delete(documentId: string): this
  /**
   * Gets the current transaction ID, if any
   */
  transactionId(): string | undefined
  /**
   * Set the ID of this transaction.
   *
   * @param id - Transaction ID
   */
  transactionId(id: string): this
  /**
   * Return a plain JSON representation of the transaction
   */
  serialize(): Mutation[]
  /**
   * Return a plain JSON representation of the transaction
   */
  toJSON(): Mutation[]
  /**
   * Clears the transaction of all operations
   */
  reset(): this
  protected _add(mut: Mutation): this
}

/**
 * @public
 * The server sent a `channelError` message. Usually indicative of a bad or malformed request
 */
export declare class ChannelError extends Error {
  readonly name = 'ChannelError'
  readonly data?: unknown
  constructor(message: string, data: unknown)
}

/**
 * An error occurred. This is different from a network-level error (which will be emitted as 'error').
 * Possible causes are things such as malformed filters, non-existant datasets or similar.
 *
 * @public
 */
export declare type ChannelErrorEvent = {
  type: 'channelError'
  message: string
}

/** @public */
export declare interface ClientConfig {
  projectId?: string
  dataset?: string
  /** @defaultValue true */
  useCdn?: boolean
  token?: string
  /** @internal */
  '~experimental_resource'?: ClientConfigResource
  /**
   * What perspective to use for the client. See {@link https://www.sanity.io/docs/perspectives|perspective documentation}
   * @remarks
   * As of API version `v2025-02-19`, the default perspective has changed from `raw` to `published`. {@link https://www.sanity.io/changelog/676aaa9d-2da6-44fb-abe5-580f28047c10|Changelog}
   * @defaultValue 'published'
   */
  perspective?: ClientPerspective
  apiHost?: string
  /**
     @remarks
     * As of API version `v2025-02-19`, the default perspective has changed from `raw` to `published`. {@link https://www.sanity.io/changelog/676aaa9d-2da6-44fb-abe5-580f28047c10|Changelog}
     */
  apiVersion?: string
  proxy?: string
  /**
   * Optional request tag prefix for all request tags
   */
  requestTagPrefix?: string
  ignoreBrowserTokenWarning?: boolean
  withCredentials?: boolean
  allowReconfigure?: boolean
  timeout?: number
  /** Number of retries for requests. Defaults to 5. */
  maxRetries?: number
  /**
   * The amount of time, in milliseconds, to wait before retrying, given an attemptNumber (starting at 0).
   *
   * Defaults to exponential back-off, starting at 100ms, doubling for each attempt, together with random
   * jitter between 0 and 100 milliseconds. More specifically the following algorithm is used:
   *
   *   Delay = 100 * 2^attemptNumber + randomNumberBetween0and100
   */
  retryDelay?: (attemptNumber: number) => number
  /**
   * @deprecated Don't use
   */
  useProjectHostname?: boolean
  /**
   * @deprecated Don't use
   */
  requester?: Requester
  /**
   * Adds a `resultSourceMap` key to the API response, with the type `ContentSourceMap`
   */
  resultSourceMap?: boolean | 'withKeyArraySelector'
  /**
   *@deprecated set `cache` and `next` options on `client.fetch` instead
   */
  fetch?:
    | {
        cache?: ResponseQueryOptions['cache']
        next?: ResponseQueryOptions['next']
      }
    | boolean
  /**
   * Options for how, if enabled, Content Source Maps are encoded into query results using steganography
   */
  stega?: StegaConfig | boolean
}

declare type ClientConfigResource =
  | {
      type: 'canvas'
      id: string
    }
  | {
      type: 'media-library'
      id: string
    }
  | {
      type: 'dataset'
      id: string
    }
  | {
      type: 'dashboard'
      id: string
    }

/** @public */
export declare class ClientError extends Error {
  response: ErrorProps['response']
  statusCode: ErrorProps['statusCode']
  responseBody: ErrorProps['responseBody']
  details: ErrorProps['details']
  constructor(res: Any)
}

/** @public */
export declare type ClientPerspective =
  | DeprecatedPreviewDrafts
  | 'published'
  | 'drafts'
  | 'raw'
  | StackablePerspective[]

/** @public */
export declare type ClientReturn<
  GroqString extends string,
  Fallback = Any,
> = GroqString extends keyof SanityQueries ? SanityQueries[GroqString] : Fallback

/**
 * Sanity API specific EventSource handler shared between the listen and live APIs
 *
 * Since the `EventSource` API is not provided by all environments, this function enables custom initialization of the EventSource instance
 * for runtimes that requires polyfilling or custom setup logic (e.g. custom HTTP headers)
 * via the passed `initEventSource` function which must return an EventSource instance.
 *
 * Possible errors to be thrown on the returned observable are:
 * - {@link MessageError}
 * - {@link MessageParseError}
 * - {@link ChannelError}
 * - {@link DisconnectError}
 * - {@link ConnectionFailedError}
 *
 * @param initEventSource - A function that returns an EventSource instance or an Observable that resolves to an EventSource instance
 * @param events - an array of named events from the API to listen for.
 *
 * @internal
 */
export declare function connectEventSource<EventName extends string>(
  initEventSource: () => EventSourceInstance | Observable<EventSourceInstance>,
  events: EventName[],
): Observable<ServerSentEvent<EventName>>

/**
 * @public
 * Thrown if the EventSource connection could not be established.
 * Note that ConnectionFailedErrors are rare, and disconnects will normally be handled by the EventSource instance itself and emitted as `reconnect` events.
 */
export declare class ConnectionFailedError extends Error {
  readonly name = 'ConnectionFailedError'
}

/** @public */
export declare interface ContentSourceMap {
  mappings: ContentSourceMapMappings
  documents: ContentSourceMapDocuments
  paths: ContentSourceMapPaths
}

/** @public */
export declare interface ContentSourceMapDocument extends ContentSourceMapDocumentBase {
  _projectId?: undefined
  _dataset?: undefined
}

/** @public */
export declare interface ContentSourceMapDocumentBase {
  _id: string
  _type: string
}

/** @public */
export declare type ContentSourceMapDocuments = (
  | ContentSourceMapDocument
  | ContentSourceMapRemoteDocument
)[]

/**
 * DocumentValueSource is a path to a value within a document
 * @public
 */
export declare interface ContentSourceMapDocumentValueSource {
  type: 'documentValue'
  document: number
  path: number
}

/**
 * When a value is not from a source, its a literal
 * @public
 */
export declare interface ContentSourceMapLiteralSource {
  type: 'literal'
}

/** @public */
export declare type ContentSourceMapMapping = ContentSourceMapValueMapping

/** @public */
export declare type ContentSourceMapMappings = Record<string, ContentSourceMapMapping>

export {ContentSourceMapParsedPath}

export {ContentSourceMapParsedPathKeyedSegment}

/** @public */
export declare type ContentSourceMapPaths = string[]

/** @public */
export declare interface ContentSourceMapRemoteDocument extends ContentSourceMapDocumentBase {
  _projectId: string
  _dataset: string
}

/** @public */
export declare type ContentSourceMapSource =
  | ContentSourceMapDocumentValueSource
  | ContentSourceMapLiteralSource
  | ContentSourceMapUnknownSource

/**
 * When a field source is unknown
 * @public
 */
export declare interface ContentSourceMapUnknownSource {
  type: 'unknown'
}

/**
 * ValueMapping is a mapping when for value that is from a single source value
 * It may refer to a field within a document or a literal value
 * @public
 */
export declare interface ContentSourceMapValueMapping {
  type: 'value'
  source: ContentSourceMapSource
}

/** @public */
export declare class CorsOriginError extends Error {
  projectId: string
  addOriginUrl?: URL
  constructor({projectId}: {projectId: string})
}

/**
 * Creates a new draft document. The published version of the document must not already exist.
 * If the draft version of the document already exists the action will fail by default, but
 * this can be adjusted to instead leave the existing document in place.
 *
 * @public
 */
export declare type CreateAction = {
  actionType: 'sanity.action.document.create'
  /**
   * ID of the published document to create a draft for.
   */
  publishedId: string
  /**
   * Document to create. Requires a `_type` property.
   */
  attributes: IdentifiedSanityDocumentStub
  /**
   * ifExists controls what to do if the draft already exists
   */
  ifExists: 'fail' | 'ignore'
}

/**
 * @remarks
 * As of API version `v2025-02-19`, the default perspective used by the client has changed from `raw` to `published`. {@link https://www.sanity.io/changelog/676aaa9d-2da6-44fb-abe5-580f28047c10|Changelog}
 * @public
 */
export declare const createClient: (config: ClientConfig) => SanityClient

/** @public */
export declare interface CurrentSanityUser {
  id: string
  name: string
  email: string
  profileImage: string | null
  role: string
}

/** @public */
export declare type DatasetAclMode = 'public' | 'private' | 'custom'

/** @public */
export declare type DatasetResponse = {
  datasetName: string
  aclMode: DatasetAclMode
}

/** @internal */
export declare class DatasetsClient {
  #private
  constructor(client: SanityClient, httpRequest: HttpRequest)
  /**
   * Create a new dataset with the given name
   *
   * @param name - Name of the dataset to create
   * @param options - Options for the dataset
   */
  create(
    name: string,
    options?: {
      aclMode?: DatasetAclMode
    },
  ): Promise<DatasetResponse>
  /**
   * Edit a dataset with the given name
   *
   * @param name - Name of the dataset to edit
   * @param options - New options for the dataset
   */
  edit(
    name: string,
    options?: {
      aclMode?: DatasetAclMode
    },
  ): Promise<DatasetResponse>
  /**
   * Delete a dataset with the given name
   *
   * @param name - Name of the dataset to delete
   */
  delete(name: string): Promise<{
    deleted: true
  }>
  /**
   * Fetch a list of datasets for the configured project
   */
  list(): Promise<DatasetsResponse>
}

/** @public */
export declare type DatasetsResponse = {
  name: string
  aclMode: DatasetAclMode
  createdAt: string
  createdByUserId: string
  addonFor: string | null
  datasetProfile: string
  features: string[]
  tags: string[]
}[]

/**
 * Deletes the published version of a document and optionally some (likely all known) draft versions.
 * If any draft version exists that is not specified for deletion this is an error.
 * If the purge flag is set then the document history is also deleted.
 *
 * @public
 */
export declare type DeleteAction = {
  actionType: 'sanity.action.document.delete'
  /**
   * Published document ID to delete
   */
  publishedId: string
  /**
   * Draft document ID to delete
   */
  includeDrafts: string[]
  /**
   * Delete document history
   */
  purge?: boolean
}

/**
 * @public
 * @deprecated Use the named export `createClient` instead of the `default` export
 */
declare const deprecatedCreateClient: (config: ClientConfig) => SanityClient
export default deprecatedCreateClient

/**
 * @deprecated use 'drafts' instead
 */
declare type DeprecatedPreviewDrafts = 'previewDrafts'

/**
 * Delete the draft version of a document.
 * It is an error if it does not exist. If the purge flag is set, the document history is also deleted.
 *
 * @public
 */
export declare type DiscardAction = {
  actionType: 'sanity.action.document.discard'
  /**
   * Draft document ID to delete
   */
  draftId: string
  /**
   * Delete document history
   */
  purge?: boolean
}

/**
 * The listener has been told to explicitly disconnect.
 *  This is a rare situation, but may occur if the API knows reconnect attempts will fail,
 *  eg in the case of a deleted dataset, a blocked project or similar events.
 * @public
 */
export declare class DisconnectError extends Error {
  readonly name = 'DisconnectError'
  readonly reason?: string
  constructor(message: string, reason?: string, options?: ErrorOptions)
}

/**
 * The listener has been told to explicitly disconnect and not reconnect.
 * This is a rare situation, but may occur if the API knows reconnect attempts will fail,
 * eg in the case of a deleted dataset, a blocked project or similar events.
 *
 * Note that this is not treated as an error on the observable, but will complete the observable.
 *
 * @public
 */
export declare type DisconnectEvent = {
  type: 'disconnect'
  reason: string
}

/**
 * Modifies an existing draft document.
 * It applies the given patch to the document referenced by draftId.
 * If there is no such document then one is created using the current state of the published version and then that is updated accordingly.
 *
 * @public
 */
export declare type EditAction = {
  actionType: 'sanity.action.document.edit'
  /**
   * Draft document ID to edit
   */
  draftId: string
  /**
   * Published document ID to create draft from, if draft does not exist
   */
  publishedId: string
  /**
   * Patch operations to apply
   */
  patch: PatchOperations
}

/** @public */
export declare interface ErrorProps {
  message: string
  response: Any
  statusCode: number
  responseBody: Any
  details: Any
}

/**
 * @internal
 */
export declare type EventSourceEvent<Name extends string> = ServerSentEvent<Name>

/**
 * @internal
 */
export declare type EventSourceInstance = InstanceType<typeof globalThis.EventSource>

/** @public */
export declare type FilterDefault = (props: {
  /**
   * The path to the value in the source document, for example if you queried for a document like this:
   * `*[_type == "author"][0]{"slug": slug.current}`
   * Then the `sourcePath` for `result.slug` would be `['slug', 'current']`.
   *
   */
  sourcePath: ContentSourceMapParsedPath
  /**
   * If `sourcePath` alone isn't enough to tell you if it's safe to contain stega strings, then you can use `sourceDocument`
   * for additional metadata.
   * It'll always have a `_type` property, which can be used to trace it to the Studio Schema that were used initially.
   * It also has `_id` to help you debug and look at the whole document when troubleshooting.
   * Finally, if the document origins in a Cross Dataset Reference you'll also have `_projectId` and `_dataset` properties to help you trace it.
   */
  sourceDocument: ContentSourceMapDocuments_2[number]
  /**
   * If you don't colocate your Studio Schemas with your GROQ queries it might be hard to make sense of `sourcePath`,
   * as it operates on the original shape of a document.
   * In that case `resultPath` can be used, as it mirrors the path to the value in the result.
   * For example in a query like this:
   * `*[_type == "author"][0]{"slug": slug.current}`
   * The `resultPath` for `result.slug` would be `['slug']`, while `sourcePath` will be `['slug', 'current']`.
   */
  resultPath: ContentSourceMapParsedPath
  /**
   * You can also use your own string validation logic to determine if it's safe.
   */
  value: string
  /**
     * If you want to keep the default filtering behavior, but only override it for a specific path, you can use `filterDefault` to do that.
     * For example, here all "icon" documents in a Page Builder skips encoding:
     * ```ts
     {
     filter: (props) => {
     switch (props.sourceDocument._type) {
     case 'icon':
     return false
     default:
     return props.filterDefault(props)
     }
     }
     }
     * ```
     */
  filterDefault: FilterDefault
}) => boolean

/** @public */
export declare interface FilteredResponseQueryOptions extends ResponseQueryOptions {
  filterResponse?: true
}

/** @internal */
export declare type FirstDocumentIdMutationOptions = BaseMutationOptions & {
  returnFirst?: true
  returnDocuments: false
}

/** @internal */
export declare type FirstDocumentMutationOptions = BaseMutationOptions & {
  returnFirst?: true
  returnDocuments?: true
}

/** @public */
export declare type HttpRequest = {
  (options: RequestOptions, requester: Requester): ReturnType<Requester>
}

/** @public */
export declare type HttpRequestEvent<T = unknown> = ResponseEvent<T> | ProgressEvent_2

/** @public */
export declare type IdentifiedSanityDocumentStub<
  T extends Record<string, Any> = Record<string, Any>,
> = {
  [P in keyof T]: T[P]
} & {
  _id: string
} & SanityDocumentStub

/** @public */
export declare interface InitializedClientConfig extends ClientConfig {
  apiHost: string
  apiVersion: string
  useProjectHostname: boolean
  useCdn: boolean
  /**
   * @deprecated Internal, don't use
   */
  isDefaultApi: boolean
  /**
   * @deprecated Internal, don't use
   */
  url: string
  /**
   * @deprecated Internal, don't use
   */
  cdnUrl: string
  /**
   * The fully initialized stega config, can be used to check if stega is enabled
   */
  stega: InitializedStegaConfig
}

/** @public */
export declare type InitializedStegaConfig = Omit<StegaConfig, StegaConfigRequiredKeys> &
  Required<Pick<StegaConfig, StegaConfigRequiredKeys>>

/** @internal */
export declare type InsertPatch =
  | {
      before: string
      items: Any[]
    }
  | {
      after: string
      items: Any[]
    }
  | {
      replace: string
      items: Any[]
    }

/**
 * Set up a listener that will be notified when mutations occur on documents matching the provided query/filter.
 *
 * @param query - GROQ-filter to listen to changes for
 * @param params - Optional query parameters
 * @param options - Optional listener options
 * @public
 */
export declare function _listen<R extends Record<string, Any> = Record<string, Any>>(
  this: SanityClient | ObservableSanityClient,
  query: string,
  params?: ListenParams,
): Observable<MutationEvent<R>>

/**
 * Set up a listener that will be notified when mutations occur on documents matching the provided query/filter.
 *
 * @param query - GROQ-filter to listen to changes for
 * @param params - Optional query parameters
 * @param options - Optional listener options
 * @public
 */
export declare function _listen<R extends Record<string, Any> = Record<string, Any>>(
  this: SanityClient | ObservableSanityClient,
  query: string,
  params?: ListenParams,
  options?: ListenOptions,
): Observable<ListenEvent<R>>

/** @public */
export declare type ListenEvent<R extends Record<string, Any>> =
  | MutationEvent<R>
  | ChannelErrorEvent
  | DisconnectEvent
  | ReconnectEvent
  | WelcomeEvent
  | OpenEvent

/** @public */
export declare type ListenEventName =
  /** A mutation was performed */
  | 'mutation'
  /** The listener has been (re)established */
  | 'welcome'
  /** The listener has been disconnected, and a reconnect attempt is scheduled */
  | 'reconnect'

/** @public */
export declare interface ListenOptions {
  /**
   * Whether or not to include the resulting document in addition to the mutations performed.
   * If you do not need the actual document, set this to `false` to reduce bandwidth usage.
   * The result will be available on the `.result` property of the events.
   * @defaultValue `true`
   */
  includeResult?: boolean
  /**
   * Whether or not to include the mutations that was performed.
   * If you do not need the mutations, set this to `false` to reduce bandwidth usage.
   * @defaultValue `true`
   */
  includeMutations?: boolean
  /**
   * Whether or not to include the document as it looked before the mutation event.
   * The previous revision will be available on the `.previous` property of the events,
   * and may be `null` in the case of a new document.
   * @defaultValue `false`
   */
  includePreviousRevision?: boolean
  /**
   * Whether to include events for drafts and versions. As of API Version >= v2025-02-19, only events
   * for published documents will be included by default (see {@link https://www.sanity.io/changelog/676aaa9d-2da6-44fb-abe5-580f28047c10|Changelog})
   * If you need events from drafts and versions, set this to `true`.
   * Note: Keep in mind that additional document variants may be introduced in the future, so it's
   * recommended to respond to events in a way that's tolerant of potential future variants, e.g. by
   * explicitly checking whether the event is for a draft or a version.
   * @defaultValue `false`
   */
  includeAllVersions?: boolean
  /**
   * Whether events should be sent as soon as a transaction has been committed (`transaction`, default),
   * or only after they are available for queries (query). Note that this is on a best-effort basis,
   * and listeners with `query` may in certain cases (notably with deferred transactions) receive events
   * that are not yet visible to queries.
   *
   * @defaultValue `'transaction'`
   */
  visibility?: 'transaction' | 'query'
  /**
   * Array of event names to include in the observable. By default, only mutation events are included.
   *
   * @defaultValue `['mutation']`
   */
  events?: ListenEventName[]
  /**
   * Format of "effects", eg the resulting changes of a mutation.
   * Currently only `mendoza` is supported, and (if set) will include `apply` and `revert` arrays
   * in the mutation events under the `effects` property.
   *
   * See {@link https://github.com/sanity-io/mendoza | The mendoza docs} for more info
   *
   * @defaultValue `undefined`
   */
  effectFormat?: 'mendoza'
  /**
   * Optional request tag for the listener. Use to identify the request in logs.
   *
   * @defaultValue `undefined`
   */
  tag?: string
}

/** @public */
export declare type ListenParams = {
  [key: string]: Any
}

/**
 * @public
 */
export declare class LiveClient {
  #private
  constructor(client: SanityClient | ObservableSanityClient)
  /**
   * Requires `apiVersion` to be `2021-03-25` or later.
   */
  events({
    includeDrafts,
    tag: _tag,
  }?: {
    includeDrafts?: boolean
    /**
     * Optional request tag for the listener. Use to identify the request in logs.
     *
     * @defaultValue `undefined`
     */
    tag?: string
  }): Observable<LiveEvent>
}

/** @public */
export declare type LiveEvent =
  | LiveEventRestart
  | LiveEventReconnect
  | LiveEventMessage
  | LiveEventWelcome
  | LiveEventGoAway

/**
 * The `id` field is the position at which the connection was rejected or closed.
 * The `reason` field will specify why the connection rejected/closed.
 * @public
 */
export declare interface LiveEventGoAway {
  type: 'goaway'
  id: string
  reason: string
}

/** @public */
export declare interface LiveEventMessage {
  type: 'message'
  id: string
  tags: SyncTag[]
}

/** @public */
export declare interface LiveEventReconnect {
  type: 'reconnect'
}

/** @public */
export declare interface LiveEventRestart {
  type: 'restart'
  id: string
}

/** @public */
export declare interface LiveEventWelcome {
  type: 'welcome'
}

/** @public */
export declare type Logger =
  | typeof console
  | Partial<
      Pick<typeof console, 'debug' | 'error' | 'groupCollapsed' | 'groupEnd' | 'log' | 'table'>
    >

/**
 * @public
 * The server sent an `error`-event to tell the client that an unexpected error has happened.
 */
export declare class MessageError extends Error {
  readonly name = 'MessageError'
  readonly data?: unknown
  constructor(message: string, data: unknown, options?: ErrorOptions)
}

/**
 * @public
 * An error occurred while parsing the message sent by the server as JSON. Should normally not happen.
 */
export declare class MessageParseError extends Error {
  readonly name = 'MessageParseError'
}

/** @internal */
export declare interface MultipleActionResult {
  transactionId: string
}

/** @internal */
export declare interface MultipleMutationResult {
  transactionId: string
  documentIds: string[]
  results: {
    id: string
    operation: MutationOperation
  }[]
}

/** @public */
export declare type Mutation<R extends Record<string, Any> = Record<string, Any>> =
  | {
      create: SanityDocumentStub<R>
    }
  | {
      createOrReplace: IdentifiedSanityDocumentStub<R>
    }
  | {
      createIfNotExists: IdentifiedSanityDocumentStub<R>
    }
  | {
      delete: MutationSelection
    }
  | {
      patch: PatchMutationOperation
    }

/** @internal */
export declare interface MutationError {
  error: {
    type: 'mutationError'
    description: string
    items?: MutationErrorItem[]
  }
}

/** @internal */
export declare interface MutationErrorItem {
  error: {
    type: string
    description: string
    value?: unknown
  }
}

/**
 * A mutation was performed. Note that when updating multiple documents in a transaction,
 * each document affected will get a separate mutation event.
 *
 * @public
 */
export declare type MutationEvent<R extends Record<string, Any> = Record<string, Any>> = {
  type: 'mutation'
  /**
   * The ID of the document that was affected
   */
  documentId: string
  /**
   * A unique ID for this event
   */
  eventId: string
  /**
   * The user ID of the user that performed the mutation
   */
  identity: string
  /**
   * An array of mutations that were performed. Note that this can differ slightly from the
   * mutations sent to the server, as the server may perform some mutations automatically.
   */
  mutations: Mutation[]
  /**
   * The revision ID of the document before the mutation was performed
   */
  previousRev?: string
  /**
   * The revision ID of the document after the mutation was performed
   */
  resultRev?: string
  /**
   * The document as it looked after the mutation was performed. This is only included if
   * the listener was configured with `includeResult: true`.
   */
  result?: SanityDocument<R>
  /**
   * The document as it looked before the mutation was performed. This is only included if
   * the listener was configured with `includePreviousRevision: true`.
   */
  previous?: SanityDocument<R> | null
  /**
   * The effects of the mutation, if the listener was configured with `effectFormat: 'mendoza'`.
   * Object with `apply` and `revert` arrays, see {@link https://github.com/sanity-io/mendoza}.
   */
  effects?: {
    apply: unknown[]
    revert: unknown[]
  }
  /**
   * A timestamp for when the mutation was performed
   */
  timestamp: string
  /**
   * The transaction ID for the mutation
   */
  transactionId: string
  /**
   * The type of transition the document went through.
   *
   * - `update` means the document was previously part of the subscribed set of documents,
   *   and still is.
   * - `appear` means the document was not previously part of the subscribed set of documents,
   *   but is now. This can happen both on create or if updating to a state where it now matches
   *   the filter provided to the listener.
   * - `disappear` means the document was previously part of the subscribed set of documents,
   *   but is no longer. This can happen both on delete or if updating to a state where it no
   *   longer matches the filter provided to the listener.
   */
  transition: 'update' | 'appear' | 'disappear'
  /**
   * Whether the change that triggered this event is visible to queries (query) or only to
   * subsequent transactions (transaction). The listener client can specify a preferred visibility
   * through the `visibility` parameter on the listener, but this is only on a best-effort basis,
   * and may yet not be accurate.
   */
  visibility: 'query' | 'transaction'
  /**
   * The total number of events that will be sent for this transaction.
   * Note that this may differ from the amount of _documents_ affected by the transaction, as this
   * number only includes the documents that matches the given filter.
   *
   * This can be useful if you need to perform changes to all matched documents atomically,
   * eg you would wait for `transactionTotalEvents` events with the same `transactionId` before
   * applying the changes locally.
   */
  transactionTotalEvents: number
  /**
   * The index of this event within the transaction. Note that events may be delivered out of order,
   * and that the index is zero-based.
   */
  transactionCurrentEvent: number
}

/** @internal */
export declare type MutationOperation = 'create' | 'delete' | 'update' | 'none'

/** @internal */
export declare type MutationSelection =
  | {
      query: string
      params?: MutationSelectionQueryParams
    }
  | {
      id: string | string[]
    }

/** @internal */
export declare type MutationSelectionQueryParams = {
  [key: string]: Any
}

/** @internal */
export declare class ObservableAssetsClient {
  #private
  constructor(client: ObservableSanityClient, httpRequest: HttpRequest)
  /**
   * Uploads a file asset to the configured dataset
   *
   * @param assetType - Asset type (file)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'file',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Observable<
    HttpRequestEvent<{
      document: SanityAssetDocument
    }>
  >
  /**
   * Uploads an image asset to the configured dataset
   *
   * @param assetType - Asset type (image)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'image',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Observable<
    HttpRequestEvent<{
      document: SanityImageAssetDocument
    }>
  >
  /**
   * Uploads a file or an image asset to the configured dataset
   *
   * @param assetType - Asset type (file/image)
   * @param body - Asset content - can be a browser File instance, a Blob, a Node.js Buffer instance or a Node.js ReadableStream.
   * @param options - Options to use for the upload
   */
  upload(
    assetType: 'file' | 'image',
    body: UploadBody,
    options?: UploadClientConfig,
  ): Observable<
    HttpRequestEvent<{
      document: SanityAssetDocument | SanityImageAssetDocument
    }>
  >
}

/** @internal */
export declare class ObservableDatasetsClient {
  #private
  constructor(client: ObservableSanityClient, httpRequest: HttpRequest)
  /**
   * Create a new dataset with the given name
   *
   * @param name - Name of the dataset to create
   * @param options - Options for the dataset
   */
  create(
    name: string,
    options?: {
      aclMode?: DatasetAclMode
    },
  ): Observable<DatasetResponse>
  /**
   * Edit a dataset with the given name
   *
   * @param name - Name of the dataset to edit
   * @param options - New options for the dataset
   */
  edit(
    name: string,
    options?: {
      aclMode?: DatasetAclMode
    },
  ): Observable<DatasetResponse>
  /**
   * Delete a dataset with the given name
   *
   * @param name - Name of the dataset to delete
   */
  delete(name: string): Observable<{
    deleted: true
  }>
  /**
   * Fetch a list of datasets for the configured project
   */
  list(): Observable<DatasetsResponse>
}

/** @public */
export declare class ObservablePatch extends BasePatch {
  #private
  constructor(
    selection: PatchSelection,
    operations?: PatchOperations,
    client?: ObservableSanityClient,
  )
  /**
   * Clones the patch
   */
  clone(): ObservablePatch
  /**
   * Commit the patch, returning an observable that produces the first patched document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Commit the patch, returning an observable that produces an array of the mutated documents
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Commit the patch, returning an observable that produces a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: FirstDocumentIdMutationOptions): Observable<SingleMutationResult>
  /**
   * Commit the patch, returning an observable that produces a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: AllDocumentIdsMutationOptions): Observable<MultipleMutationResult>
  /**
   * Commit the patch, returning an observable that produces the first patched document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
}

/** @public */
export declare type ObservablePatchBuilder = (patch: ObservablePatch) => ObservablePatch

/** @internal */
export declare class ObservableProjectsClient {
  #private
  constructor(client: ObservableSanityClient, httpRequest: HttpRequest)
  /**
   * Fetch a list of projects the authenticated user has access to.
   *
   * @param options - Options for the list request
   * @param options.includeMembers - Whether to include members in the response (default: true)
   */
  list(options?: {includeMembers?: true}): Observable<SanityProject[]>
  list(options?: {includeMembers?: false}): Observable<Omit<SanityProject, 'members'>[]>
  /**
   * Fetch a project by project ID
   *
   * @param projectId - ID of the project to fetch
   */
  getById(projectId: string): Observable<SanityProject>
}

/** @public */
export declare class ObservableSanityClient {
  #private
  assets: ObservableAssetsClient
  datasets: ObservableDatasetsClient
  live: LiveClient
  projects: ObservableProjectsClient
  users: ObservableUsersClient
  /**
   * Instance properties
   */
  listen: typeof _listen
  constructor(httpRequest: HttpRequest, config?: ClientConfig)
  /**
   * Clone the client - returns a new instance
   */
  clone(): ObservableSanityClient
  /**
   * Returns the current client configuration
   */
  config(): InitializedClientConfig
  /**
   * Reconfigure the client. Note that this _mutates_ the current client.
   */
  config(newConfig?: Partial<ClientConfig>): this
  /**
   * Clone the client with a new (partial) configuration.
   *
   * @param newConfig - New client configuration properties, shallowly merged with existing configuration
   */
  withConfig(newConfig?: Partial<ClientConfig>): ObservableSanityClient
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams = QueryWithoutParams,
    const G extends string = string,
  >(query: G, params?: Q | QueryWithoutParams): Observable<ClientReturn<G, R>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Optional request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: G,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options?: FilteredResponseQueryOptions,
  ): Observable<ClientReturn<G, R>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: string,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options: UnfilteredResponseQueryOptions,
  ): Observable<RawQueryResponse<ClientReturn<G, R>>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: G,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options: UnfilteredResponseWithoutQuery,
  ): Observable<RawQuerylessQueryResponse<ClientReturn<G, R>>>
  /**
   * Fetch a single document with the given ID.
   *
   * @param id - Document ID to fetch
   * @param options - Request options
   */
  getDocument<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options?: {
      tag?: string
    },
  ): Observable<SanityDocument<R> | undefined>
  /**
   * Fetch multiple documents in one request.
   * Should be used sparingly - performing a query is usually a better option.
   * The order/position of documents is preserved based on the original array of IDs.
   * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
   *
   * @param ids - Document IDs to fetch
   * @param options - Request options
   */
  getDocuments<R extends Record<string, Any> = Record<string, Any>>(
    ids: string[],
    options?: {
      tag?: string
    },
  ): Observable<(SanityDocument<R> | null)[]>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns an observable that resolves to an array containing the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns an observable that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Observable<SingleMutationResult>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns an observable that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Observable<MultipleMutationResult>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns an observable that resolves to an array containing the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns an observable that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Observable<SingleMutationResult>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns an observable that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Observable<MultipleMutationResult>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns an observable that resolves to an array containing the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns an observable that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Observable<SingleMutationResult>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns an observable that resolves to a mutation result object containing the created document ID.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Observable<MultipleMutationResult>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns an observable that resolves to the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Deletes a document with the given document ID.
   * Returns an observable that resolves to the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Deletes a document with the given document ID.
   * Returns an observable that resolves to an array containing the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Deletes a document with the given document ID.
   * Returns an observable that resolves to a mutation result object containing the deleted document ID.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete(id: string, options: FirstDocumentIdMutationOptions): Observable<SingleMutationResult>
  /**
   * Deletes a document with the given document ID.
   * Returns an observable that resolves to a mutation result object containing the deleted document ID.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete(id: string, options: AllDocumentIdsMutationOptions): Observable<MultipleMutationResult>
  /**
   * Deletes a document with the given document ID.
   * Returns an observable that resolves to the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns an observable that resolves to first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns an observable that resolves to an array containing the deleted documents.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns an observable that resolves to a mutation result object containing the ID of the first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete(
    selection: MutationSelection,
    options: FirstDocumentIdMutationOptions,
  ): Observable<SingleMutationResult>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns an observable that resolves to a mutation result object containing the document IDs that were deleted.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete(
    selection: MutationSelection,
    options: AllDocumentIdsMutationOptions,
  ): Observable<MultipleMutationResult>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns an observable that resolves to first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Perform mutation operations against the configured dataset
   * Returns an observable that resolves to the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | ObservablePatch | ObservableTransaction,
    options: FirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Perform mutation operations against the configured dataset.
   * Returns an observable that resolves to an array of the mutated documents.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | ObservablePatch | ObservableTransaction,
    options: AllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Perform mutation operations against the configured dataset
   * Returns an observable that resolves to a mutation result object containing the document ID of the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | ObservablePatch | ObservableTransaction,
    options: FirstDocumentIdMutationOptions,
  ): Observable<SingleMutationResult>
  /**
   * Perform mutation operations against the configured dataset
   * Returns an observable that resolves to a mutation result object containing the mutated document IDs.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | ObservablePatch | ObservableTransaction,
    options: AllDocumentIdsMutationOptions,
  ): Observable<MultipleMutationResult>
  /**
   * Perform mutation operations against the configured dataset
   * Returns an observable that resolves to the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | ObservablePatch | ObservableTransaction,
    options?: BaseMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param documentId - Document ID to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(documentId: string, operations?: PatchOperations): ObservablePatch
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param documentIds - Array of document IDs to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(documentIds: string[], operations?: PatchOperations): ObservablePatch
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param selection - An object with `query` and optional `params`, defining which document(s) to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(selection: MutationSelection, operations?: PatchOperations): ObservablePatch
  /**
   * Create a new transaction of mutations
   *
   * @param operations - Optional array of mutation operations to initialize the transaction instance with
   */
  transaction<R extends Record<string, Any> = Record<string, Any>>(
    operations?: Mutation<R>[],
  ): ObservableTransaction
  /**
   * Perform action operations against the configured dataset
   *
   * @param operations - Action operation(s) to execute
   * @param options - Action options
   */
  action(
    operations: Action | Action[],
    options?: BaseActionOptions,
  ): Observable<SingleActionResult | MultipleActionResult>
  /**
   * Perform an HTTP request against the Sanity API
   *
   * @param options - Request options
   */
  request<R = Any>(options: RawRequestOptions): Observable<R>
  /**
   * Get a Sanity API URL for the URI provided
   *
   * @param uri - URI/path to build URL for
   * @param canUseCdn - Whether or not to allow using the API CDN for this route
   */
  getUrl(uri: string, canUseCdn?: boolean): string
  /**
   * Get a Sanity API URL for the data operation and path provided
   *
   * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
   * @param path - Path to append after the operation
   */
  getDataUrl(operation: string, path?: string): string
}

/** @public */
export declare class ObservableTransaction extends BaseTransaction {
  #private
  constructor(operations?: Mutation[], client?: ObservableSanityClient, transactionId?: string)
  /**
   * Clones the transaction
   */
  clone(): ObservableTransaction
  /**
   * Commit the transaction, returning an observable that produces the first mutated document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any>>(
    options: TransactionFirstDocumentMutationOptions,
  ): Observable<SanityDocument<R>>
  /**
   * Commit the transaction, returning an observable that produces an array of the mutated documents
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any>>(
    options: TransactionAllDocumentsMutationOptions,
  ): Observable<SanityDocument<R>[]>
  /**
   * Commit the transaction, returning an observable that produces a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: TransactionFirstDocumentIdMutationOptions): Observable<SingleMutationResult>
  /**
   * Commit the transaction, returning an observable that produces a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: TransactionAllDocumentIdsMutationOptions): Observable<MultipleMutationResult>
  /**
   * Commit the transaction, returning an observable that produces a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options?: BaseMutationOptions): Observable<MultipleMutationResult>
  /**
   * Performs a patch on the given document ID. Can either be a builder function or an object of patch operations.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param documentId - Document ID to perform the patch operation on
   * @param patchOps - Operations to perform, or a builder function
   */
  patch(documentId: string, patchOps?: ObservablePatchBuilder | PatchOperations): this
  /**
   * Adds the given patch instance to the transaction.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param patch - ObservablePatch to execute
   */
  patch(patch: ObservablePatch): this
}

/** @public */
export declare class ObservableUsersClient {
  #private
  constructor(client: ObservableSanityClient, httpRequest: HttpRequest)
  /**
   * Fetch a user by user ID
   *
   * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
   */
  getById<T extends 'me' | string>(
    id: T,
  ): Observable<T extends 'me' ? CurrentSanityUser : SanityUser>
}

/**
 * The listener connection has been established
 * note: it's usually a better option to use the 'welcome' event
 * @public
 */
export declare type OpenEvent = {
  type: 'open'
}

/** @public */
export declare class Patch extends BasePatch {
  #private
  constructor(selection: PatchSelection, operations?: PatchOperations, client?: SanityClient)
  /**
   * Clones the patch
   */
  clone(): Patch
  /**
   * Commit the patch, returning a promise that resolves to the first patched document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Commit the patch, returning a promise that resolves to an array of the mutated documents
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Commit the patch, returning a promise that resolves to a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: FirstDocumentIdMutationOptions): Promise<SingleMutationResult>
  /**
   * Commit the patch, returning a promise that resolves to a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: AllDocumentIdsMutationOptions): Promise<MultipleMutationResult>
  /**
   * Commit the patch, returning a promise that resolves to the first patched document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any> = Record<string, Any>>(
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
}

/** @public */
export declare type PatchBuilder = (patch: Patch) => Patch

/** @internal */
export declare type PatchMutationOperation = PatchOperations & MutationSelection

/** @internal */
export declare interface PatchOperations {
  set?: {
    [key: string]: Any
  }
  setIfMissing?: {
    [key: string]: Any
  }
  diffMatchPatch?: {
    [key: string]: Any
  }
  unset?: string[]
  inc?: {
    [key: string]: number
  }
  dec?: {
    [key: string]: number
  }
  insert?: InsertPatch
  ifRevisionID?: string
}

/** @internal */
export declare type PatchSelection = string | string[] | MutationSelection

/** @public */
declare interface ProgressEvent_2 {
  type: 'progress'
  stage: 'upload' | 'download'
  percent: number
  total?: number
  loaded?: number
  lengthComputable: boolean
}
export {ProgressEvent_2 as ProgressEvent}

/** @internal */
export declare class ProjectsClient {
  #private
  constructor(client: SanityClient, httpRequest: HttpRequest)
  /**
   * Fetch a list of projects the authenticated user has access to.
   *
   * @param options - Options for the list request
   * @param options.includeMembers - Whether to include members in the response (default: true)
   */
  list(options?: {includeMembers?: true}): Promise<SanityProject[]>
  list(options?: {includeMembers?: false}): Promise<Omit<SanityProject, 'members'>[]>
  /**
   * Fetch a project by project ID
   *
   * @param projectId - ID of the project to fetch
   */
  getById(projectId: string): Promise<SanityProject>
}

/**
 * Publishes a draft document.
 * If a published version of the document already exists this is replaced by the current draft document.
 * In either case the draft document is deleted.
 * The optional revision id parameters can be used for optimistic locking to ensure
 * that the draft and/or published versions of the document have not been changed by another client.
 *
 * @public
 */
export declare type PublishAction = {
  actionType: 'sanity.action.document.publish'
  /**
   * Draft document ID to publish
   */
  draftId: string
  /**
   * Draft revision ID to match
   */
  ifDraftRevisionId?: string
  /**
   * Published document ID to replace
   */
  publishedId: string
  /**
   * Published revision ID to match
   */
  ifPublishedRevisionId?: string
}

/** @public */
export declare type QueryOptions =
  | FilteredResponseQueryOptions
  | UnfilteredResponseQueryOptions
  | UnfilteredResponseWithoutQuery

/** @public */
export declare interface QueryParams {
  [key: string]: any
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  body?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  cache?: 'next' extends keyof RequestInit ? never : any
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  filterResponse?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  headers?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  method?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  next?: 'next' extends keyof RequestInit ? never : any
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  perspective?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  query?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  resultSourceMap?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  returnQuery?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  signal?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  stega?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  tag?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  timeout?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  token?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  useCdn?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  lastLiveEventId?: never
  /** @deprecated you're using a fetch option as a GROQ parameter, this is likely a mistake */
  cacheMode?: never
}

/**
 * This type can be used with `client.fetch` to indicate that the query has no GROQ parameters.
 * @public
 */
export declare type QueryWithoutParams = Record<string, never> | undefined

/** @public */
export declare type RawQuerylessQueryResponse<R> = Omit<RawQueryResponse<R>, 'query'>

/** @public */
export declare interface RawQueryResponse<R> {
  query: string
  ms: number
  result: R
  resultSourceMap?: ContentSourceMap
  /** Requires `apiVersion` to be `2021-03-25` or later. */
  syncTags?: SyncTag[]
}

/** @internal */
export declare interface RawRequestOptions {
  url?: string
  uri?: string
  method?: string
  token?: string
  json?: boolean
  tag?: string
  useGlobalApi?: boolean
  withCredentials?: boolean
  query?: {
    [key: string]: string | string[]
  }
  headers?: {
    [key: string]: string
  }
  timeout?: number
  proxy?: string
  body?: Any
  maxRedirects?: number
  signal?: AbortSignal
}

/**
 * The listener has been disconnected, and a reconnect attempt is scheduled.
 *
 * @public
 */
export declare type ReconnectEvent = {
  type: 'reconnect'
}

/**
 * @public
 * @deprecated – The `r`-prefix is not required, use `string` instead
 */
export declare type ReleaseId = `r${string}`

/**
 * Replaces an existing draft document.
 * At least one of the draft or published versions of the document must exist.
 *
 * @public
 */
export declare type ReplaceDraftAction = {
  actionType: 'sanity.action.document.replaceDraft'
  /**
   * Published document ID to create draft from, if draft does not exist
   */
  publishedId: string
  /**
   * Document to create if it does not already exist. Requires `_id` and `_type` properties.
   */
  attributes: IdentifiedSanityDocumentStub
}

/** @public */
export declare const requester: Requester

/** @internal */
export declare interface RequestObservableOptions extends Omit<RequestOptions, 'url'> {
  url?: string
  uri?: string
  canUseCdn?: boolean
  useCdn?: boolean
  tag?: string
  returnQuery?: boolean
  resultSourceMap?: boolean | 'withKeyArraySelector'
  perspective?: ClientPerspective
  lastLiveEventId?: string
  cacheMode?: 'noStale'
}

/** @public */
export declare interface RequestOptions {
  timeout?: number
  token?: string
  tag?: string
  headers?: Record<string, string>
  method?: string
  query?: Any
  body?: Any
  signal?: AbortSignal
}

export {ResolveStudioUrl}

/** @public */
export declare interface ResponseEvent<T = unknown> {
  type: 'response'
  body: T
  url: string
  method: string
  statusCode: number
  statusMessage?: string
  headers: Record<string, string>
}

/** @public */
export declare interface ResponseQueryOptions extends RequestOptions {
  perspective?: ClientPerspective
  resultSourceMap?: boolean | 'withKeyArraySelector'
  returnQuery?: boolean
  useCdn?: boolean
  stega?: boolean | StegaConfig
  cache?: 'next' extends keyof RequestInit ? RequestInit['cache'] : never
  next?: ('next' extends keyof RequestInit ? RequestInit : never)['next']
  lastLiveEventId?: string | string[] | null
  /**
   * When set to `noStale`, APICDN will not return a cached response if the content is stale.
   * Tradeoff between latency and freshness of content.
   *
   * Only to be used with live content queries and when useCdn is true.
   */
  cacheMode?: 'noStale'
}

/** @internal */
export declare interface SanityAssetDocument extends SanityDocument {
  url: string
  path: string
  size: number
  assetId: string
  mimeType: string
  sha1hash: string
  extension: string
  uploadId?: string
  originalFilename?: string
}

/** @public */
export declare class SanityClient {
  #private
  assets: AssetsClient
  datasets: DatasetsClient
  live: LiveClient
  projects: ProjectsClient
  users: UsersClient
  /**
   * Observable version of the Sanity client, with the same configuration as the promise-based one
   */
  observable: ObservableSanityClient
  /**
   * Instance properties
   */
  listen: typeof _listen
  constructor(httpRequest: HttpRequest, config?: ClientConfig)
  /**
   * Clone the client - returns a new instance
   */
  clone(): SanityClient
  /**
   * Returns the current client configuration
   */
  config(): InitializedClientConfig
  /**
   * Reconfigure the client. Note that this _mutates_ the current client.
   */
  config(newConfig?: Partial<ClientConfig>): this
  /**
   * Clone the client with a new (partial) configuration.
   *
   * @param newConfig - New client configuration properties, shallowly merged with existing configuration
   */
  withConfig(newConfig?: Partial<ClientConfig>): SanityClient
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams = QueryWithoutParams,
    const G extends string = string,
  >(query: G, params?: Q | QueryWithoutParams): Promise<ClientReturn<G, R>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Optional request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: G,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options?: FilteredResponseQueryOptions,
  ): Promise<ClientReturn<G, R>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: G,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options: UnfilteredResponseQueryOptions,
  ): Promise<RawQueryResponse<ClientReturn<G, R>>>
  /**
   * Perform a GROQ-query against the configured dataset.
   *
   * @param query - GROQ-query to perform
   * @param params - Optional query parameters
   * @param options - Request options
   */
  fetch<
    R = Any,
    Q extends QueryWithoutParams | QueryParams = QueryParams,
    const G extends string = string,
  >(
    query: G,
    params: Q extends QueryWithoutParams ? QueryWithoutParams : Q,
    options: UnfilteredResponseWithoutQuery,
  ): Promise<RawQuerylessQueryResponse<ClientReturn<G, R>>>
  /**
   * Fetch a single document with the given ID.
   *
   * @param id - Document ID to fetch
   * @param options - Request options
   */
  getDocument<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options?: {
      signal?: AbortSignal
      tag?: string
    },
  ): Promise<SanityDocument<R> | undefined>
  /**
   * Fetch multiple documents in one request.
   * Should be used sparingly - performing a query is usually a better option.
   * The order/position of documents is preserved based on the original array of IDs.
   * If any of the documents are missing, they will be replaced by a `null` entry in the returned array
   *
   * @param ids - Document IDs to fetch
   * @param options - Request options
   */
  getDocuments<R extends Record<string, Any> = Record<string, Any>>(
    ids: string[],
    options?: {
      signal?: AbortSignal
      tag?: string
    },
  ): Promise<(SanityDocument<R> | null)[]>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns a promise that resolves to an array containing the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns a promise that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Promise<SingleMutationResult>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns a promise that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Promise<MultipleMutationResult>
  /**
   * Create a document. Requires a `_type` property. If no `_id` is provided, it will be generated by the database.
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  create<R extends Record<string, Any> = Record<string, Any>>(
    document: SanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns a promise that resolves to an array containing the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns a promise that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Promise<SingleMutationResult>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns a promise that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Promise<MultipleMutationResult>
  /**
   * Create a document if no document with the same ID already exists.
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to create
   * @param options - Mutation options
   */
  createIfNotExists<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns a promise that resolves to an array containing the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns a promise that resolves to a mutation result object containing the ID of the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: FirstDocumentIdMutationOptions,
  ): Promise<SingleMutationResult>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns a promise that resolves to a mutation result object containing the created document ID.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options: AllDocumentIdsMutationOptions,
  ): Promise<MultipleMutationResult>
  /**
   * Create a document if it does not exist, or replace a document with the same document ID
   * Returns a promise that resolves to the created document.
   *
   * @param document - Document to either create or replace
   * @param options - Mutation options
   */
  createOrReplace<R extends Record<string, Any> = Record<string, Any>>(
    document: IdentifiedSanityDocumentStub<R>,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Deletes a document with the given document ID.
   * Returns a promise that resolves to the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Deletes a document with the given document ID.
   * Returns a promise that resolves to an array containing the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Deletes a document with the given document ID.
   * Returns a promise that resolves to a mutation result object containing the deleted document ID.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete(id: string, options: FirstDocumentIdMutationOptions): Promise<SingleMutationResult>
  /**
   * Deletes a document with the given document ID.
   * Returns a promise that resolves to a mutation result object containing the deleted document ID.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete(id: string, options: AllDocumentIdsMutationOptions): Promise<MultipleMutationResult>
  /**
   * Deletes a document with the given document ID.
   * Returns a promise that resolves to the deleted document.
   *
   * @param id - Document ID to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    id: string,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns a promise that resolves to first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns a promise that resolves to an array containing the deleted documents.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns a promise that resolves to a mutation result object containing the ID of the first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete(
    selection: MutationSelection,
    options: FirstDocumentIdMutationOptions,
  ): Promise<SingleMutationResult>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns a promise that resolves to a mutation result object containing the document IDs that were deleted.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete(
    selection: MutationSelection,
    options: AllDocumentIdsMutationOptions,
  ): Promise<MultipleMutationResult>
  /**
   * Deletes one or more documents matching the given query or document ID.
   * Returns a promise that resolves to first deleted document.
   *
   * @param selection - An object with either an `id` or `query` key defining what to delete
   * @param options - Options for the mutation
   */
  delete<R extends Record<string, Any> = Record<string, Any>>(
    selection: MutationSelection,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Perform mutation operations against the configured dataset
   * Returns a promise that resolves to the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | Patch | Transaction,
    options: FirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Perform mutation operations against the configured dataset.
   * Returns a promise that resolves to an array of the mutated documents.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | Patch | Transaction,
    options: AllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Perform mutation operations against the configured dataset
   * Returns a promise that resolves to a mutation result object containing the document ID of the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | Patch | Transaction,
    options: FirstDocumentIdMutationOptions,
  ): Promise<SingleMutationResult>
  /**
   * Perform mutation operations against the configured dataset
   * Returns a promise that resolves to a mutation result object containing the mutated document IDs.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any>>(
    operations: Mutation<R>[] | Patch | Transaction,
    options: AllDocumentIdsMutationOptions,
  ): Promise<MultipleMutationResult>
  /**
   * Perform mutation operations against the configured dataset
   * Returns a promise that resolves to the first mutated document.
   *
   * @param operations - Mutation operations to execute
   * @param options - Mutation options
   */
  mutate<R extends Record<string, Any> = Record<string, Any>>(
    operations: Mutation<R>[] | Patch | Transaction,
    options?: BaseMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param documentId - Document ID to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(documentId: string, operations?: PatchOperations): Patch
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param documentIds - Array of document IDs to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(documentIds: string[], operations?: PatchOperations): Patch
  /**
   * Create a new buildable patch of operations to perform
   *
   * @param selection - An object with `query` and optional `params`, defining which document(s) to patch
   * @param operations - Optional object of patch operations to initialize the patch instance with
   * @returns Patch instance - call `.commit()` to perform the operations defined
   */
  patch(selection: MutationSelection, operations?: PatchOperations): Patch
  /**
   * Create a new transaction of mutations
   *
   * @param operations - Optional array of mutation operations to initialize the transaction instance with
   */
  transaction<R extends Record<string, Any> = Record<string, Any>>(
    operations?: Mutation<R>[],
  ): Transaction
  /**
   * Perform action operations against the configured dataset
   * Returns a promise that resolves to the transaction result
   *
   * @param operations - Action operation(s) to execute
   * @param options - Action options
   */
  action(
    operations: Action | Action[],
    options?: BaseActionOptions,
  ): Promise<SingleActionResult | MultipleActionResult>
  /**
   * Perform a request against the Sanity API
   * NOTE: Only use this for Sanity API endpoints, not for your own APIs!
   *
   * @param options - Request options
   * @returns Promise resolving to the response body
   */
  request<R = Any>(options: RawRequestOptions): Promise<R>
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
  dataRequest(endpoint: string, body: unknown, options?: BaseMutationOptions): Promise<Any>
  /**
   * Get a Sanity API URL for the URI provided
   *
   * @param uri - URI/path to build URL for
   * @param canUseCdn - Whether or not to allow using the API CDN for this route
   */
  getUrl(uri: string, canUseCdn?: boolean): string
  /**
   * Get a Sanity API URL for the data operation and path provided
   *
   * @param operation - Data operation (eg `query`, `mutate`, `listen` or similar)
   * @param path - Path to append after the operation
   */
  getDataUrl(operation: string, path?: string): string
}

/** @internal */
export declare type SanityDocument<T extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof T]: T[P]
} & {
  _id: string
  _rev: string
  _type: string
  _createdAt: string
  _updatedAt: string
  /**
   * Present when `perspective` is set to `previewDrafts`
   */
  _originalId?: string
}

/** @public */
export declare type SanityDocumentStub<T extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof T]: T[P]
} & {
  _type: string
}

/** @internal */
export declare interface SanityImageAssetDocument extends SanityAssetDocument {
  metadata: {
    _type: 'sanity.imageMetadata'
    hasAlpha: boolean
    isOpaque: boolean
    lqip?: string
    blurHash?: string
    dimensions: {
      _type: 'sanity.imageDimensions'
      aspectRatio: number
      height: number
      width: number
    }
    palette?: {
      _type: 'sanity.imagePalette'
      darkMuted?: SanityImagePalette
      darkVibrant?: SanityImagePalette
      dominant?: SanityImagePalette
      lightMuted?: SanityImagePalette
      lightVibrant?: SanityImagePalette
      muted?: SanityImagePalette
      vibrant?: SanityImagePalette
    }
    image?: {
      _type: 'sanity.imageExifTags'
      [key: string]: Any
    }
    exif?: {
      _type: 'sanity.imageExifMetadata'
      [key: string]: Any
    }
  }
}

/** @internal */
export declare interface SanityImagePalette {
  background: string
  foreground: string
  population: number
  title: string
}

/** @public */
export declare interface SanityProject {
  id: string
  displayName: string
  /**
   * @deprecated Use the `/user-applications` endpoint instead, which lists all deployed studios/applications
   * @see https://www.sanity.io/help/studio-host-user-applications
   */
  studioHost: string | null
  organizationId: string | null
  isBlocked: boolean
  isDisabled: boolean
  isDisabledByUser: boolean
  createdAt: string
  pendingInvites?: number
  maxRetentionDays?: number
  members: SanityProjectMember[]
  metadata: {
    cliInitializedAt?: string
    color?: string
    /**
     * @deprecated Use the `/user-applications` endpoint instead, which lists all deployed studios/applications
     * @see https://www.sanity.io/help/studio-host-user-applications
     */
    externalStudioHost?: string
  }
}

/** @public */
export declare interface SanityProjectMember {
  id: string
  role: string
  isRobot: boolean
  isCurrentUser: boolean
}

/** @public */
export declare interface SanityQueries {}

/** @internal */
export declare interface SanityReference {
  _ref: string
}

/** @public */
export declare interface SanityUser {
  id: string
  projectId: string
  displayName: string
  familyName: string | null
  givenName: string | null
  middleName: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  isCurrentUser: boolean
}

/** @public */
export declare class ServerError extends Error {
  response: ErrorProps['response']
  statusCode: ErrorProps['statusCode']
  responseBody: ErrorProps['responseBody']
  details: ErrorProps['details']
  constructor(res: Any)
}

/**
 * @public
 */
export declare interface ServerSentEvent<Name extends string> {
  type: Name
  id?: string
  data?: unknown
}

/** @internal */
export declare interface SingleActionResult {
  transactionId: string
}

/** @internal */
export declare interface SingleMutationResult {
  transactionId: string
  documentId: string
  results: {
    id: string
    operation: MutationOperation
  }[]
}

/** @public */
export declare type StackablePerspective = ('published' | 'drafts' | string) & {}

/** @public */
export declare interface StegaConfig {
  /**
     * Enable or disable stega encoded strings in query results
     * ```ts
     {
     enabled: process.env.VERCEL_ENV !== 'production'
     }
     * ```
     * @defaultValue `false`
     */
  enabled?: boolean
  /**
   * Where the Studio is hosted.
   * If it's embedded in the app, use the base path for example `/studio`.
   * Otherwise provide the full URL to where the Studio is hosted, for example: `https://blog.sanity.studio`.
   *
   */
  studioUrl?: StudioUrl | ResolveStudioUrl
  filter?: FilterDefault
  /**
   * Specify a `console.log` compatible logger to see debug logs, which keys are encoded and which are not.
   */
  logger?: Logger
  /**
   * Set to `true` to omit cross dataset reference specific data from encoded strings
   */
  omitCrossDatasetReferenceData?: boolean
}

/** @public */
export declare type StegaConfigRequiredKeys = Extract<keyof StegaConfig, 'enabled'>

export {StudioBaseRoute}

export {StudioBaseUrl}

export {StudioUrl}

/** @public */
export declare type SyncTag = `s1:${string}`

/** @public */
export declare class Transaction extends BaseTransaction {
  #private
  constructor(operations?: Mutation[], client?: SanityClient, transactionId?: string)
  /**
   * Clones the transaction
   */
  clone(): Transaction
  /**
   * Commit the transaction, returning a promise that resolves to the first mutated document
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any>>(
    options: TransactionFirstDocumentMutationOptions,
  ): Promise<SanityDocument<R>>
  /**
   * Commit the transaction, returning a promise that resolves to an array of the mutated documents
   *
   * @param options - Options for the mutation operation
   */
  commit<R extends Record<string, Any>>(
    options: TransactionAllDocumentsMutationOptions,
  ): Promise<SanityDocument<R>[]>
  /**
   * Commit the transaction, returning a promise that resolves to a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: TransactionFirstDocumentIdMutationOptions): Promise<SingleMutationResult>
  /**
   * Commit the transaction, returning a promise that resolves to a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options: TransactionAllDocumentIdsMutationOptions): Promise<MultipleMutationResult>
  /**
   * Commit the transaction, returning a promise that resolves to a mutation result object
   *
   * @param options - Options for the mutation operation
   */
  commit(options?: BaseMutationOptions): Promise<MultipleMutationResult>
  /**
   * Performs a patch on the given document ID. Can either be a builder function or an object of patch operations.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param documentId - Document ID to perform the patch operation on
   * @param patchOps - Operations to perform, or a builder function
   */
  patch(documentId: string, patchOps?: PatchBuilder | PatchOperations): this
  /**
   * Performs a patch on the given selection. Can either be a builder function or an object of patch operations.
   *
   * @param selection - An object with `query` and optional `params`, defining which document(s) to patch
   * @param patchOps - Operations to perform, or a builder function
   */
  patch(patch: MutationSelection, patchOps?: PatchBuilder | PatchOperations): this
  /**
   * Adds the given patch instance to the transaction.
   * The operation is added to the current transaction, ready to be commited by `commit()`
   *
   * @param patch - Patch to execute
   */
  patch(patch: Patch): this
}

/** @internal */
export declare type TransactionAllDocumentIdsMutationOptions = BaseMutationOptions & {
  returnFirst?: false
  returnDocuments?: false
}

/** @internal */
export declare type TransactionAllDocumentsMutationOptions = BaseMutationOptions & {
  returnFirst?: false
  returnDocuments: true
}

/** @internal */
export declare type TransactionFirstDocumentIdMutationOptions = BaseMutationOptions & {
  returnFirst: true
  returnDocuments?: false
}

/** @internal */
export declare type TransactionFirstDocumentMutationOptions = BaseMutationOptions & {
  returnFirst: true
  returnDocuments: true
}

/** @internal */
export declare type TransactionMutationOptions =
  | TransactionFirstDocumentMutationOptions
  | TransactionFirstDocumentIdMutationOptions
  | TransactionAllDocumentsMutationOptions
  | TransactionAllDocumentIdsMutationOptions

/** @public */
export declare interface UnfilteredResponseQueryOptions extends ResponseQueryOptions {
  filterResponse: false
  /**
   * When `filterResponse` is `false`, `returnQuery` also defaults to `true` for
   * backwards compatibility (on the client side, not from the content lake API).
   * Can also explicitly be set to `true`.
   */
  returnQuery?: true
}

/**
 * When using `filterResponse: false`, but you do not wish to receive back the query from
 * the content lake API.
 *
 * @public
 */
export declare interface UnfilteredResponseWithoutQuery extends ResponseQueryOptions {
  filterResponse: false
  returnQuery: false
}

/**
 * Retract a published document.
 * If there is no draft version then this is created from the published version.
 * In either case the published version is deleted.
 *
 * @public
 */
export declare type UnpublishAction = {
  actionType: 'sanity.action.document.unpublish'
  /**
   * Draft document ID to replace the published document with
   */
  draftId: string
  /**
   * Published document ID to delete
   */
  publishedId: string
}

export {unstable__adapter}

export {unstable__environment}

/** @public */
export declare type UploadBody = File | Blob | Buffer | NodeJS.ReadableStream

/** @public */
export declare interface UploadClientConfig {
  /**
   * Optional request tag for the upload
   */
  tag?: string
  /**
   * Whether or not to preserve the original filename (default: true)
   */
  preserveFilename?: boolean
  /**
   * Filename for this file (optional)
   */
  filename?: string
  /**
   * Milliseconds to wait before timing the request out
   */
  timeout?: number
  /**
   * Mime type of the file
   */
  contentType?: string
  /**
   * Array of metadata parts to extract from asset
   */
  extract?: AssetMetadataType[]
  /**
   * Optional freeform label for the asset. Generally not used.
   */
  label?: string
  /**
   * Optional title for the asset
   */
  title?: string
  /**
   * Optional description for the asset
   */
  description?: string
  /**
   * The credit to person(s) and/or organization(s) required by the supplier of the asset to be used when published
   */
  creditLine?: string
  /**
   * Source data (when the asset is from an external service)
   */
  source?: {
    /**
     * The (u)id of the asset within the source, i.e. 'i-f323r1E'
     */
    id: string
    /**
     * The name of the source, i.e. 'unsplash'
     */
    name: string
    /**
     * A url to where to find the asset, or get more info about it in the source
     */
    url?: string
  }
}

/** @public */
export declare class UsersClient {
  #private
  constructor(client: SanityClient, httpRequest: HttpRequest)
  /**
   * Fetch a user by user ID
   *
   * @param id - User ID of the user to fetch. If `me` is provided, a minimal response including the users role is returned.
   */
  getById<T extends 'me' | string>(id: T): Promise<T extends 'me' ? CurrentSanityUser : SanityUser>
}

/**
 * @internal - it may have breaking changes in any release
 */
export declare function validateApiPerspective(
  perspective: unknown,
): asserts perspective is ClientPerspective

/**
 * The listener has been established, and will start receiving events.
 * Note that this is also emitted upon _reconnection_.
 *
 * @public
 */
export declare type WelcomeEvent = {
  type: 'welcome'
  listenerName: string
}

export {}
