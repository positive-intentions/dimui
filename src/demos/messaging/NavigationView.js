import { define, html, css, useStyle } from "@positive-intentions/dim";
import { appVariables } from "./sharedStyles.js";
import {
  MOCK_CONVERSATIONS,
  MOCK_CALLS,
  MOCK_USER,
  getConversationById,
  getContactById,
  getProfileForId,
  getMessagesForConversation,
} from "./mockData.js";
import "./ConversationListView.js";
import "./ChatView.js";
import "./CallsListView.js";
import "./ProfileView.js";
import "./ContactDetailsView.js";

const resolveChatTarget = (id) => {
  const conversation = getConversationById(id);
  if (conversation) return conversation;

  const contact = getContactById(id);
  if (!contact) return null;

  return {
    id: contact.id,
    name: contact.name,
    avatar: contact.avatar,
    isOnline: contact.isOnline,
    isGroup: false,
  };
};

const NavigationView = (props, { useStyle, html, css }) => {
  const data = props.props || props;
  const {
    activeTab = 0,
    navStack = ["list"],
    onConversationClick,
    onBack,
    onAvatarClick,
    onOpenContacts,
    onCallClick,
    onContactMessage,
    onContactBack,
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

  const top = navStack[navStack.length - 1] || "list";

  if (top.startsWith("contact:")) {
    const contactId = top.split(":")[1];
    const contact = getProfileForId(contactId);

    return html`
      <div class="nav-view-root">
        <dimui-contact-details
          .props="${{
            contact,
            onBack: onContactBack,
            onMessage: onContactMessage,
          }}"
        />
      </div>
    `;
  }

  if (top.startsWith("chat:")) {
    const chatId = top.split(":")[1];
    const conversation = resolveChatTarget(chatId);
    const messages = getMessagesForConversation(chatId);

    return html`
      <div class="nav-view-root">
        <dimui-chat-view
          .props="${{
            conversation,
            messages,
            onBack,
            onAvatarClick,
          }}"
        />
      </div>
    `;
  }

  if (activeTab === 1) {
    return html`
      <div class="nav-view-root">
        <dimui-calls-list
          .props="${{
            calls: MOCK_CALLS,
            onCallClick,
          }}"
        />
      </div>
    `;
  }

  if (activeTab === 5) {
    return html`
      <div class="nav-view-root">
        <dimui-messaging-profile .props="${{ user: MOCK_USER }}" />
      </div>
    `;
  }

  return html`
    <div class="nav-view-root">
      <dimui-conversation-list
        .props="${{
          conversations: MOCK_CONVERSATIONS,
          onConversationClick,
          onOpenContacts,
        }}"
      />
    </div>
  `;
};

define({ tag: "dimui-messaging-nav", component: NavigationView });
export default NavigationView;
