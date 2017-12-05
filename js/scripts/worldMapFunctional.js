function updateToInflow() {
  if (activeBtn != 1) {
    activeBtn = 1;
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateToOutflow() {
  if (activeBtn != 2) {
    activeBtn = 2;
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToAsia() {
  if (continentBtn != "asiaBtn") {
    continentBtn = "asiaBtn";
    chosenContinent = "asia";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToAfrica() {
  if (continentBtn != "africaBtn") {
    continentBtn = "africaBtn";
    chosenContinent = "africa";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToEurope() {
  if (continentBtn != "europeBtn") {
    continentBtn = "europeBtn";
    chosenContinent = "europe";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToOceania() {
  if (continentBtn != "oceaniaBtn") {
    continentBtn = "oceaniaBtn";
    chosenContinent = "oceania";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToSouthAmerica() {
  if (continentBtn != "southAmericaBtn") {
    continentBtn = "southAmericaBtn";
    chosenContinent = "southAmerica";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}

function updateContinentToNorthAmerica() {
  if (continentBtn != "northAmericaBtn") {
    continentBtn = "northAmericaBtn";
    chosenContinent = "northAmerica";
    redrawMinimaps(chosenContinent);
    loadMap();
  }
}
