const getValueSafely = <T>(mapping: Map<string, T>, key: string) => {
  if (mapping.has(key)) {
    return mapping.get(key);
  }

  throw new Error("No value for " + key + " in " + JSON.stringify(mapping));
};

export { getValueSafely };
