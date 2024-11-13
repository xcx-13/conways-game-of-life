"use strict";

let currentGen = [];
const size = {
    rows: 60,
    columns: 80
};

function updateField() {
    const cells = document.getElementsByClassName('cell');

    Array.from(cells).forEach((cell) => {
        const x = cell.id.split('-')[1];
        const y = cell.id.split('-')[2];

        const cellValue = currentGen[y][x];

        if (cellValue) {
            cell.classList.add('filled');
            cell.classList.remove('empty');
        } else {
            cell.classList.add('empty');
            cell.classList.remove('filled');
        }
    });
}

function createEmptyArray(columnCount) {
    const row = new Array(columnCount).fill(0);
    currentGen.push(row);
}

function createField(rowCount, columnCount) {
    const table = document.getElementById('field');

    // Create table elements
    for (let y = 0; y < rowCount; y++) {
        let tr = document.createElement('tr');
        for (let x = 0; x < columnCount; x++) {
            let td = document.createElement('td');
            td.onclick = function (event) {
                currentGen[y][x] = (currentGen[y][x] === 1) ? 0 : 1;
                updateField();
            };
            td.id = `cell-${x}-${y}`;
            td.classList.add('cell');
            tr.appendChild(td);
        }
        table.appendChild(tr);

        // Create empty currentGen
        createEmptyArray(columnCount);
    }
}

function generateRandomGen(rowCount, columnCount) {
    let rows = [];
    let columns = [];

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < columnCount; x++) {
            const zustand = Math.floor(Math.random() * 2);
            columns.push(zustand);
        }
        rows.push(columns);
        columns = [];
    }
    return rows;
}

/**
 * @param {number[][]} currentGeneration aktuelle Generation als 2D Array
 * @returns {number[][]} nächste Generation als 2D Array
 */
function calculateNewGeneration(currentGeneration) {
    const rowCount = currentGeneration.length;
    const columnCount = currentGeneration[0].length;

    let newGeneration = [];
    let newColumns = [];

    for (let y = 0; y < rowCount; y++) {
        for (let x = 0; x < columnCount; x++) {
            const isBorder = checkBorder(rowCount, columnCount, y, x);
            if (isBorder) {
                newColumns.push(0);
                continue;
            }
            let neighbours = 0;

            for (let ox = -1; ox <= 1; ox++) {

                for (let oy = -1; oy <= 1; oy++) {

                    if (ox === 0 && oy === 0) continue;
                    const neigbourState = currentGeneration[y + oy][x + ox]
                    if (neigbourState === 1) {
                        neighbours++
                    }
                }
            }

            if (neighbours == 2) {
                const zustand = currentGeneration[y][x];
                newColumns.push(zustand);
            }
            else if (neighbours == 3) {
                const zustand = 1;
                newColumns.push(zustand);
            }
            else {
                const zustand = 0;
                newColumns.push(zustand);
            }
        }
        newGeneration.push(newColumns);
        newColumns = [];
    }
    return newGeneration;
}

function NextGenGenerating() {
    currentGen = calculateNewGeneration(currentGen);
    updateField();
}

const randomBtn = document.getElementById('randomBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

function onReset() {

    clearInterval(myInterval);

    currentGen = [];
    for (let y = 0; y < size.rows; y++) {
        createEmptyArray(size.columns);
    }
    console.log(currentGen);
    updateField();
}

resetBtn.onclick = onReset;


function onRandom() {
    currentGen = generateRandomGen(size.rows, size.columns);
    updateField();
}

randomBtn.onclick = onRandom;

let isPaused = true;
let myInterval = null;

startBtn.onclick = function () {
    isPaused = !isPaused;

    if (!isPaused) {
        startBtn.innerText = 'Pause';
        startBtn.classList.remove('start-btn');
        startBtn.classList.add('pause-btn');
        myInterval = setInterval(NextGenGenerating, 100);

    } else {
        startBtn.innerText = 'Start';
        startBtn.classList.remove('pause-btn');
        startBtn.classList.add('start-btn');
        if (myInterval) clearInterval(myInterval);
    }
}

function checkBorder(rowCount, columnCount, y, x) {
    if (x === 0) return true;
    if (x === columnCount - 1) return true;
    if (y === 0) return true;
    if (y === rowCount - 1) return true;
    return false;
}

createField(size.rows, size.columns);