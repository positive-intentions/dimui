BP.module(
  "dimui/stories/molecules/product-card",
  ["dimui/stories/pad","dimui/demos/shopping/ProductCard"],
  function (__dep0, __side1) {
  void __side1;
  const { html } = Dim;
  const { StoryPad } = __dep0;

  void StoryPad;
  const __default = {
    title: "Molecules/Product card",
  };
  const Default = {
    render: () =>
      html`<dimui-story-pad
        .props="${{
          layout: "stack full",
          content: html`<div style="max-width:260px">
            <dimui-product-card
              .props="${{
                product: {
                  id: 1,
                  name: "Wireless Headphones",
                  price: 199.99,
                  image: "🎧",
                  category: "Electronics",
                },
                theme: "light",
                onProductClick: () => {},
                onAddToCart: () => {},
              }}"
            />
          </div>`,
        }}"
      />`,
  };
  return { Default, default: __default };
  },
);
