async function getAvailableNotifications() {
  const modules = import.meta.glob('./notifications/*.ts');
  const imports = [];

  for (const path in modules) {
    const module = await modules[path]();
    imports.push(module.default);
  }

  return imports;
}

export {
  getAvailableNotifications,
};
