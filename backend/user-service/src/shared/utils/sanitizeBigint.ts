type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

export function convertBigIntToString<T>(data: T): JSONValue {
  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(convertBigIntToString) as JSONValue;
  }

  if (data !== null && typeof data === "object") {
    const result: Record<string, JSONValue> = {};
    for (const key in data) {
      const value = (data as Record<string, unknown>)[key];
      result[key] = convertBigIntToString(value);
    }
    return result;
  }

  return data as JSONValue;
}
