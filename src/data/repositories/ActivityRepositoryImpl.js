import ActivityRepository from '../../domain/repositories/ActivityRepository';
import ActivityModel from '../models/ActivityModel';

export default class ActivityRepositoryImpl extends ActivityRepository {
  constructor(dataSource) { super(); this.dataSource = dataSource; }
  async getAll() { return (await this.dataSource.getAll()).map(ActivityModel.toEntity); }
  async getById(id) { return ActivityModel.toEntity(await this.dataSource.getById(id)); }
  async create(record) { return ActivityModel.toEntity(await this.dataSource.create(record)); }
  async update(id, changes) { return ActivityModel.toEntity(await this.dataSource.update(id, changes)); }
  async remove(id) { return this.dataSource.remove(id); }
}
