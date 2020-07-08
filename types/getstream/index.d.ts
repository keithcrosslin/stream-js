/// <reference types="node" />
// TypeScript Version: 3.5
export as namespace stream;

export interface APIResponse {
  duration: string;
  [customFieldKey: string]: any;
}

/**
 * Create StreamClient
 */
export function connect(apiKey: string, apiSecret: string | null, appId: string, options?: object): stream.Client;

export class CollectionEntry {
  constructor(store: Collections, collection: string, id: string, data: object);

  // Get the entry ref string
  ref(): string;

  // Get the entry from the Collection
  get(): Promise<object>;

  // Add the entry to the Collection
  add(): Promise<object>;

  // Update the entry in the object storage
  update(): Promise<object>;

  // Delete the entry from the collection
  delete(): Promise<object>;
}

export class Collections {
  /** Construct Collections. */
  constructor(client: StreamClient, token: string);

  // Build the URL for a collection or collection item
  buildURL(collection: string, itemId?: string): string;

  // Instantiate a collection entry object
  entry(collection: string, itemId?: string, itemData?: object): CollectionEntry;

  // Get a collection entry
  get(collection: string, itemId: string): Promise<object>;

  // Add a single entry to a collection
  add(collection: string, itemId: string, itemData?: object): Promise<object>;

  // Update a single collection entry
  update(collection: string, entryId: string, data?: object): Promise<object>;

  // Delete a single collection entry
  delete(collection: string, entryId: string): Promise<object>;

  // Upsert one or more items within a collection.
  upsert(collectionName: string, data: object | object[]): Promise<object>;

  // Select all objects with ids from the collection.
  select(collectionName: string, ids: object | object[]): Promise<object>;

  // Remove all objects by id from the collection.
  deleteMany(collectionName: string, ids: object | object[]): Promise<object>;
}

export class Personalization {
  /** Construct Personalization. */
  constructor(client: StreamClient);

  // Get personalized activities for this feed.
  get(resource: string, options?: object): Promise<object>;

  // Post data to personalization endpoint.
  post(resource: string, options?: object, data?: object): Promise<object>;

  // Delete metadata or activities
  delete(resource: string, options?: object): Promise<object>;
}

export interface FileUploadAPIResponse extends APIResponse {
  file: string;
}

export interface ImageProcessOptions {
  w?: number | string;
  h?: number | string;
  resize?: string | 'clip' | 'crop' | 'scale' | 'fill';
  crop?: string | 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export type onUploadProgress = (progressEvent: ProgressEvent) => void;

export class StreamImageStore {
  constructor(client: StreamClient, token: string);

  upload(
    uri: string | Buffer | File,
    name?: string,
    contentType?: string,
    onUploadProgress?: onUploadProgress,
  ): Promise<FileUploadAPIResponse>;

  process(uri: string, options: ImageProcessOptions): Promise<FileUploadAPIResponse>;

  thumbnail(
    uri: string,
    w: number | string,
    h: number | string,
    options?: ImageProcessOptions,
  ): Promise<FileUploadAPIResponse>;

  delete(uri: string): Promise<{}>;
}

export class StreamFileStore {
  constructor(client: StreamClient, token: string);

  upload(
    uri: string | Buffer | File,
    name?: string,
    contentType?: string,
    onUploadProgress?: onUploadProgress,
  ): Promise<FileUploadAPIResponse>;

  delete(uri: string): Promise<{}>;
}

export class Feed {
  /** Construct Feed. */
  constructor(client: StreamClient, feedSlug: string, userId: string, token: string);

  // Add activity
  addActivity(activity: Activity): Promise<object>;

  // Remove activity
  removeActivity(activityId: string | object): Promise<object>;

  // Add activities
  addActivities(activities: Activity[]): Promise<object>;

  // Follow feed
  follow(targetSlug: string, targetUserId: string, options?: object): Promise<object>;

  // Unfollow feed
  unfollow(targetSlug: string, targetUserId: string, options?: object): Promise<object>;

  // List followed feeds
  following(options: object): Promise<object>;

  // List followers
  followers(options: object): Promise<object>;

  // Get feed
  get(options: object): Promise<object>;

  // Activity details
  getActivityDetail(activityId: string, options?: object): Promise<object>;

  // Subscriptions
  getFayeClient(timeout?: number): object; // would like to return `Faye.Client` here, but they haven't release any ts def files yet
  subscribe(callback: GenericCallback): Promise<object>;
  unsubscribe(): void;

  // Updates an activity's "to" fields
  updateActivityToTargets(
    foreignId: string,
    time: string,
    newTargets: string[],
    addedTargets: string[],
    removedTargets: string[],
  ): Promise<object>;
}

export class Reaction {
  /** Construct Reaction. */
  constructor(client: StreamClient);

  add(kind: string, activity: string | Activity, data?: object, targetFeeds?: string[]): Promise<object>;

  addChild(kind: string, reaction: string | Reaction, data?: object, targetFeeds?: string[]): Promise<object>;

  get(id: string): Promise<object>;

  filter(conditions: object): Promise<object>;

  update(id: string, data: object, targetFeeds?: string[]): Promise<object>;

  delete(id: string): Promise<object>;
}

export class User {
  /** Construct User. */
  constructor(client: StreamClient, userId: string);

  ref(): string;

  delete(): Promise<object>;

  get(options: object): Promise<object>;

  create(data: object): Promise<object>;

  update(data: object): Promise<object>;

  getOrCreate(options: object): Promise<object>;

  profile(): Promise<object>;
}

export class StreamClient {
  /** Construct StreamClient */
  constructor(apiKey: string, apiSecret?: string, appId?: string, options?: object);

  apiKey: string;
  appId?: string;
  apiSecret?: string;
  userToken?: string;
  userId?: string;
  currentUser?: User;

  // Event subscriptions
  on(event: string, callback: (args: any[]) => void): void;
  off(key: string): void;

  // Get user agent
  userAgent(): string;

  // Get feed tokens
  getReadOnlyToken(feedSlug: string, userId: string): string;
  getReadWriteToken(feedSlug: string, userId: string): string;

  // Create user token
  createUserToken(userId: string, extraData?: object): string;

  // Create feed
  feed(feedSlug: string, userId: string | User): Feed;

  // Update activity
  updateActivity(activity: object): Promise<object>;

  // Retrieve activities by ID or foreign ID and time
  getActivities(params: object): Promise<object>;

  // Partially update activity
  activityPartialUpdate(data: object): Promise<object>;

  // Partially update multiple activities
  activitiesPartialUpdate(changes: object): Promise<object>;

  // Update activities
  updateActivities(activities: object[]): Promise<object>;

  // Add activity to many feeds
  /**
   * addToMany.
   * Available in node environments with batchOperations enabled.
   */
  addToMany(activity: Activity, feeds: string[]): Promise<object>;

  // Collections sub-component
  collections: Collections;
  personalization: Personalization;
  images: StreamImageStore;
  files: StreamFileStore;
  reactions: Reaction;

  // Instantiate a StreamUser class for the given user ID
  user(userId: string): User;

  // Follow many feeds
  /**
   * followMany.
   * Available in node environments with batchOperations enabled
   */
  followMany(follows: object[], activityCopyLimit?: number): Promise<object>;

  // Unfollow many feeds
  /**
   * unfollowMany.
   * Available in node environments with batchOperations enabled
   */
  unfollowMany(unfollows: object[]): Promise<object>;

  /**
   * og.
   * Retrieve open graph information of urls
   */
  og(url: string): Promise<OGResponse>;
}

// Export the OGResource
export interface OGResource {
  url?: string;
  secure_url?: string;
  type?: string;
}

// Export the OGAudio
export interface OGAudio extends OGResource {
  audio?: string;
}

// Export the OGImage
export interface OGImage extends OGResource {
  image?: string;
  width?: number;
  height?: number;
  alt?: string;
}

// Export the OGVideo
export interface OGVideo extends OGResource {
  video?: string;
  width?: number;
  height?: number;
}

// Export the OGResponse
export interface OGResponse extends APIResponse {
  title?: string;
  type?: string;
  url?: string;
  site?: string;
  site_name?: string;
  description?: string;
  favicon?: string;
  determiner?: string;
  locale?: string;
  audios?: OGAudio[];
  images?: OGImage[];
  videos?: OGVideo[];
}

// Export the Stream Client
export { StreamClient as Client };

// Export the Stream errors
export namespace errors {
  class MissingSchemaError {
    /**
     * Construct MissingSchemaError.
     * Not typically instantiated by app developers.
     */
  }

  class FeedError {
    /**
     * Construct FeedError.
     * Not typically instantiated by app developers.
     */
  }
  class SiteError {
    /**
     * Construct SiteError.
     * Not typically instantiated by app developers.
     */
  }
}

export interface Activity {
  actor: string | User;
  verb: string;
  object: string;
  time?: string;
  to?: string[];
  foreign_id?: string;
  [customFieldKey: string]: any;

  // reserved words
  activity_id?: never;
  activity?: never;
  analytics?: never;
  extra_context?: never;
  id?: never;
  is_read?: never;
  is_seen?: never;
  origin?: never;
  score?: never;
  site_id?: never;
}

export type GenericCallback<T = any> = (data: T) => void;
