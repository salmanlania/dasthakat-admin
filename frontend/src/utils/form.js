export function transformGroupPermission(inputData) {
  const transformedData = {};

  for (const categoryKey in inputData) {
    const category = inputData[categoryKey];

    for (const permissionsKey in category) {
      const permissions = category[permissionsKey];

      for (const permission of permissions) {
        const route = permission.route;
        const permissionId = permission.permission_id;
        const selected = permission.selected;

        if (!transformedData[route]) {
          transformedData[route] = {};
        }

        transformedData[route][permissionId] = selected;
      }
    }
  }

  return transformedData;
}
