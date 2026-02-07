import Fuse from "fuse.js";

export const searchMenu = (data: any[], query: string) => {
  if (!query) return data;

  return data.reduce((acc, item) => {
    const filteredChildren = item.children
      ? searchMenu(item.children, query)
      : [];

    const fuse = new Fuse([item], {
      keys: ["text"],
      threshold: 0.4,
    });

    const isSelfMatch = fuse.search(query).length > 0;

    if (isSelfMatch || filteredChildren.length > 0) {
      acc.push({
        ...item,
        children:
          filteredChildren.length > 0 ? filteredChildren : item.children,
      });
    }

    return acc;
  }, []);
};
