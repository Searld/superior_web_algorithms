const urlGetAntRoute = 'http://localhost:5077/Ant';

let vertices = [];

function Vertex(x, y, radius, color, borderColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.borderColor = borderColor;
}

function canvasClick(event) {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.fillStyle = "#3a2d57";
    context.strokeStyle = "#42394d";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI * 2);
    context.stroke();
    context.fill();
    vertices.push(new Vertex(x, y, 20, "#3a2d57", "#42394d"));
}

async function drawRoute() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let matrix = [];
    for (let i = 0; i < vertices.length; i++) {
        let edges = [];
        for (let j = 0; j < vertices.length; j++) {
            if(j !== i) {
                let edge = { vertex: j+1, length: Math.sqrt(Math.pow(vertices[j].x - vertices[i].x,2)
                        + Math.pow(vertices[j].y - vertices[i].y,2)) };
                edges.push(edge);
            }
        }
        matrix.push(edges);
    }
    console.log(matrix);
    let response = await fetch(urlGetAntRoute, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(matrix)
    });
    let route = await response.json();

    for(let i = 1; i < route.length; i++) {
        let start = vertices[route[i-1]-1];
        let end = vertices[route[i]-1];
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
}

function clearCanvas() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    vertices = [];
}
