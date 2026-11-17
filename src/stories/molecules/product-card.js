import { html } from "@positive-intentions/dim";
import { StoryPad } from "../pad.js";
import "../../demos/shopping/ProductCard.js";

void StoryPad;

export default {
  title: "Molecules/Product card",
};

export const Default = {
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
