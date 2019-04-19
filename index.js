
//Map initialization

function initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50, lng: 1},
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        rightClicked: false,
        draggableCursor: 'crosshair',
        draggingCursor: 'move',
        disableDefaultUI: true,
        zoomControl: true,
    });

    let currentMarker;
    let currentInfowindow;
    let addNewMarkerClicked = false;

    //Several functions including adding marker when button 'Yes' clicked / Deleting individual marker when button 'Delete marker' clicked

    function placeMarker(location) {
        let marker;
        let infowindow;
        if (currentMarker && !addNewMarkerClicked) {
            marker = currentMarker;
            marker.setPosition(location);
        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map
            });
            currentMarker = marker;
        }

        let contentElement = document.createElement("div");
        contentElement.innerHTML = '<div class="innerHTML"><h4>Want to place a marker?</h4>'+
            '<button id="add-new-marker">Yes</button></div>';

        let editElement = document.createElement("div");
        editElement.innerHTML = '<div class="innerHTML">' +
            '<br><h4>Style your marker</h4>' +
            '<input alt="image" type="image" src="../images/original-marker.png" name="marker" id="original-marker" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/exclamation-marker.png" name="marker" id="exclamation-marker" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/question-marker.png" name="marker" id="question-marker" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/x-marker.png" name="marker" id="x-marker" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/empty-marker.png" name="marker" id="empty-marker" /> ' + ' ' +
            '<br><h4>Color</h4>' +
            '<button id="blue-marker"> </button> ' +
            '<button id="green-marker"> </button> ' +
            '<button id="yellow-marker"> </button> ' +
            '<button id="purple-marker"> </button> ' +
            '<br><button id="black-marker"> </button> ' +
            '<button id="grey-marker"> </button> ' +
            '<button id="red-marker"> </button> ' +
            '<br><button id="delete-marker">delete</button>';


        editElement.addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') {
                marker.setIcon({
                    url: '../images/' + event.target.id + '.png',
                    size: new google.maps.Size(30, 38),
                    scaledSize: new google.maps.Size(30, 38)
                });
            }
        })

        editElement.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                marker.setIcon({
                        url: '../images/' + event.target.id + '.png',
                        size: new google.maps.Size(30, 38),
                        scaledSize: new google.maps.Size(30, 38)
                    });
            }
        })


        if (currentInfowindow && !addNewMarkerClicked) {
            infowindow = currentInfowindow;
            infowindow.setContent(contentElement);
        }
        else {
            infowindow = new google.maps.InfoWindow({
                content: contentElement
            });
            infowindow.open(map, marker);
            currentInfowindow = infowindow;
        }
        contentElement.addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                addNewMarkerClicked = true;

                editElement.addEventListener('click', function(event){
                    if (event.target.tagName === 'BUTTON' && event.target.id === 'delete-marker') {
                        marker.setMap(null);
                    }
                })
                infowindow.setContent(editElement);
            }
        });
        addNewMarkerClicked = false;
    }
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng);
    });

//Search bar function with autocomplete feature, marker added to location entered in the search bar.

    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    let markers = [];
    searchBox.addListener('places_changed', function() {
        let places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        let bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            let icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

}

