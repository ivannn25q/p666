const canvas = document.getElementById("propellerCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const radiusSlider = document.getElementById("radiusSlider");
const massSlider = document.getElementById("massSlider");
const radiusValue = document.getElementById("radiusValue");
const massValue = document.getElementById("massValue");
const omegaValue = document.getElementById("omegaValue");
const inertiaValue = document.getElementById("inertiaValue");
const momentumValue = document.getElementById("momentumValue");
const toggleButton = document.getElementById("toggleButton");

// Physics variables
let r = parseFloat(radiusSlider.value);
let m = parseFloat(massSlider.value);
let omega = 5.0;
let L = 3 * m * r**2 * omega;
let isRunning = false;

// Animation variables
let angle = 0;
const numBlades = 3;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const frameRate = 120;
const timeStep = 1 / frameRate;
let windParticles = [];

// Wind particle system
class WindParticle {
    constructor(angleOffset) {
        this.angle = angleOffset;
        this.radius = Math.random() * 80 + 50;
        this.length = Math.random() * 15 + 15;
        this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.angle += omega * 0.005;
        if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
    }

    draw() {
        const x = centerX + this.radius * Math.cos(this.angle);
        const y = centerY + this.radius * Math.sin(this.angle);
        const xTrail = centerX + (this.radius - this.length) * Math.cos(this.angle);
        const yTrail = centerY + (this.radius - this.length) * Math.sin(this.angle);

        ctx.strokeStyle = `rgba(200, 200, 255, ${this.opacity})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xTrail, yTrail);
        ctx.stroke();
    }
}

// Generate wind particles
function generateWindParticles(count) {
    windParticles = [];
    for (let i = 0; i < count; i++) {
        windParticles.push(new WindParticle(Math.random() * Math.PI * 2));
    }
}

// Draw wind effects
function drawWindEffects() {
    if (omega > 2) {
        windParticles.forEach((particle) => {
            particle.update();
            particle.draw();
        });
    }
}

// Draw full propeller
function drawPropeller() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (omega > 2) {
        drawWindEffects();
    } else {
        windParticles = [];
    }

    let bladeLength = Math.max(50, r * 120); 
    let bladeWidth = Math.max(10, m * 15); 

    for (let i = 0; i < numBlades; i++) {
        let theta = angle + (i * (2 * Math.PI / numBlades));
        drawWindmillBlade(centerX, centerY, theta, bladeLength, bladeWidth);
    }

    // Draw center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.stroke();
}

// Draw a single windmill blade
function drawWindmillBlade(cx, cy, angle, length, width) {
    ctx.fillStyle = "#007BFF";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);

    let x1 = cx + length * Math.cos(angle);
    let y1 = cy + length * Math.sin(angle);

    let x2 = cx + (length * 0.6) * Math.cos(angle + 0.3);
    let y2 = cy + (length * 0.6) * Math.sin(angle + 0.3);

    let x3 = cx + (length * 0.2) * Math.cos(angle - 0.4);
    let y3 = cy + (length * 0.2) * Math.sin(angle - 0.4);

    ctx.quadraticCurveTo(x2, y2, x1, y1);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Update animation
function update() {
    if (isRunning) {
        r = parseFloat(radiusSlider.value);
        m = parseFloat(massSlider.value);

        let I = 3 * m * r**2;
        omega = L / I;

        angle += omega * timeStep;

        radiusValue.textContent = r.toFixed(2);
        massValue.textContent = m.toFixed(2);
        omegaValue.textContent = omega.toFixed(2);
        inertiaValue.textContent = I.toFixed(2);
        momentumValue.textContent = L.toFixed(2);

        if (omega > 2) {
            let windCount = Math.min(omega * 4, 150);
            generateWindParticles(windCount);
        } else {
            windParticles = [];
        }

        drawPropeller();
        setTimeout(() => requestAnimationFrame(update), 1000 / frameRate);
    }
}

// Controls
toggleButton.addEventListener("click", () => {
    isRunning = !isRunning;
    toggleButton.textContent = isRunning ? "Stop" : "Start";
    if (isRunning) update();
});

generateWindParticles(50);
drawPropeller();
