let populationByCountry = d3.map();
let inflow1990ByCountry = d3.map();
let inflow1995ByCountry = d3.map();
let inflow2000ByCountry = d3.map();
let inflow2005ByCountry = d3.map();
let inflow2010ByCountry = d3.map();
let inflow2015ByCountry = d3.map();

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

  let inflowTax = props && inflow2015ByCountry.get(props.name) ? inflow2015ByCountry.get(props.name) : 'Unknown';

  this._div.innerHTML = '<h3>Average flow</h3>' + (props ?
    '<b>' + props.name + '</b><br />' + inflowTax.toLocaleString('en-US') + ' inflows per 100,000 locals' :
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
    colorToFill = quantize(inflow2015ByCountry.get(features.properties.name));
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
    fillOpacity: 1
  };
}

function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    weight: 3,
    opacity: 1,
    color: '#818780',
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

function calculateRate(country, flow) {
  let pop = populationByCountry.get(country);
  let rate = pop > 0 ? 100000 * flow / pop : 0;

  return Math.round(rate);
}

d3.csv("data/worldPopulation.csv", function(data) {
  data.forEach(p => populationByCountry.set(p.countryName, +p.population2015));
});

d3.csv("data/inflow_country.csv", function(data) {
  data.forEach(function(d) {
    d.inflow1990 = +d.inflow1990;
    d.inflow1995 = +d.inflow1995;
    d.inflow2000 = +d.inflow2000;
    d.inflow2005 = +d.inflow2005;
    d.inflow2010 = +d.inflow2010;
    d.inflow2015 = +d.inflow2015;

    inflow1990ByCountry.set(d.Country, calculateRate(d.Country, d.inflow1990));
    inflow1995ByCountry.set(d.Country, calculateRate(d.Country, d.inflow1995));
    inflow2000ByCountry.set(d.Country, calculateRate(d.Country, d.inflow2000));
    inflow2005ByCountry.set(d.Country, calculateRate(d.Country, d.inflow2005));
    inflow2010ByCountry.set(d.Country, calculateRate(d.Country, d.inflow2010));
    inflow2015ByCountry.set(d.Country, calculateRate(d.Country, d.inflow2015));
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
      d3.round(fromto[0]).toLocaleString('en-US') + (d3.round(fromto[1]) ? '&ndash;' + d3.round(fromto[1]).toLocaleString('en-US') : '+'));
  }

  div.innerHTML = labels.join('<br>');
  return div;
};

legend.addTo(worldMap);
