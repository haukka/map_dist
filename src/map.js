$(document).ready(function(){

    var time = 0;
    var distance = 0;
    var map;

    function	create_map(lat, lng) {
	map = new GMaps({
            div: '#mapCanvas',
            lat: lat,
            lng: lng,
            zoom: 12,
	    width: '500px',
	    height: '500px'
	});
    }

    function	def_time_and_dist(event){
	var i = 0;
	var elem = event[0];
	while(i < elem.legs.length) {
	    var tmp = elem.legs[i];
            time += tmp.duration.value;
            distance += tmp.distance.value;
	    i++;
	}
    }

    function	format_hour(seconds) {
	var hour = Math.floor(seconds / 3600);
	var min = Math.floor(seconds / 60) % 60;
	var sec = Math.floor(seconds) % 60;
	if (hour < 10)
	    hour = "0" + hour;
	if (min < 10)
	    min = "0" + min;
	if (sec < 10)
	    sec = "0" + sec;
	return (hour + " h "+ min + " min " + sec + " sec");
    }

    create_map(0, 0);
    $("#create_map").click(function(e) {
	e.preventDefault();
	time = 0;
	distance = 0;
	var pos_src;
	var pos_dest;
	var mode = $('select[name=transport]').val();
	GMaps.geocode({
            address: $('#src').val(),
            callback: function (res, status) {
		console.log(res);
		if (status == 'OK') {
                    pos_src = res[0].geometry.location;
                    GMaps.geocode({
			address: $('#dest').val(),
			callback: function (res2, status) {
                            if (status == 'OK') {
				pos_dest = res2[0].geometry.location;
				create_map(pos_src.lat(), pos_src.lng());
				map.drawRoute({
                                    origin: [pos_src.lat(), pos_src.lng()],
                                    destination: [pos_dest.lat(), pos_dest.lng()],
                                    strokeColor: '#0000FF',
				    travelMode: mode,
                                    strokeOpacity: 0.8,
                                    strokeWeight: 9
				});
				map.getRoutes({
                                    origin: [pos_src.lat(), pos_src.lng()],
                                    travelMode: mode,
                                    destination: [pos_dest.lat(), pos_dest.lng()],
                                    callback: function (event) {
					def_time_and_dist(event);
					$('#hour').text(format_hour(time));
					$('#distance').text(distance + ' metres');
                                    }
				});
			    }
			}
                    });
		}
            }
	});
    });
});
