/**
 * A generic Mock Service to simulate API interactions.
 * This class abstracts the data layer so it can be easily replaced by Axios calls to a NestJS backend later.
 */
export class MockService<T extends { id: string | number }> {
  private data: T[];
  private delay: number;

  constructor(initialData: T[], delayMs = 600) {
    this.data = [...initialData];
    this.delay = delayMs;
  }

  private simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getAll(): Promise<T[]> {
    await this.simulateDelay();
    return [...this.data];
  }

  async getById(id: string | number): Promise<T | null> {
    await this.simulateDelay();
    return this.data.find(item => item.id === id) || null;
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    await this.simulateDelay();
    const newItem = {
      ...item,
      id: `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    } as unknown as T;
    
    this.data = [newItem, ...this.data];
    return newItem;
  }

  async update(id: string | number, updates: Partial<T>): Promise<T> {
    await this.simulateDelay();
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    
    const updatedItem = { ...this.data[index], ...updates };
    this.data[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string | number): Promise<void> {
    await this.simulateDelay();
    this.data = this.data.filter(item => item.id !== id);
  }
}
