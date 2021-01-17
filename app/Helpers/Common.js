const fs = require('fs');
const path = require('path');

export default class Common {
  /**
   * map catalog
   * @param schema
   * @param data
   * @returns mappedData
   */

  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export function createFoldersIfDoesntExist() {
  let dir = path.join(process.env.HOME, 'tezster', 'filesync');
  if (process.dir) {
    dir = process.dir;
  } else {
    process.dir = dir;
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
