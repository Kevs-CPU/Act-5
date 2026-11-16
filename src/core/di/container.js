import ActivityLocalDataSource from '../../data/datasources/ActivityLocalDataSource';
import ActivityRepositoryImpl from '../../data/repositories/ActivityRepositoryImpl';
import GetActivities from '../../domain/usecases/GetActivities';
import GetActivityById from '../../domain/usecases/GetActivityById';

const activityDataSource = new ActivityLocalDataSource();
const activityRepository = new ActivityRepositoryImpl(activityDataSource);

const container = {
  getActivities: new GetActivities(activityRepository),
  getActivityById: new GetActivityById(activityRepository),
  createActivity: (record) => activityRepository.create(record),
  updateActivity: (id, changes) => activityRepository.update(id, changes),
  deleteActivity: (id) => activityRepository.remove(id),
};
export default container;
