self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "/pwa-192x192.png"
  });
});

Notification.requestPermission().then(() => {
  new Notification("Order Update", {
    body: "Your package is now in transit 🚚",
  });
});
