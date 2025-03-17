let map;

function initMap() {
    const defaultLocation = { lat: 40.2969, lng: -111.6946 }; 
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 12,
    });

    fetch('data/gas_stations.json')
        .then(response => response.json())
        .then(data => {
            let maxPrice = Math.max(...data.stations.map(s => s.price));

            data.stations.forEach(station => {
                let savings = maxPrice - station.price;
                const marker = new google.maps.Marker({
                    position: { lat: station.latitude, lng: station.longitude },
                    map: map,
                    title: `${station.name} - $${station.price}`,
                });

                const infowindow = new google.maps.InfoWindow({
                    content: `
                        <div class="info-window">
                            <strong>${station.name}</strong><br>
                            Price: <span class="price">$${station.price}</span><br>
                            Address: ${station.address}<br>
                            <span class="savings">Save up to $${savings.toFixed(2)} per gallon!</span>
                            <h4>Reviews:</h4>
                            <div id="reviews-${station.id}">Loading...</div>
                        </div>
                    `,
                });

                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                    loadReviews(station.id);
                });
            });
        })
        .catch(error => console.error('Error loading gas station data:', error));
}

// Load reviews from JSON
function loadReviews(stationId) {
    fetch('data/reviews.json')
        .then(response => response.json())
        .then(data => {
            const reviewsDiv = document.getElementById(`reviews-${stationId}`);
            const stationReviews = data.reviews.filter(r => r.stationId === stationId);
            
            if (stationReviews.length > 0) {
                reviewsDiv.innerHTML = stationReviews.map(r => `<p>"${r.text}" - ⭐${r.rating}</p>`).join('');
            } else {
                reviewsDiv.innerHTML = '<p>No reviews yet.</p>';
            }
        })
        .catch(error => console.error('Error loading reviews:', error));
}
