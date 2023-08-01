export function getIndexByValue(arr, value) {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item.paneKey === value) {
      res = i;
      break;
    }
  }

  return res;
}

export function treeFindPath<T extends any[]>(tree: T, func, path: any[] = []) {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}

export function treeToList<T extends any[]>(tree: T, result: any[] = [], level = 0) {
  tree.forEach((node) => {
    result.push(node);
    node.level = level + 1;
    node.children && treeToList(node.children, result, level + 1);
  });
  return result;
}
export function treeFind(tree, func) {
  if (!Array.isArray(tree)) return null;
  for (const data of tree) {
    if (func(data)) return data;
    if (data.children) {
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return null;
}
