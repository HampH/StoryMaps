
let ZaffriModal = Vue.component('zaffri-modal', {
    template: "#zaffri-modal-template",
    props: ['data'],
    methods: {
        closeModal: function(action = null) {
            this.data.visible = false;
            console.log("Modal action = " + action);
        }
    }
});


let app = new Vue({
    el: "#app",
    data: {
        modalVisible: false,
        modalConfig: {
            visible: false,
            type: "confirm",
            title1: "Step title",
            title2: "Step description",
            confirmText: "OK",
            cancelText: "Cancel",
        }
    },
    methods: {
        openModal: function() {
            this.modalConfig.visible = true;
        }
    }


});


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
    let color = 'red';
    let type = 'original';

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
            marker.setIcon({
                url: '../images/' + color + '-' + type + '-marker.png',
                size: new google.maps.Size(30, 38),
                scaledSize: new google.maps.Size(30, 38)
            });
        }

        let contentElement = document.createElement("div");
        contentElement.innerHTML = '<div class="innerHTML"><h4>Want to place a marker?</h4>'+
            '<button id="add-new-marker">Yes</button></div>';

        let editElement = document.createElement("div");
        editElement.innerHTML = '<div class="innerHTML" style="text-align: center">' +
            '<br><h4 style="padding-top: 0; padding-left: 10px; padding-right: 10px; margin-top: 0;">Style your marker</h4>' +
            '<div class="marker-style"> ' +
            '<input alt="image" type="image" src="../images/black-original-marker.png" style="width: 30px; height:38px;" name="marker" id="original" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/black-exclamation-marker.png" style="width: 30px; height:38px;"  name="marker" id="exclamation" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/black-question-marker.png" style="width: 30px; height:38px;"  name="marker" id="question" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/black-x-marker.png" style="width: 30px; height:38px;"  name="marker" id="x" /> ' + ' ' +
            '<input alt="image" type="image" src="../images/black-empty-marker.png" style="width: 30px; height:38px;"  name="marker" id="empty" /></div> ' + ' ' +
            '<br><h4>Color</h4>' +
            '<div class="marker-colors">' +
            '<button id="blue"> </button> ' +
            '<button id="green"> </button> ' +
            '<button id="yellow"> </button> ' +
            '<button id="purple"> </button> ' +
            '<br><button id="black"> </button> ' +
            '<button id="grey"> </button> ' +
            '<button id="red"> </button></div>' +

            '<br><button id="delete-marker">delete</button>';

        editElement.querySelector('.marker-style').addEventListener('click', function(event) {
            if (event.target.tagName === 'INPUT') {
                type = event.target.id;

                marker.setIcon({
                    url: '../images/' + color + '-' + type + '-marker.png',
                    size: new google.maps.Size(30, 38),
                    scaledSize: new google.maps.Size(30, 38)
                });
                console.log(event.target.id);
            }
        })

        editElement.querySelector('.marker-colors').addEventListener('click', function(event) {
            if (event.target.tagName === 'BUTTON') {
                color = event.target.id;

                marker.setIcon({
                        url: '../images/' + color + '-' + type + '-marker.png',
                        size: new google.maps.Size(30, 38),
                        scaledSize: new google.maps.Size(30, 38)
                    });
                console.log(event.target.id);
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

