var map;
var markers = [];
var infoWindow = new google.maps.InfoWindow({content: ""});
var bucknell = new google.maps.LatLng(40.955384, -76.884941);
var acc = document.getElementsByClassName("accordion");

/*
 * Initiate map, markers and infoWindow
 */
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: bucknell,
        zoom: 16
    });

    $.getJSON("projects.json", function(data) {
        for (i = 0; i < data.samples.length; i++) {
            var content = (function () {myString = '<div id="iw-container">' +
                '<div class="iw-header">' +
                    '<div class="iw-image"> <img src="image/test-image.jpg"> </div>' +
                    '<div class="iw-header-text">' +
                        '<div class="iw-title">' + data.samples[i].title + '</div>' +
                        '<div class="iw-researchers">' + data.samples[i].researchers +  '</div>' +
                    '</div>' +
                '</div>' +
                '<div class = "iw-content"> ' +
                    '<div class="iw-summary">' +
                        '<div class="iw-subtitle"> Summary </div>' +
                        '<div class="iw-content-text">' + data.samples[i].summary + '</div>' +
                    '</div>' +

                    '<div class="iw-contacts">' +
                        '<div class="iw-subtitle"> Contacts</div>' +
                        '<div class="iw-content-text">'  +
                            '<i class="material-icons" > person </i>' + ' ' + data.samples[i].contacts[0] + '<br>' +
                            '<i class="material-icons"> email </i>' + ' ' + '<a href="mailto:' + data.samples[i].contacts[1] + '">' +  data.samples[i].contacts[1] + '</a> <br>' +
                            '<i class="material-icons"> link </i>' + ' ' + '<a href="' + data.samples[i].contacts[2] + '">' +  data.samples[i].contacts[2] + '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="iw-tags">';
                for (j = 0; j <data.samples[i].tags.length; j++) {
                    myString += '<span style="background-color: #e76124; color: #eeeff7; padding-top: .2em; padding-left: .4em; padding-bottom: .2em; padding-right: .4em; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;">' + data.samples[i].tags[j] + '</span>' + " ";
                }
                myString += '</divi> </div>';
                return myString;})();

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.samples[i].lat, data.samples[i].long),
                title: data.samples[i].title,
                tags: data.samples[i].tags,
                researchers: data.samples[i].researchers
            });

            marker.setMap(map);

            google.maps.event.addListener(marker, 'click', (function (marker, content, infoWindow) {
                return function () {
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                };
            })(marker, content, infoWindow));

            markers.push(marker);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function () {
    $("#searchIcon").on('click', function () {
        search();
    })
});


/*
 * Search for titles (tags and authors)
 */
function search () {
    infoWindow.close();
    var input = document.getElementById("aSearch").value;
    if (input.length > 0) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setOpacity(0.4);
            if (markers[i].title.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setOpacity(1);
            }
            if (markers[i].researchers.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setOpacity(1);
            }
            for (j = 0; j < markers[i].tags.length; j++) {
                if (markers[i].tags[j].toLowerCase().indexOf(input.toLowerCase()) > -1) {
                    markers[i].setOpacity(1);
                }
            }
        }
    }
}

function handle(event) {
    if (event.keyCode === 13)  {
        search();
    }
}

/*
 * Always focus on the map
 */
$("map").on('blur', function () {
    setTimeout(function () {
        this.focus();
    }, 0);
});