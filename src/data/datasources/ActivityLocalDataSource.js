import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@labspace/activities/v1';

export default class ActivityLocalDataSource {
  async getAll() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async getById(id) {
    const records = await this.getAll();
    return records.find((item) => item.id === id) || null;
  }

  async create(record) {
    const records = await this.getAll();
    const next = [record, ...records];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return record;
  }

  async update(id, changes) {
    const records = await this.getAll();
    const next = records.map((item) => item.id === id ? { ...item, ...changes } : item);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next.find((item) => item.id === id) || null;
  }

  async remove(id) {
    const records = await this.getAll();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records.filter((item) => item.id !== id)));
  }
}
