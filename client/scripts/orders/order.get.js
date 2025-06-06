document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    let map, routingControl;

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

                const routeCoords = coords.map(([lng, lat]) => [lat, lng]);

                if (!map) {
                    map = L.map('map').setView(routeCoords[0], 3);

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

                if (routingControl) {
                    map.removeControl(routingControl);
                }

                routingControl = L.Routing.control({
                    waypoints: routeCoords.map(coord => L.latLng(coord[0], coord[1])),
                    lineOptions: {
                        styles: [{ color: 'blue', weight: 5 }]
                    },
                    routeWhileDragging: false,
                    draggableWaypoints: false,
                    addWaypoints: false,
                    show: false
                }).addTo(map);

                routingControl.on('routesfound', function (e) {
                    const route = e.routes[0];

                    let latLngs = [];
                    route.coordinates.forEach(coord => {
                        latLngs.push(L.latLng(coord.lat, coord.lng));
                    });

                    let bounds = L.latLngBounds(latLngs);
                    map.fitBounds(bounds);
                });
            })
            .catch(err => {
                console.error('Помилка при запиті:', err);
                alert('Щось пішло не так. Спробуйте пізніше.');
            });
    })
})