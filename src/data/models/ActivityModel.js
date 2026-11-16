import { createActivity } from '../../domain/entities/Activity';

export default class ActivityModel {
  static toEntity(record) {
    return record ? createActivity(record) : null;
  }
}
