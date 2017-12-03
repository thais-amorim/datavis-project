let population1990ByCountry = d3.map();
let population1995ByCountry = d3.map();
let population2000ByCountry = d3.map();
let population2005ByCountry = d3.map();
let population2010ByCountry = d3.map();
let population2015ByCountry = d3.map();

let inflow1990ByCountry = d3.map();
let inflow1995ByCountry = d3.map();
let inflow2000ByCountry = d3.map();
let inflow2005ByCountry = d3.map();
let inflow2010ByCountry = d3.map();
let inflow2015ByCountry = d3.map();

let outflow1990ByCountry = d3.map();
let outflow1995ByCountry = d3.map();
let outflow2000ByCountry = d3.map();
let outflow2005ByCountry = d3.map();
let outflow2010ByCountry = d3.map();
let outflow2015ByCountry = d3.map();

let worldMap = L.map('mapid', {
  minZoom: 2,
  maxZoom: 4,
}).setView([25, 10], 2);

worldMap.scrollWheelZoom.disable();

let geojson;

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
    data = inflow2015ByCountry.get(properties.name);
  else if (activeBtn == 2)
    data = outflow2015ByCountry.get(properties.name);

  let flowTax = properties && data ? data.toLocaleString('en-US') + " flows per 100,000 locals" : "Data unavailable";
  this._div.innerHTML = '<h3>Average flow</h3>' + (properties ?
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
  let pop = population2015ByCountry.get(country);
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
    inflow1990ByCountry.set(d.country, calculateRate(d.country, +d.inflow1990));
    inflow1995ByCountry.set(d.country, calculateRate(d.country, +d.inflow1995));
    inflow2000ByCountry.set(d.country, calculateRate(d.country, +d.inflow2000));
    inflow2005ByCountry.set(d.country, calculateRate(d.country, +d.inflow2005));
    inflow2010ByCountry.set(d.country, calculateRate(d.country, +d.inflow2010));
    inflow2015ByCountry.set(d.country, calculateRate(d.country, +d.inflow2015));
  });
});
d3.csv("data/outflow_country.csv", function(data) {
  data.forEach(function(d) {
    outflow1990ByCountry.set(d.country, calculateRate(d.country, +d.outflow1990));
    outflow1995ByCountry.set(d.country, calculateRate(d.country, +d.outflow1995));
    outflow2000ByCountry.set(d.country, calculateRate(d.country, +d.outflow2000));
    outflow2005ByCountry.set(d.country, calculateRate(d.country, +d.outflow2005));
    outflow2010ByCountry.set(d.country, calculateRate(d.country, +d.outflow2010));
    outflow2015ByCountry.set(d.country, calculateRate(d.country, +d.outflow2015));
  });
});
// d3.csv("data/td_outflows.csv", function(data) {
//   data.forEach(function(d) {
//     d.total = +d.total;
//   });
//
//   let facts = crossfilter(data);
//   // let dimensionByDestinYear = facts.dimension(function(d) {
//   //   return 'country=' + d.country_dest + ';year=' + d.year;
//   // });
//   // let dimensionByOriginYear = facts.dimension(function(d) {
//   //   return 'country=' + d.country_origin + ';year=' + d.year;
//   // });
//   //
//   // var destinYearCount = dimensionByDestinYear.group().reduceCount(d => d.total);
//   // var originYearCount = dimensionByDestinYear.group().reduceCount(d => d.total);
//   var dimensionDestinYear = facts.dimension(function(d) {
//     //stringify() and later, parse() to get keyed objects
//     return JSON.stringify({
//       country: d.cod_country_dest,
//       year: d.year
//     });
//   });
//
//   groupByDestinYear = dimensionDestinYear.group();
//   groupByDestinYear.all().forEach(function(d) {
//     d.key = JSON.parse(d.key);
//   });
//
//   let final = groupByDestinYear.all();
//   // console.log(final);
//
//   // outflow2015ByCountry.set(d.country, calculateRate(d.country, +d.value));
// });

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
