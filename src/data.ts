export type Status = '长程迁徙' | '短程迁徙' | '濒危'

export interface Bird {
  id: string
  name: string
  en: string
  distKm: number
  breedLat: number
  winterLat: number
  startMonth: number
  endMonth: number
  status: Status
}

export const STATUS_COLOR: Record<Status, string> = {
  '长程迁徙': '#2f6fb8',
  '短程迁徙': '#7da7c9',
  '濒危': '#c2543f',
}

export const birds: Bird[] = [
  { id: 'arctern', name: '北极燕鸥', en: 'Arctic Tern', distKm: 30000, breedLat: 70, winterLat: -60, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'barwit', name: '斑尾塍鹬', en: 'Bar-tailed Godwit', distKm: 12000, breedLat: 67, winterLat: -40, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'cuckoo', name: '大杜鹃', en: 'Common Cuckoo', distKm: 8000, breedLat: 60, winterLat: -20, startMonth: 7, endMonth: 9, status: '长程迁徙' },
  { id: 'swallow', name: '家燕', en: 'Barn Swallow', distKm: 10000, breedLat: 55, winterLat: -30, startMonth: 9, endMonth: 11, status: '长程迁徙' },
  { id: 'stork', name: '白鹳', en: 'White Stork', distKm: 8000, breedLat: 52, winterLat: -25, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'redknot', name: '红腹滨鹬', en: 'Red Knot', distKm: 15000, breedLat: 70, winterLat: -45, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'peregrine', name: '游隼', en: 'Peregrine Falcon', distKm: 12000, breedLat: 65, winterLat: -30, startMonth: 9, endMonth: 11, status: '长程迁徙' },
  { id: 'crane', name: '灰鹤', en: 'Common Crane', distKm: 6000, breedLat: 60, winterLat: 10, startMonth: 9, endMonth: 11, status: '短程迁徙' },
  { id: 'blkogod', name: '黑尾塍鹬', en: 'Black-tailed Godwit', distKm: 9000, breedLat: 55, winterLat: -20, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'ybunting', name: '黄胸鹀', en: 'Yellow-breasted Bunting', distKm: 6000, breedLat: 50, winterLat: 5, startMonth: 8, endMonth: 10, status: '濒危' },
  { id: 'gwfgoose', name: '白额雁', en: 'Greater White-fronted Goose', distKm: 5000, breedLat: 65, winterLat: 25, startMonth: 10, endMonth: 12, status: '短程迁徙' },
  { id: 'tswan', name: '小天鹅', en: 'Tundra Swan', distKm: 6000, breedLat: 70, winterLat: 30, startMonth: 9, endMonth: 11, status: '短程迁徙' },
  { id: 'swift', name: '普通雨燕', en: 'Common Swift', distKm: 7000, breedLat: 55, winterLat: -10, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'bkite', name: '黑鸢', en: 'Black Kite', distKm: 8000, breedLat: 55, winterLat: -5, startMonth: 8, endMonth: 10, status: '长程迁徙' },
  { id: 'spoonbill', name: '勺嘴鹬', en: 'Spoon-billed Sandpiper', distKm: 8000, breedLat: 65, winterLat: 5, startMonth: 8, endMonth: 10, status: '濒危' },
  { id: 'loon', name: '红喉潜鸟', en: 'Red-throated Loon', distKm: 5000, breedLat: 70, winterLat: 30, startMonth: 9, endMonth: 11, status: '短程迁徙' },
]
