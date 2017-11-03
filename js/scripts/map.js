let map = L.map('mapid').setView([11.3243433, 0.716431], 3);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  minZoom: 2,
  maxZoom: 16})
  .addTo(map);
	
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