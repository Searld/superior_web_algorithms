
let isStartPlaced = false;
let isEndPlaced = false;
const field = document.getElementById("field");

let sizeField = 0;
const urlFindRoute = 'http://localhost:5077/AStar/route';
const urlGetMaze = 'http://localhost:5077/AStar/maze?size=';

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

async function sizeFieldChange()
{
    sizeField = document.getElementById('sizeInput').value;
    field.innerHTML = '';

    if(sizeField <=20)
    {
        field.style.width = 500 + 'px';
        field.style.height = 500 + 'px';
        field.style.columnGap = 10 + 'px';
        field.style.rowGap = 10 + 'px';
    }
    else if(sizeField >20 && sizeField <= 35)
    {
        field.style.width = 700 + 'px';
        field.style.height = 700 + 'px';
        field.style.columnGap = 7 + 'px';
        field.style.rowGap = 7 + 'px';
    }
    else if(sizeField >35 && sizeField <= 55)
    {
        field.style.width = 800 + 'px';
        field.style.height = 800 + 'px';
        field.style.columnGap = 1 + 'px';
        field.style.rowGap = 1 + 'px';
    }
    else if(sizeField >55 && sizeField <= 75)
    {
        field.style.width = 900 + 'px';
        field.style.height = 900 + 'px';
        field.style.columnGap = 1 + 'px';
        field.style.rowGap = 1 + 'px';
    }
    else if(sizeField >75 && sizeField <= 100)
    {
        field.style.width = 1000 + 'px';
        field.style.height = 1000 + 'px';
        field.style.columnGap = 1 + 'px';
        field.style.rowGap = 1 + 'px';
    }
    else if(sizeField >100 && sizeField <= 150)
    {
        field.style.width = 1200 + 'px';
        field.style.height = 1200 + 'px';
        field.style.columnGap = 1 + 'px';
        field.style.rowGap = 1 + 'px';
    }
    else if(sizeField >150 && sizeField <= 300)
    {
        field.style.width = 1500 + 'px';
        field.style.height = 1500 + 'px';
        field.style.columnGap = 0 + 'px';
        field.style.rowGap = 0 + 'px';
    }

    field.style.setProperty("grid-template-columns", 'repeat(' + sizeField + ', 1fr)');
    field.style.setProperty("grid-template-rows", 'repeat(' + sizeField + ', 1fr)');

    let response = await fetch(urlGetMaze+sizeField);
    let maze = await response.json();

    for (let i = 0; i < sizeField; i++)
    {
        for (let j = 0; j < sizeField; j++)
        {
            let divElement = document.createElement("div");
            divElement.addEventListener('contextmenu',  selectStartOrEnd, false);
            divElement.addEventListener('click',  selectUnavailableCells);
            divElement.id = ''+ j + ' '+ i + '' ;
            if(maze[i][j] === true)
                divElement.className = 'cell-available';
            else
                divElement.className = 'cell-unavailable';

            field.appendChild(divElement);
        }

    }
}
 async function calculateRoute() {
     const cells = field.children;
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
     let response = await fetch(urlFindRoute, {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(matrix)
     });
     let data = await response.json();
     drawRoute(data);
 }
async function drawRoute(data)
{
    if(data !== null)
    {
        let border = document.getElementById('gradient-border');

        if(data.route === null)
        {
            const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
            border.className = 'gradient-border-exception';

            await sleep(1000);

            border.className = 'gradient-border';

            return;
        }
        const cells = field.children;
        let steps = data['steps'];

        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        console.log(steps);
        for (let j = 0; j < steps.length-1; j++)
        {
            let currentCell = steps[j]['currentCell'];

            await sleep(10);
            let cell =  cells.namedItem(''+ currentCell.x + ' ' + currentCell.y + '');
            cell.className = 'cell-current';
        }
        let indexes = data['route']['indexes'];
        for (let j = 0; j < indexes.length-1; j++)
        {
            await sleep(130);
            let cell =  cells.namedItem(''+ indexes[j].x + ' ' + indexes[j].y + '');
            cell.className = 'cell-route';
        }
        border.className = 'gradient-border-done';
    }
}

function clearField()
{
    const cells = field.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].className = 'cell-available';
    }
    let border = document.getElementById('gradient-border');
    border.className = 'gradient-border';
    isStartPlaced = false;
    isEndPlaced = false;
}