BP.module(
  "dimui/demos/messaging/sharedKeys",
  [],
  function () {
  const sharedKeys = (id) => ({
    avatar: `avatar-${id}`,
    name: `name-${id}`,
    lastMessage: `lastMessage-${id}`,
    timestamp: `timestamp-${id}`,
    status: `status-${id}`,
    online: `online-${id}`,
  });
  return { sharedKeys };
  },
);
