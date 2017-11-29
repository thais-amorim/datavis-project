let activeBtn = 0;
let year = 0;

function updateToInflow() {
  if(activeBtn != 1) {
    activeBtn = 1;
    loadMap();
  }
}
function updateToOutflow() {
  if(activeBtn != 2) {
    activeBtn = 2;
    loadMap();
  }
}
