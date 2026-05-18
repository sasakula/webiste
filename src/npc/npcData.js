// Schema NPC default (placeholder).
export function createNpcShape() {
  return {
    id: null,
    name: '',
    age: 0,
    gender: 'L',
    occupation: 'Pengangguran',
    personality: 'Netral',
    home: null,
    workplace: null,
    x: 0, y: 0,
    hunger: 100, energy: 100, social: 100, hygiene: 100, health: 100,
    money: 0, savings: 0, mood: 'netral', stress: 0,
    activity: 'idle',
    relations: {},
    memory: [],
  };
}
