var map;
var markers = [];
var sortedTags = [];
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
                    '<div class="iw-image"> <img style="max-width: 100%; max-height: 100%;" src="' + data.samples[i].image + '"> </div>' +
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
                            '<i class="material-icons"> email </i>' + ' ' + '<a href="mailto:' + data.samples[i].contacts[1] + '">' +  data.samples[i].contacts[0] + '</a> <br>' +
                            '<i class="material-icons"> link </i>' + ' ' + '<a href="' + data.samples[i].links[1] + '">' +  data.samples[i].links[0] + '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="iw-tags">';
                for (j = 0; j <data.samples[i].tags.length; j++) {
                    myString += '<a href="#" class="tags" onclick="searchTags(\'' + data.samples[i].tags[j] + '\')">' + data.samples[i].tags[j] + '</a>' + " ";
                    sortedTags.push(data.samples[i].tags[j]);
                }
                myString += '</divi> </div>';
                return myString;})();

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.samples[i].lat, data.samples[i].long),
                title: data.samples[i].title,
                tags: data.samples[i].tags,
                researchers: data.samples[i].researchers,
                contacts: data.samples[i].contacts
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

        var myString = '';
        var current = "5dPubGOsxiJZB2sea4JK"; //random string
        sortedTags.sort();
        for (i = 0; i < sortedTags.length; i++) {
            if (sortedTags[i].indexOf(current) == -1) {
                current = sortedTags[i];
                myString += '<a href="#" class="tags" onclick="searchTags(\'' + sortedTags[i] + '\')">' + sortedTags[i] + '</a>' + " ";
            }
        }
        document.getElementById("popularTags").innerHTML = myString;
    });
}

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function () {
    $("#searchIcon").on('click', function () {
        search();
    })
});


function searchTags(input) {
    document.getElementById("aSearch").value = input;
    search();
}

/*
 * Search for titles (tags and authors)
 */
function search () {
    infoWindow.close();
    var input = document.getElementById("aSearch").value;
    if (input.length > 0) {
        for (i = 0; i < markers.length; i++) {
            console.log(markers[i].contacts[0]);
            markers[i].setOpacity(0.4);
            if (markers[i].title.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setOpacity(1);
            }
            for (j = 0; j < markers[i].researchers.length; j++) {
                if (markers[i].researchers[j].toLowerCase().indexOf(input.toLowerCase()) > -1) {
                    markers[i].setOpacity(1);
                }
            }
            if (markers[i].contacts[0].toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setOpacity(1);
            }
            for (k = 0; k < markers[i].tags.length; k++) {
                if (markers[i].tags[k].toLowerCase().indexOf(input.toLowerCase()) > -1) {
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