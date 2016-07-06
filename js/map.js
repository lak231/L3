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
        zoom: 15
    });

    $.getJSON("pubs.json", function(data) {
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
                            '<i class="material-icons"> link </i>' + ' ' + '<a href="https://www.' + data.samples[i].contacts[2] + '">' +  data.samples[i].contacts[2] + '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="iw-tags">';
                for (j = 0; j <data.samples[i].tags.length; j++) {
                    myString += '<span style="background-color: #e76124; color: #eeeff7; padding-top: .2em; padding-left: .4em; padding-bottom: .2em; padding-right: .4em;">' + data.samples[i].tags[j] + '</span>' + " ";
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

/*
$(document).ready(function () {
    $('div.tags').find('input:checkbox').on('click', function () {
        $('div.tags').find('input:checked').each(function () {
            if (infoWindow.category[0] == $(this).attr('rel')) {
                marker.setVisible(true);
            }
            else {
                marker.setVisible(false);
            }
        });
    });
});
*/

/*
 * Accordation
 */
for (k = 0; k < acc.length; k++) {
    acc[k].onclick = function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}

/*
 * Search for titles (tags and authors)
 */
function search () {
    infoWindow.close();
    var input = document.getElementById("aSearch").value;
    console.log(input.length);
    if (input.length > 0) {
        for (i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
            if (markers[i].title.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setVisible(true);
            }
            if (markers[i].researchers.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                markers[i].setVisible(true);
            }
            for (j = 0; j < markers[i].tags.length; j++) {
                if (markers[i].tags[j].toLowerCase().indexOf(input.toLowerCase()) > -1) {
                    markers[i].setVisible(true);
                }
            }
        }
    }
}

function resetSearch() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
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