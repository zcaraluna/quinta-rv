self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/quinta-rv.png',
            badge: '/quinta-rv.png',
            data: {
                url: data.url || '/admin/reservas'
            },
            vibrate: [100, 50, 100],
            actions: [
                {
                    action: 'view',
                    title: 'Ver Reserva'
                },
                {
                    action: 'close',
                    title: 'Cerrar'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'close') return;

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function (clientList) {
            const url = event.notification.data.url;
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
