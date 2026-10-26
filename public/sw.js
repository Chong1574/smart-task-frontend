self.addEventListener('push', function (event) {
  let data = { title: 'Notificación', body: '', url: '/' };
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const isFinance = data.data?.type === 'finance' || (data.url && data.url.includes('wallet'));
  const targetUrl = data.url || (isFinance ? '/taskman/wallet' : '/taskman');

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    vibrate: [200, 100, 200],
    data: { url: targetUrl }
  };

  if (isFinance) {
    options.actions = [
      { action: 'open_wallet', title: '📊 Ver Billetera' }
    ];
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/taskman';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client)
          return client.focus();
      }
      if (clients.openWindow)
        return clients.openWindow(urlToOpen);
    })
  );
});
