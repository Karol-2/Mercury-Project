export default function removeKeys<
  T extends Record<PropertyKey, any>,
  U extends (keyof T)[],
>(obj: T, keys: U): Omit<T, (typeof keys)[number]> {
  const objCopy = { ...obj };

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      delete objCopy[key];
    }
  }

  return objCopy;
}
