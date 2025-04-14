const urlGetGeneticRoute = 'http://localhost:5077/Genetic';

let vertices = [];

function Vertex(x, y, radius, color, borderColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.borderColor = borderColor;
}
function VertexDTO(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
}


function canvasClick(event) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.fillStyle = "transparent";
    context.strokeStyle = "white";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI * 2);
    context.stroke();
    context.fill();
    vertices.push(new Vertex(x, y, 20, "#3a2d57", "white"));
}

async function drawRoute() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let verticesDTO = [];
    for (let i = 0; i < vertices.length; i++) {
        let vertexDTO = { x: vertices[i].x, y: vertices[i].y, id: i+1};
        verticesDTO.push(vertexDTO);
    }
    console.log(verticesDTO);

    let response = await fetch(urlGetGeneticRoute, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(verticesDTO),
    });

    context.strokeStyle = "#9e9e9e";

    let route = await response.json();
    for (let i = 1; i < route.length; i++) {
        let start = vertices[route[i-1].id-1];
        let end = vertices[route[i].id-1];
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
    console.log(route);

}

function clearCanvas() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    vertices = [];
}
