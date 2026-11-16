// Contract for activity data. Implementations belong in the data layer.
export default class ActivityRepository {
  async getAll() {
    throw new Error('ActivityRepository.getAll() must be implemented.');
  }

  async getById(_id) {
    throw new Error('ActivityRepository.getById() must be implemented.');
  }
}
