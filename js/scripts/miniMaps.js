let geojson2;
let map;

function selectInflowData(features, year) {
  var data;
  switch (year) {
    case 1990:
      data = inflow1990ByCountry.get(features.properties.name);
      break;
    case 1995:
      data = inflow1995ByCountry.get(features.properties.name);
      break;
    case 2000:
      data = inflow2000ByCountry.get(features.properties.name);
      break;
    case 2005:
      data = inflow2005ByCountry.get(features.properties.name);
      break;
    case 2010:
      data = inflow2010ByCountry.get(features.properties.name);
      break;
    case 2015:
      data = inflow2015ByCountry.get(features.properties.name);
      break;
  }

  return data;
}

function selectOutflowData(features, year) {
  var data;
  switch (year) {
    case 1990:
      data = outflow1990ByCountry.get(features.properties.name);
      break;
    case 1995:
      data = outflow1995ByCountry.get(features.properties.name);
      break;
    case 2000:
      data = outflow2000ByCountry.get(features.properties.name);
      break;
    case 2005:
      data = outflow2005ByCountry.get(features.properties.name);
      break;
    case 2010:
      data = outflow2010ByCountry.get(features.properties.name);
      break;
    case 2015:
      data = outflow2015ByCountry.get(features.properties.name);
      break;
  }

  return data;
}

function loadMiniMap(map, year) {
  geojson2 = L.geoJson(worldData, {
    style: function(features) {
      let dataByCountry;

      if (activeBtn == 0) {
        dataByCountry = undefined;
      } else if (activeBtn == 1) {
        dataByCountry = selectInflowData(features, year);
      } else if (activeBtn == 2) {
        dataByCountry = selectOutflowData(features, year);
      }
      return {
        fillColor: dataByCountry ? quantize(dataByCountry) : '#FFFFFF',
        weight: 2,
        opacity: 1,
        color: '#969E95',
        dashArray: '3',
        fillOpacity: 1
      };
    }
  }).addTo(map);
}

function createMiniMap(id, continent, year) {
  let chosen;
  for (let c in lista_continentes) {
    if (lista_continentes[c].name == continent) {
      chosen = lista_continentes[c];
    }
  }

  map = L.map(id, {
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    boxZoom: false,
    zoomControl: false,
    keyboard: false,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    dragging: false
  }).setView([chosen.lat, chosen.long], chosen.zoom);

  loadMiniMap(map, year);
  return map;
}

function initMinimaps(continent) {
  map_1990 = createMiniMap('map_1990', continent, 1990);
  map_1995 = createMiniMap('map_1995', continent, 1995);
  map_2000 = createMiniMap('map_2000', continent, 2000);
  map_2005 = createMiniMap('map_2005', continent, 2005);
  map_2010 = createMiniMap('map_2010', continent, 2010);
  map_2015 = createMiniMap('map_2015', continent, 2015);
}

var chosenContinent = "southAmerica"; //set default

function redrawMinimaps(continent) {
  map_1990.remove();
  map_1995.remove();
  map_2000.remove();
  map_2005.remove();
  map_2010.remove();
  map_2015.remove();

  initMinimaps(continent);
}

initMinimaps(chosenContinent);

function showAllTooltip(country, x, y) {
  d3.select("#tooltip")
    .style("left", x + "px")
    .style("top", y + "px")
    .select("#rate")
    .text(inflow2015ByCountry.get(country));
  d3.select("#tooltip")
    .select("#name")
    .text(country);
  d3.select("#tooltip")
    .classed("hidden", false);
}

function hideAllTooltip() {
  d3.select("#tooltip")
    .classed("hidden", true);
}
