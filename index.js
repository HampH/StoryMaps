Vue.component('modal', {
    template: '#modal-template'
});

new Vue({
    el: '#app',
    data: {
        activeIndex: null,
        editIndex: null,
        showModal: false,
        openModal: false,
        steps: [],
        step: {title: "", description: ""}
        },

    methods:
        {
            edit(idx) {
                this.showModal = true;
                this.step.title = this.steps[idx].title;
                this.step.description = this.steps[idx].description;
                this.editIndex = idx;
            },

            toggle(index) {
                this.activeIndex = index
            },

            addNewStep() {
                if (this.editIndex === null) {
                    this.steps.push(this.step);
                } else {
                    this.steps[this.editIndex] = this.step;
                }
                this.showModal = false;
                this.step = {};
                this.editIndex = null;
            },

            cancelModal() {
                this.step = {};
                this.showModal = false;
                this.editIndex = null;
            }
        }
});

//Map initialization
function initMap() {
    let map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50, lng: 1},
        zoom: 4,
        mapTypeControl: false,
        streetViewControl: false,
        draggableCursor: 'crosshair',
        draggingCursor: 'move',
        disableDefaultUI: true,
        zoomControl: true,
        panControl: false,
    });
    let currentMarker;
    let currentInfowindow;
    let addNewMarkerClicked = false;
    let color = 'red';
    let type = 'original';

    function placeMarker(location) {
        console.log("placeMarker");
        let marker;
        let infowindow = new google.maps.InfoWindow();
        if (currentMarker && !addNewMarkerClicked) {
            marker = currentMarker;
            marker.setPosition(location);

        } else {
            marker = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true
            });
            currentMarker = marker;
            marker.setIcon({
                url: 'images/' + color + '-' + type + '-marker.png',
                size: new google.maps.Size(30, 38),
                scaledSize: new google.maps.Size(30, 38),
            });
        }
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
            infowindow.setPosition(event.latLng);

        });

        let contentElement = document.createElement("div");
        contentElement.innerHTML = '<div class="innerHTML"><h4>Want to place a marker?</h4>' + '' +
            '' + '<div class="yes-no-buttons"><button id="add-new-marker">YES</button>' + '' +
            '' + '<button id="delete-new-marker">NO</button></div></div>';
        let editElement = document.createElement("div");
        editElement.innerHTML = '<div class="innerHTML">' +
            '<h4 style=" font-size:10px; padding:2px; margin: 0;  text-align: left">' +
            'Latitude:' + marker.getPosition().lat().toFixed(2) + '</h4>' +
            '<h4 style="font-size: 10px; padding:2px; margin: 0;  text-align: left">' +
            'Longitude:' + marker.getPosition().lng().toFixed(2) + '</h4>' +

            '<br><h4 style="padding:0; margin: 0; text-align: left;">Marker</h4>' +
            '<div class="marker-style"> ' +
            '<input alt="image" type="image" src="images/black-original-marker.png" style="width:17px; height:23px; padding: 0; margin: 0;" name="marker" id="original" /> ' + ' ' +
            '<input alt="image" type="image" src="images/black-exclamation-marker.png" style="width:17px; height:23px;"  name="marker" id="exclamation" /> ' + ' ' +
            '<input alt="image" type="image" src="images/black-question-marker.png" style="width:17px; height:23px;"  name="marker" id="question" /> ' + ' ' +
            '<input alt="image" type="image" src="images/black-x-marker.png" style="width:17px; height:23px;"  name="marker" id="x" /> ' + ' ' +
            '<input alt="image" type="image" src="images/black-empty-marker.png" style="width:17px; height:23px; margin-bottom: 0; padding-bottom: 0;"  name="marker" id="empty" /></div> ' + ' ' +
            '<br><h4 style="text-align: left; margin: 0; padding: 0;">Color</h4>' +
            '<div class="marker-colors">' +
            '<button style="padding: 0; margin: 0;" id="blue"> </button> ' +
            '<button style="padding: 0; margin: 0;" id="green"> </button> ' +
            '<button style="padding: 0; margin: 0;" id="yellow"> </button> ' +
            '<button style="padding: 0; margin: 0;" id="purple"> </button> ' +
            '<button style="padding: 0; margin: 0;" id="black"> </button> ' +
            '<button style="padding: 0; margin: 0;" id="grey"> </button> ' +
            '<button id="red"> </button></div>' +
            '<br><button style="margin: 0; padding:0;" id="delete-marker">delete</button>';

        editElement.querySelector('.marker-style').addEventListener('click', function (event) {
            if (event.target.tagName === 'INPUT') {
                type = event.target.id;
                marker.setIcon({
                    url: 'images/' + color + '-' + type + '-marker.png',
                    size: new google.maps.Size(30, 38),
                    scaledSize: new google.maps.Size(30, 38)
                });
            }
        });

        editElement.querySelector('.marker-colors').addEventListener('click', function (event) {
            if (event.target.tagName === 'BUTTON') {
                color = event.target.id;
                marker.setIcon({
                    url: 'images/' + color + '-' + type + '-marker.png',
                    size: new google.maps.Size(30, 38),
                    scaledSize: new google.maps.Size(30, 38)
                });
            }
        });

        if (currentInfowindow && !addNewMarkerClicked) {
            infowindow = currentInfowindow;
            infowindow.setContent(contentElement);
        } else {
            infowindow = new google.maps.InfoWindow({
                content: contentElement,

            });
            infowindow.open(map, marker);
            currentInfowindow = infowindow;
        }
        contentElement.querySelector('.yes-no-buttons').addEventListener('click', function (event){
            if (event.target.id === 'delete-new-marker') {
                marker.setMap(null);
                addNewMarkerClicked = true;
            }
            if (event.target.id === 'add-new-marker') {
                addNewMarkerClicked = true;
            }
            editElement.addEventListener('click', function (event) {
                if (event.target.tagName === 'BUTTON' && event.target.id === 'delete-marker') {
                    marker.setMap(null);
                    marker = null;
                    addNewMarkerClicked = true;
                }
            });
            infowindow.setContent(editElement);

        });
        addNewMarkerClicked = false;
    }
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng);
    });


//Search bar function with autocomplete feature, marker with title added to location entered in the search bar.
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener('places_changed', function () {
        let places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }
        let bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            console.log(place);

            placeMarker(place.geometry.location);

            if (place.geometry.location) {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
google.maps.event.addDomListener.window.load(initMap());
