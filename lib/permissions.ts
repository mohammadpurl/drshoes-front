/** True if `required` is granted by any entry in `permissions` (supports `resource.*` wildcards). */
export function permissionMatches(
  permissions: string[],
  required: string
): boolean {
  if (permissions.includes(required)) return true;
  if (permissions.includes("*")) return true;

  return permissions.some((granted) => {
    if (!granted.endsWith(".*")) return false;
    const base = granted.slice(0, -2);
    return required === base || required.startsWith(`${base}.`);
  });
}
