// let smallMaps = [
//   L.map('map_1990'),
//   L.map('map_1995'),
//   L.map('map_2000'),
//   L.map('map_2005'),
//   L.map('map_2010'),
//   L.map('map_2015')
//
// ]
//
//
// let geojson2;
// smallMap.scrollWheelZoom.disable();
//
// function style(features) {
//   let dataByCountry;
//
//   if (continentBtn == "") {
//     dataByCountry = undefined;
//   } else if (continentBtn == "asiaBtn") {
//     dataByCountry = inflow2015ByCountry.get(features.properties.name);
//   } else if (continentBtn == "africaBtn") {
//     dataByCountry = outflow2015ByCountry.get(features.properties.name);
//   }
//   return {
//     fillColor: dataByCountry ? quantize(dataByCountry) : '#FFFFFF',
//     weight: 2,
//     opacity: 1,
//     color: '#969E95',
//     dashArray: '3',
//     fillOpacity: 1
//   };
// }
//
// function highlightFeature(e) {
//   let layer = e.target;
//
//   layer.setStyle({
//     weight: 3,
//     opacity: 1,
//     color: '#818780',
//     dashArray: '1',
//     fillOpacity: 1
//   });
//
//   if (!L.Browser.ie && !L.Browser.opera) {
//     layer.bringToFront();
//   }
//
//   info.update(layer.feature.properties);
// }
//
// function resetHighlight(e) {
//   geojson2.resetStyle(e.target);
//   info.update();
// }
//
// function loadSmallMap() {
// console.log("csdcscs");
//   geojson2 = L.geoJson(worldData, {
//     style: style,
//     onEachFeature: onEachFeature
//   }).addTo(smallMap);
// }
//
// loadSmallMap();

let geojson2, map;

// let smallMap = L.map('map_1990', {
//   scrollWheelZoom: false,
//   doubleClickZoom: false,
//   touchZoom: false,
//   boxZoom: false,
//   zoomControl: false,
//   keyboard: false,
//   dragging: false
//
// }).setView([25, 10], 2);

function style2(features) {
  return {
    fillColor: '#FFFFFF',
    weight: 2,
    opacity: 1,
    color: '#969E95',
    dashArray: '3',
    fillOpacity: 1
  };
}

function loadMiniMap(map) {
  geojson2 = L.geoJson(worldData).addTo(map);
}

function createMiniMap(id, continent) {
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

  loadMiniMap(map);
}

createMiniMap('map_1990', "southAmerica");
createMiniMap('map_1995', "northAmerica");
createMiniMap('map_2000', "asia");
createMiniMap('map_2005', "europe");
createMiniMap('map_2010', "oceania");
createMiniMap('map_2015', "africa");
