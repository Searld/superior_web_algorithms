
let isStartPlaced = false;
let isEndPlaced = false;
function selectStartOrEnd(event) {
    event.preventDefault();
    if(event.currentTarget.className === 'cell-start')
    {
        event.currentTarget.className = 'cell-available';
        isStartPlaced = false;
        return false;
    }
    else if(event.currentTarget.className === 'cell-end')
    {
        event.currentTarget.className = 'cell-available';
        isEndPlaced = false;
        return false;
    }

    if (!isStartPlaced) {
        isStartPlaced = true;
        event.currentTarget.className = 'cell-start';
    }
    else if( !isEndPlaced)
    {
        isEndPlaced = true;
        event.currentTarget.className = 'cell-end';
    }


    return false;
}

function selectUnavailableCells(event) {
    if(event.currentTarget.className === 'cell-unavailable')
    {
        event.currentTarget.className = 'cell-available';
    }
    else
    {
        event.currentTarget.className = 'cell-unavailable';
    }
}

const field = document.getElementById("field");

let sizeField = 0;
function sizeFieldChange()
{
    sizeField = document.getElementById('sizeInput').value;
    field.innerHTML = '';
    field.style.setProperty("grid-template-columns", 'repeat(' + sizeField + ', 1fr)');
    field.style.setProperty("grid-template-rows", 'repeat(' + sizeField + ', 1fr)');

    for (let i = 0; i < sizeField*sizeField; i++)
    {
        let divElement = document.createElement("div");
        divElement.addEventListener('contextmenu',  selectStartOrEnd, false);
        divElement.addEventListener('click',  selectUnavailableCells);
        divElement.className = 'cell-available';
        field.appendChild(divElement);
    }
}
 async function calculateRoute() {
     const cells = field.children;
     const url = 'http://localhost:5077/AStar';
     let matrix = [];
     let newList = [];
     for (let i = 0; i < cells.length; i++) {
         if (i % sizeField === 0 && i !== 0) {
             matrix.push(newList);
             newList = [];
         }

         if (cells[i].className === 'cell-available') {
             newList.push(0);
         }
         if (cells[i].className === 'cell-unavailable') {
             newList.push(-1);
         }
         if (cells[i].className === 'cell-start') {
             newList.push(1);
         }
         if (cells[i].className === 'cell-end') {
             newList.push(2);
         }
     }
     matrix.push(newList);

     let response = await fetch(url, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(matrix)
     });
     let data = await response.json();
     drawRoute(data);
 }

function drawRoute(data)
{
    const cells = field.children;
    let indexes = data['indexes'];
    for (let i = 0; i < indexes.length-1; i++)
    {
        cells[indexes[i].x + indexes[i].y * sizeField].className = "cell-rout";
    }
}