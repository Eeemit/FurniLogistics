document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    let map;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const orderId = document.getElementById('orderNumber').value

        const data = {
            phone: document.getElementById("phone").value,
        };

        fetch(`http://localhost:3000/orders/${orderId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(order => {
                document.getElementById("customerName").innerText = order.name;
                const deliveryAddress = document.getElementById("deliveryAddress");
                deliveryAddress.innerHTML = order.addresses.map(item => `<span>${item}</span>`).join("; ");
            })
            .catch(err => {
                console.error('Помилка при надсиланні форми:', err);
                alert('Щось пішло не так. Спробуйте пізніше.');
            });

        fetch(`http://localhost:3000/orders/track/${orderId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(coords => {
                if (!Array.isArray(coords) || coords.length < 2) {
                    throw new Error("Недостатньо координат для побудови маршруту");
                }

                const routeCoords = coords.map(p => [p.coords[1], p.coords[0]]);

                if (!map) {
                    map = L.map('map').setView(routeCoords[0], 12);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);
                } else {
                    map.eachLayer(layer => {
                        if (layer instanceof L.TileLayer) return;
                        map.removeLayer(layer);
                    });
                }

                // Додаємо стрілки (потрібно підключити PolylineDecorator)
                const colors = ['blue', 'orange', 'purple', 'green']; // для чергування

                for (let i = 0; i < routeCoords.length - 1; i++) {
                    const segment = [routeCoords[i], routeCoords[i + 1]];
                    const color = colors[i % colors.length]; // чергування кольорів

                    const polyline = L.polyline(segment, { color: color, weight: 5 }).addTo(map);

                    // Додаємо стрілки для цього сегмента
                    L.polylineDecorator(polyline, {
                        patterns: [
                            {
                                offset: "10%",
                                repeat: 0,
                                symbol: L.Symbol.arrowHead({
                                    pixelSize: 10,
                                    polygon: true,
                                    pathOptions: { color: color, fillOpacity: 1, weight: 0 }
                                })
                            }
                        ]
                    }).addTo(map);
                }

                // Додаємо маркери на точки з label
                coords.forEach(point => {
                    if (!point.label) return;

                    // Визначаємо колір
                    let color = 'gray';
                    if (point.label === 'start') color = 'green';
                    // Додаємо маркер
                    L.circleMarker([point.coords[1], point.coords[0]], {
                        radius: 8,
                        color: color,
                        fillColor: color,
                        fillOpacity: 1
                    }).addTo(map).bindPopup(point.label);
                });
            })
            .catch(err => {
                console.error('Помилка при запиті:', err);
                alert('Щось пішло не так. Спробуйте пізніше.');
            });
    })
})