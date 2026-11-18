BP.module(
  "dimui/demos/shopping/sharedKeys",
  [],
  function () {
  const sharedKeys = (id) => ({
    image: `image-${id}`,
    name: `name-${id}`,
    price: `price-${id}`,
    category: `category-${id}`,
  });
  return { sharedKeys };
  },
);
