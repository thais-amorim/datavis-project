let activeBtn = 0;
let continentBtn = "";
let year = 2015;

function updateToInflow() {
  if (activeBtn != 1) {
    activeBtn = 1;
    loadMap();
  }
}

function updateToOutflow() {
  if (activeBtn != 2) {
    activeBtn = 2;
    loadMap();
  }
}

function updateContinentToAsia() {
  if (continentBtn != "asiaBtn") {
    continentBtn = "asiaBtn";
    loadMap();
  }
}

function updateContinentToAfrica() {
  if (continentBtn != "africaBtn") {
    continentBtn = "africaBtn";
    loadMap();
  }
}

function updateContinentToEurope() {
  if (continentBtn != "europeBtn") {
    continentBtn = "europeBtn";
    loadMap();
  }
}

function updateContinentToOceania() {
  if (continentBtn != "oceaniaBtn") {
    continentBtn = "oceaniaBtn";
    loadMap();
  }
}

function updateContinentToSouthAmerica() {
  if (continentBtn != "southAmericaBtn") {
    continentBtn = "southAmericaBtn";
    loadMap();
  }
}

function updateContinentToNorthAmerica() {
  if (continentBtn != "northAmericaBtn") {
    continentBtn = "northAmericaBtn";
    loadMap();
  }
}
