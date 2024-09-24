document.getElementById('predictionForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const cargoType = document.getElementById('cargo').value; // Updated to match HTML
    const urgencyValue = document.getElementById('urgency').value;
    const fragileValue = document.getElementById('fragile').value;
    const weight = document.getElementById('weight').value;

    // Check if source and destination are the same
    if (source === destination) {
        alert('Source and Destination cannot be the same');
        return;
    }

    let distance;

    // Distance calculation
    const distanceMap = {
        "Vijayawada": {
            "Guntur": 35,
            "Visakhapatnam": 350,
            "Rajahmundry": 160
        },
        "Guntur": {
            "Vijayawada": 35,
            "Rajahmundry": 200,
            "Visakhapatnam": 385
        },
        "Visakhapatnam": {
            "Vijayawada": 350,
            "Guntur": 385,
            "Rajahmundry": 190
        },
        "Rajahmundry": {
            "Vijayawada": 160,
            "Guntur": 200,
            "Visakhapatnam": 190
        },
        "Tirupati": {
            "Vijayawada": 400,
            "Guntur": 375,
            "Visakhapatnam": 750
        },
        "Kurnool": {
            "Vijayawada": 380,
            "Guntur": 400,
            "Visakhapatnam": 770,
            "Rajahmundry": 500
        },
        "Nellore": {
            "Vijayawada": 280,
            "Guntur": 310,
            "Visakhapatnam": 660,
            "Rajahmundry": 438
        },
        "Kadapa": {
            "Vijayawada": 360,
            "Guntur": 390,
            "Visakhapatnam": 710,
            "Rajahmundry": 529
        }
    };

    if (distanceMap[source] && distanceMap[source][destination]) {
        distance = distanceMap[source][destination];
    } else {
        alert('Distance between these locations is not available');
        return;
    }

    // Map cargo type to numeric value
    const cargoMap = {
        "clothing": 0,
        "electronics": 1,
        "furniture": 2,
        "perishable": 3,
        "food": 4,
        "machinery": 5,
        "chemicals": 6,
        "books": 7
    };

    const cargo = cargoMap[cargoType] !== undefined ? cargoMap[cargoType] : 8; // Default value if not found

    // Map urgency to numeric value
    const urgency = urgencyValue === "normal" ? 0 : 1;

    // Map fragile to numeric value
    const fragile = fragileValue === "no" ? 0 : 1;

    // Prepare the data to be sent
    const data = {
        cargo: cargo,
        urgency: urgency,
        fragile: fragile,
        distance: distance,
        weight: parseFloat(weight) // Ensure weight is a number
    };

    // Send data to the Flask app
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Update the predicted price display instead of using alert
        if (result.predicted_price !== undefined) {
            document.getElementById('predictedPrice').textContent = result.predicted_price; // Ensure this element exists in your HTML
        } else {
            console.error(result.error);
            alert(result.error);
        }
    })
    .catch(error => console.error('Error:', error));
    console.log("Weight input: ", weight);
});
