var population1990ByCountry = d3.map();
var population1995ByCountry = d3.map();
var population2000ByCountry = d3.map();
var population2005ByCountry = d3.map();
var population2010ByCountry = d3.map();
var population2015ByCountry = d3.map();

var inflow1990ByCountry = d3.map();
var inflow1995ByCountry = d3.map();
var inflow2000ByCountry = d3.map();
var inflow2005ByCountry = d3.map();
var inflow2010ByCountry = d3.map();
var inflow2015ByCountry = d3.map();

var outflow1990ByCountry = d3.map();
var outflow1995ByCountry = d3.map();
var outflow2000ByCountry = d3.map();
var outflow2005ByCountry = d3.map();
var outflow2010ByCountry = d3.map();
var outflow2015ByCountry = d3.map();

let geojson;

let worldMap = L.map('mapid', {
  minZoom: 2,
  maxZoom: 4,
  scrollWheelZoom: false,
  zoomControl: false
}).setView([25, 10], 2);

// worldMap.scrollWheelZoom.disable();
let zoomHome = L.Control.zoomHome();
zoomHome.addTo(worldMap);

L.control.scale().addTo(worldMap);

let info = L.control();

info.onAdd = function(map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

info.update = function(properties) {
  if (activeBtn == 0)
    data = undefined;
  else if (activeBtn == 1)
    data = properties === undefined ? -1 : inflow2015ByCountry.get(properties.name);
  else if (activeBtn == 2)
    data = properties === undefined ? -1 : outflow2015ByCountry.get(properties.name);

  let flowTax = properties && data ? data.toLocaleString('en-US') + " flows per 100,000 locals" : "Data unavailable";
  this._div.innerHTML = '<h3>Average flow (2015)</h3>' + (properties ?
    '<b>' + properties.name + '</b><br />' + flowTax :
    'Hover over a country');
};

info.addTo(worldMap);

let domain = [0, 1000, 5000, 10000, 12000, 15000, 20000, 30000],
  brewerColors = colorbrewer.OrRd[7];

let quantize = d3.scale.quantile()
  .domain(domain)
  .range(brewerColors);

function style(features) {
  let dataByCountry;

  if (activeBtn == 0) {
    dataByCountry = undefined;
  } else if (activeBtn == 1) {
    dataByCountry = inflow2015ByCountry.get(features.properties.name);
  } else if (activeBtn == 2) {
    dataByCountry = outflow2015ByCountry.get(features.properties.name);
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

function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    weight: 3,
    opacity: 1,
    color: '#585b58',
    dashArray: '1',
    fillOpacity: 1
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
}

function loadMap() {
  geojson = L.geoJson(worldData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(worldMap);
}

function calculateRate(country, flow, year) {
  let pop;

  switch(year) {
    case 1990:
      pop = population1990ByCountry.get(country);
      break;
    case 1995:
      pop = population1995ByCountry.get(country);
      break;
    case 2000:
      pop = population2000ByCountry.get(country);
      break;
    case 2005:
      pop = population2005ByCountry.get(country);
      break;
    case 2010:
      pop = population2010ByCountry.get(country);
      break;
    case 2015:
      pop = population2015ByCountry.get(country);
      break;
  }
  let rate = pop > 0 ? 100000 * flow / pop : 0;

  return Math.round(rate);
}

d3.csv("data/worldPopulation.csv", function(data) {
  data.forEach(function(p) {
    population1990ByCountry.set(p.countryName, +p.population1990);
    population1995ByCountry.set(p.countryName, +p.population1995);
    population2000ByCountry.set(p.countryName, +p.population2000);
    population2005ByCountry.set(p.countryName, +p.population2005);
    population2010ByCountry.set(p.countryName, +p.population2010);
    population2015ByCountry.set(p.countryName, +p.population2015);
  });
});

d3.csv("data/inflow_country.csv", function(data) {
  data.forEach(function(d) {
    inflow1990ByCountry.set(d.country, calculateRate(d.country, +d.inflow1990, 1990));
    inflow1995ByCountry.set(d.country, calculateRate(d.country, +d.inflow1995, 1995));
    inflow2000ByCountry.set(d.country, calculateRate(d.country, +d.inflow2000, 2000));
    inflow2005ByCountry.set(d.country, calculateRate(d.country, +d.inflow2005, 2005));
    inflow2010ByCountry.set(d.country, calculateRate(d.country, +d.inflow2010, 2010));
    inflow2015ByCountry.set(d.country, calculateRate(d.country, +d.inflow2015, 2015));
  });
});
d3.csv("data/outflow_country.csv", function(data) {
  data.forEach(function(d) {
    outflow1990ByCountry.set(d.country, calculateRate(d.country, +d.outflow1990, 1990));
    outflow1995ByCountry.set(d.country, calculateRate(d.country, +d.outflow1995, 1995));
    outflow2000ByCountry.set(d.country, calculateRate(d.country, +d.outflow2000, 2000));
    outflow2005ByCountry.set(d.country, calculateRate(d.country, +d.outflow2005, 2005));
    outflow2010ByCountry.set(d.country, calculateRate(d.country, +d.outflow2010, 2010));
    outflow2015ByCountry.set(d.country, calculateRate(d.country, +d.outflow2015, 2015));
  });
});

loadMap();

let legend = L.control({
  position: 'bottomright'
});

legend.onAdd = function(map) {
  let div = L.DomUtil.create('div', 'info legend'),
    labels = [],
    n = brewerColors.length,
    from, to;

  for (let i = 0; i < n; i++) {
    let fromto = [domain[i], domain[i + 1]];
    labels.push(
      '<i style="background:' + brewerColors[i] + '"></i> ' +
      d3.round(fromto[0]).toLocaleString('en-US') + (d3.round(fromto[1]) == domain[n] ? '+' : '&ndash;' + d3.round(fromto[1]).toLocaleString('en-US')));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(worldMap);
