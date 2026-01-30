self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Nuovo Messaggio';
    const options = {
        body: data.body || 'Hai una nuova notifica di pagamento.',
        icon: '/icon.svg',
        badge: '/icon.svg',
        data: data.url || '/',
        vibrate: [200, 100, 200],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
