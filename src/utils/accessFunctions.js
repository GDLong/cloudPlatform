import pathToRegexp from 'path-to-regexp';

export function getAccess(pathname, menuTree) {
  const routerMap = {};
  const mergeMenuAndRouter = data => {
    data.forEach(menuItem => {
      if (menuItem.routes) {
        mergeMenuAndRouter(menuItem.routes);
      }
      routerMap[menuItem.path] = menuItem;
    });
  };
  mergeMenuAndRouter(menuTree);
  if (routerMap && Object.keys(routerMap).length) {
    const pathKey = Object.keys(routerMap).find(key => pathToRegexp(key).test(pathname));

    if (pathKey == undefined && pathname !== '/') {
      return 'other';
    } else {
      return routerMap[pathKey];
    }
  }
}
