﻿var map;
var markers = [];
var sortedTags = [];
var infoWindow = new google.maps.InfoWindow({content: ""});
var bucknell = new google.maps.LatLng(40.955384, -76.884941);
var json = "https://drive.google.com/uc?export=download&id=0B01XgsZSqU8GRFVRZVl1bnJDTk0"

/*
 * Initiate map, markers and infoWindow
 */
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: bucknell,
        zoom: 15
    });

    $.getJSON(json, function(data) {
        for (i = 0; i < data.samples.length; i++) {
            var content = (function () {myString = '<div id="iw-container">' +
                '<div class="iw-header">' +
                    '<div class="iw-image">';
                    if (data.samples[i].image === "") {
                        myString += '<img style="max-width: 100%; max-height: 100%;" src="image/logo.png">';
                    } else {
                        myString += '<img style="max-width: 100%; max-height: 100%;" src="' + data.samples[i].image + '">';
                    }
                    myString += '</div>' + //image
                    '<div class="iw-header-text">' +
                        '<div class="iw-title">' + data.samples[i].title + '</div>' +
                        '<div class="iw-tags">';
                        for (j = 0; j < data.samples[i].tags.length; j++) {
                            myString += '<a class="tags in" onclick="searchTags(\'' + data.samples[i].tags[j] + '\')">' + data.samples[i].tags[j] + '</a>' + " ";
                            sortedTags.push(data.samples[i].tags[j]);
                        }
                        myString += '</div>' + //tags
                        '<div class="iw-researchers">';
                        for (k = 0; k < data.samples[i].researchers.length; k++) {
                            if (k < data.samples[i].researchers.length - 1) {
                                myString += '<a href="#" class="iw-researchers-link" onclick="searchTags(\'' + data.samples[i].researchers[k] + '\')">' + data.samples[i].researchers[k] + '</a>' + ", ";
                            } else {
                                myString += '<a href="#" class="iw-researchers-link" onclick="searchTags(\'' + data.samples[i].researchers[k] + '\')">' + data.samples[i].researchers[k] + '</a>';
                            }
                        }
                        myString +=
                        '</div>' + //researchers
                    '</div>' + //header-text
                '</div>' + //header
                '<div class = "iw-content"> ' +
                    '<div class="iw-summary">' +
                        '<div class="iw-content-text">' + data.samples[i].summary + '</div>' +
                    '</div>' +

                    '<div class="iw-contacts">' +
                        '<div class="iw-content-text">';
                                if (data.samples[i].contacts.length == 1) {
                                    myString += '<a class="iw-icon" href="mailto:' + data.samples[i].contacts[0] + '"><i class="material-icons iw"> email </i></a>' + ' Email <br>';
                                } else {
                                    myString += '<a class="iw-icon" href="mailto:' + data.samples[i].contacts[1] + '"><i class="material-icons iw"> email </i></a>' + ' ' +  data.samples[i].contacts[0] + '<br>';
                                }
                                if (data.samples[i].links.length == 1) {
                                    myString += '<a class="iw-icon" target="_blank" href="' + data.samples[i].links[0] + '"><i class="material-icons iw"> link </i></a>' +  ' Link';
                                } else {
                                    myString += '<a class="iw-icon" target="_blank" href="' + data.samples[i].links[1] + '"><i class="material-icons iw"> link </i></a>' +  ' ' + data.samples[i].links[0];
                                    }
                        myString +=
                        '</div>' +
                    '</div>' +
                '</div> </div>';
                return myString;})();

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.samples[i].location[0], data.samples[i].location[1]),
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
                myString += '<a class="tags out" onclick="searchTags(\'' + sortedTags[i] + '\')">' + sortedTags[i] + '</a>' + " ";
            }
        }
        document.getElementById("popularTags").innerHTML = myString;
    });
}

google.maps.event.addDomListener(window, 'load', initialize);



$(document).ready(function () {
    $("#searchIcon").on('click', function () {
        search();
    });
    $("#sidepanel-toggle").on('click', function () {
        toggleSidePanel();
    });
});

function toggleSidePanel () {
    if($("#sidepanel").hasClass('active')) {
        $("#sidepanel").removeClass('active');
    } else {
        $("#sidepanel").addClass('active');
    }
}

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

$(document).keyup(function(e) {
    if (e.keyCode === 27) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setOpacity(1);
        }
        document.getElementById("aSearch").value = "";
        toggleSidePanel();
    }
});

/*
 * Always focus on the map
 */
$("map").on('blur', function () {
    setTimeout(function () {
        this.focus();
    }, 0);
});