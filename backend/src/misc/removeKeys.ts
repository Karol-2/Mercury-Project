export default function removeKeys(obj: any, keys: PropertyKey[]) {
  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }

  return obj;
}
