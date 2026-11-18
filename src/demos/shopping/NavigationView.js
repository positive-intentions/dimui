BP.module(
  "dimui/demos/shopping/NavigationView",
  ["dimui/demos/shopping/sharedStyles","dimui/demos/shopping/mockData","dimui/demos/shopping/CatalogView","dimui/demos/shopping/ProductDetailView","dimui/demos/shopping/CartView","dimui/demos/shopping/CheckoutView","dimui/demos/shopping/OrderConfirmationView","dimui/demos/shopping/OrdersView","dimui/demos/shopping/ProfileView"],
  function (__dep0, __dep1, __side2, __side3, __side4, __side5, __side6, __side7, __side8) {
  void __side2;
  void __side3;
  void __side4;
  void __side5;
  void __side6;
  void __side7;
  void __side8;
  const { define, html, css, useStyle } = Dim;
  const { appVariables } = __dep0;
  const { MOCK_PRODUCTS, getProductById } = __dep1;







  const NavigationView = (props, { useStyle, html, css }) => {
    const data = props.props || props;
    const {
      activeTab = 0,
      navStack = ["catalog"],
      theme = "light",
      cart = [],
      setCart = () => {},
      user = {},
      setTheme = () => {},
      orders = [],
      onProductClick,
      onBack,
      onAddToCart,
      onGoToCart,
      onCheckout,
      onCheckoutSubmit,
      onContinueShopping,
      onViewOrders,
    } = data;

    useStyle(css`
      ${appVariables}

      :host {
        display: block;
        height: 100%;
        min-height: 0;
      }

      .auto-transition-wrapper,
      .view-transition-item,
      .vt-layer {
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .vt-layer:not(.vt-incoming) {
        pointer-events: none;
      }

      .nav-view-root {
        flex: 1;
        height: 100%;
        width: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }

      .nav-view-root > * {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }
    `);

    const top = navStack[navStack.length - 1] || "catalog";

    if (top.startsWith("confirmation:")) {
      const orderId = top.split(":").slice(1).join(":");
      const order = orders.find((o) => o.id === orderId) ?? null;

      return html`
        <div class="nav-view-root">
          <dimui-order-confirmation
            .props="${{
              order,
              theme,
              onContinueShopping,
              onViewOrders,
            }}"
          />
        </div>
      `;
    }

    if (top === "checkout") {
      return html`
        <div class="nav-view-root">
          <dimui-checkout-view
            .props="${{
              cart,
              user,
              theme,
              onBack,
              onSubmit: onCheckoutSubmit,
            }}"
          />
        </div>
      `;
    }

    if (top.startsWith("product:")) {
      const productId = top.split(":")[1];
      const product = getProductById(productId);

      return html`
        <div class="nav-view-root">
          <dimui-product-detail
            .props="${{
              product,
              theme,
              onBack,
              onAddToCart,
              onGoToCart,
            }}"
          />
        </div>
      `;
    }

    // Tab roots follow activeTab only (same as messaging demo) so the visible
    // screen and transitionId stay in sync when switching tabs.
    if (activeTab === 1) {
      return html`
        <div class="nav-view-root">
          <dimui-cart-view
            .props="${{
              cart,
              setCart,
              theme,
              onProductClick,
              onCheckout,
            }}"
          />
        </div>
      `;
    }

    if (activeTab === 2) {
      return html`
        <div class="nav-view-root">
          <dimui-orders-view .props="${{ orders, theme }}" />
        </div>
      `;
    }

    if (activeTab === 3) {
      return html`
        <div class="nav-view-root">
          <dimui-shopping-profile
            .props="${{
              user,
              theme,
              setTheme,
              cart,
              setCart,
            }}"
          />
        </div>
      `;
    }

    return html`
      <div class="nav-view-root">
        <dimui-catalog-view
          .props="${{
            products: MOCK_PRODUCTS,
            theme,
            onProductClick,
            onAddToCart,
          }}"
        />
      </div>
    `;
  };

  define({ tag: "dimui-shopping-nav", component: NavigationView });
  const __default = NavigationView;
  return { default: __default };
  },
);
