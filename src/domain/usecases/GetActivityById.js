export default class GetActivityById {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  execute(id) {
    return this.activityRepository.getById(id);
  }
}
