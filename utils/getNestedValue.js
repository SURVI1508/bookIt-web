// utils/getNestedValue.ts
export function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;

  // Convert [0] into .0 so we can split easily
  const normalizedPath = path.replace(/\[(\d+)\]/g, ".$1");
  return normalizedPath.split(".").reduce((acc, key) => acc?.[key], obj);
}
