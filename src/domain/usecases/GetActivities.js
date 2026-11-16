export default class GetActivities {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  execute() {
    return this.activityRepository.getAll();
  }
}
