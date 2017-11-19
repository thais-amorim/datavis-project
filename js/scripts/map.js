let map = L.map('mapid', {
                minZoom:2,
                maxZoom:4
                }).setView([25, 10], 2);
let geojson;

L.control.scale().addTo(map);

function style(feature) {
	/*if(activeBtn == 0)
		*/return {
			fillColor: '#FFFFFF',
			weight: 2,
			opacity: 1,
			color: '#969E95',
			dashArray: '3',
			fillOpacity: 1.0
		};/*
	else if(activeBtn == 1)
		data = softwareEngineerData;
	else if(activeBtn == 2)
		data = webDeveloperData;
	else if(activeBtn == 3)
		data = dataAnalystData;
	else if(activeBtn == 4)
		data = networkEngineerData;

	var salary = data[feature.properties.name] ? parseFloat(data[feature.properties.name]) : -1;

	return {
		fillColor: getColor(salary),
		weight: 2,
		opacity: 1,
		color: '#969E95',
		dashArray: '3',
		fillOpacity: 1.0
	};*/
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#7A8079',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});

	layer.on("click", function(e){
		console.log(feature.properties.name); // botao que tu quiser
		zoomToFeature(e);
	});
}

function loadMap() {
	geojson = L.geoJson(worldData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
}

loadMap();
let primaryType = ["Homicide","Robbery","Burglary"],
      colors 		= ["#EF793E", "#31659B", "#299F78"],
  	colorScale 	= d3.scale.ordinal().domain(primaryType).range(colors);

let legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
  	let div = L.DomUtil.create('div', 'info legend');

    for (i in primaryType) {
    	let row 	= L.DomUtil.create('div','type'),
			circle 	= L.DomUtil.create('div','circle'),
			text 	= L.DomUtil.create('span');

		circle.style.backgroundColor = colors[i];
		text.textContent = primaryType[i];
		row.append(circle);
		row.append(text);

        div.append(row);
    }
    return div;
}
//legend.addTo(map);

      function toTitleCase(str){
      	return str.split(' ')
   			.map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
   			.join(' ');
      }

  d3.csv("Crimes_Chicago_Sep2017.csv", function (data) {
      let dtgFormat 		= d3.time.format.utc("%m/%d/%Y %H:%M:%S"),
      	dateFormat		= d3.time.format("%m/%d/%Y"),
      	timeFormat		= d3.time.format("%I:%M %p"),
      	dayNameFormat	= d3.time.format("%A");

    	data.forEach(function(d){
      	d.latitude      = +d.Latitude;
      	d.longitude     = +d.Longitude;
      	d.date 			= dtgFormat.parse(d.Date.substr(0,19));
	d.type			= toTitleCase(d["Primary Type"]);
	d.location      = toTitleCase(d["Location Description"]);
	d.description   = toTitleCase(d.Description);
    	});
    	let facts = crossfilter(data);

    	let typeDimension 		= facts.dimension(d => d.type),
    		timeDimension 		= facts.dimension(d => d.Date),
			  		typeByDayDimension 	= facts.dimension(d => [d.type,d3.time.day(d.date)]);

			  	let typeGroup 		= typeDimension.group(),
			  		typeByDayGroup 	= typeByDayDimension.group();

			  	let typesOrdered = typeGroup.top(Infinity).map(d => d.key);

let popupText;

  	data.forEach(function(d){
      	let circle = L.circle([d.latitude, d.longitude], 100, {
	color: colorScale(d.type),
	weight: 2,
	fillColor: colorScale(d.type),
	fillOpacity: 0.5})
	.addTo(map);

	popupText = "Crime Type: "+d.type+"<br>"
+"Date: "+dateFormat(d.date)+" ("+dayNameFormat(d.date)+")<br>"
+"Time: "+timeFormat(d.date)+"<br>"
+"Location: "+d.location+"<br>"
+d.description+"<br>";

      	circle.bindPopup(popupText);
  	});
  });
