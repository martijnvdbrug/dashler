import {Datastore} from '@google-cloud/datastore';
import {google} from '@google-cloud/datastore/build/proto/datastore';
import {entity} from '@google-cloud/datastore/build/src/entity';
import {DatastoreEntity} from './model/datastore-entity';
import {DatastoreQuery} from './model/datastore-query';
import ICommitResponse = google.datastore.v1.ICommitResponse;
import uuid = require('uuid/v1');

export class DatastoreClient<T extends DatastoreEntity> {

  datastore: Datastore;

  constructor(private readonly kind: string) {
    this.datastore = new Datastore();
    // this.datastore.auth.getApplicationDefault().then((result) => console.log(`Using project ${result.projectId}`));
  }

  /**
   * Creates or updates entity. Does not check for existance
   * @return ID of the created item
   */
  async save(entity: Partial<T>): Promise<string> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    const key = entity.id ? this.createKey(entity.id) : this.createKey();
    const datastoreEntity = {
      key,
      data: entity
    };
    await this.datastore.save(datastoreEntity);
    return key.name;
  }

  /**
   * Updates given entity, fails if entity doesn't exists
   */
  async update(id: string, entity: Partial<T>): Promise<[ICommitResponse]> {
    if (!id) {
      throw Error(`Id is needed for update operation.`);
    }
    const existing = await this.get(id);
    if (!existing) {
      throw new Error(`Entity with id ${id}, doesn't exists`);
    }
    entity.id = id; // id cannot be empty
    entity.updatedAt = new Date();
    entity.createdAt = existing.createdAt;
    const datastoreEntity = {
      key: this.createKey(id),
      data: entity
    };
    return this.datastore.update(datastoreEntity);
  }

  /**
   * Retrieve complete entity by id
   */
  async get(entityId: string): Promise<T> {
    const key = this.createKey(entityId);
    const [entity] = await this.datastore.get(key);
    if (entity) {
      entity.id = entityId;
    }
    return entity;
  }

  /**
   * Retrieve complete entity by id
   */
  async getMultiple(entityIds: string[]): Promise<T[]> {
    const keys = entityIds.map(id => this.createKey(id));
    const [entities] = await this.datastore.get(keys);
    return entities;
  }

  async getAll(): Promise<T[]> {
    const query = this.datastore.createQuery(this.kind);
    const [entities] = await this.datastore.runQuery(query);
    return entities;
  }

  /**
   * Deletes entity with key, does not check for existance
   */
  async remove(entityId: string): Promise<void> {
    const key = this.createKey(entityId);
    await this.datastore.delete(key);
  }

  /**
   * Check existance
   */
  async exists(entityId: string): Promise<boolean> {
    const exists = await this.get(entityId);
    return !!exists;
  }

  async query(query: DatastoreQuery): Promise<T[]> {
    const datastoreQuery = this.datastore.createQuery(this.kind);
    datastoreQuery.filter(query.property, query.operator, query.value);
    const [entities] = await this.datastore.runQuery(datastoreQuery);
    return entities;
  }

  createKey(id?: string): entity.Key {
    if (!id) {
      id = uuid();
    }
    return this.datastore.key([this.kind, id]);
  }
}
