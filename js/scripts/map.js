let populationByCountry = d3.map();
let inflowByCountry = d3.map();

let worldMap = L.map('mapid', {
  minZoom: 2,
  maxZoom: 4
}).setView([25, 10], 2);

let geojson;

L.control.scale().addTo(worldMap);

let info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(props) {
  if (activeBtn == 0)
    data = {};
  else if (activeBtn == 1)
    data = {};
  // data = inflowData;
  else if (activeBtn == 2)
    data = {};
  // data = outflowData;

  let inflowTax = props && inflowByCountry.get(props.name) ? inflowByCountry.get(props.name) : -1;

  this._div.innerHTML = '<h3>Average flow</h3>' + (props ?
    '<b>' + props.name + '</b><br />' + inflowTax + ' inflows' :
    'Hover over a country');
};

info.addTo(worldMap);

let domain = [0, 1000, 5000, 10000, 12000, 15000, 18000],
  brewerColors = colorbrewer.OrRd[7];

let quantize = d3.scale.quantile()
  .domain(domain)
  .range(brewerColors);

function style(features) {
  let colorToFill;

  if (activeBtn == 0) {
    colorToFill = '#FFFFFF';
  } else if (activeBtn == 1) {
    colorToFill = quantize(inflowByCountry.get(features.properties.name));
  } else if (activeBtn == 2) {
    // colorToFill = quantize(outflowByCountry.get(features.properties.name));
    colorToFill = brewerColors[0];
  }
  return {
    fillColor: colorToFill,
    weight: 2,
    opacity: 1,
    color: '#969E95',
    dashArray: '3',
    fillOpacity: 0.8
  };
}

function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    weight: 2,
    opacity: 1,
    color: '#969E95',
    dashArray: '3',
    fillOpacity: 0.8
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

function zoomToFeature(e) {
  worldMap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });

  layer.on("click", function(e) {
    zoomToFeature(e);
  });
}

function loadMap() {
  geojson = L.geoJson(worldData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(worldMap);
}

d3.csv("data/worldPopulation.csv", function(data) {
  data.forEach(p => populationByCountry.set(p.countryName, +p.population2015));
});

d3.csv("data/inflow_country.csv", function(data) {
  data.forEach(function(d) {
    let pop = populationByCountry.get(d.Country);
    let tax = pop > 0 ? 100000 * d.inflow2015 / pop : 0;

    tax = Math.round(tax);
    inflowByCountry.set(d.Country, tax);
  });

  loadMap();
});

let legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function(map) {

  let div = L.DomUtil.create('div', 'info legend'),
    labels = [],
    n = brewerColors.length,
    from, to;

  for (let i = 0; i < n; i++) {
    let c = brewerColors[i];
    let fromto = [domain[i], domain[i + 1]];
    labels.push(
      '<i style="background:' + brewerColors[i] + '"></i> ' +
      d3.round(fromto[0]) + (d3.round(fromto[1]) ? '&ndash;' + d3.round(fromto[1]) : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(worldMap);
