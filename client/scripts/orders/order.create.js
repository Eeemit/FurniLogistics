document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            companyName: document.getElementById('company').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            addresses: [document.getElementById('address').value],
        };

        const messageValue = document.getElementById('message').value;
        if (messageValue !== "") {
            data.message = messageValue;
        }

        console.log(data)
        fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(order => {
                const orderDiv = document.getElementById("order");

                for (const key of Object.keys(order)) {
                    const p = document.createElement("p");
                    p.innerText = `${key}: ${order[key]}`
                    orderDiv.append(p)
                }

                orderDiv.style.visibility = "visible";
            })
            .catch(err => {
                console.error('Помилка при надсиланні форми:', err);
                alert('Щось пішло не так. Спробуйте пізніше.');
            });
    })
})