const svgCanvas = document. createElementNS("http://www.w3.org/2000/svg", "svg")

var square_dimensions = 10

var matrix_size = 50
var canvas_width = square_dimensions * matrix_size
var canvas_height = square_dimensions * matrix_size

svgCanvas.setAttribute ("width", canvas_width)
svgCanvas.setAttribute ("height", canvas_height)

var cell_width = canvas_width / square_dimensions
var cell_height = canvas_height / square_dimensions

createSquare = (cell_width, cell_height, x, y, color) => {
    var square = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    square.setAttribute('id', x / square_dimensions + ":" + y / square_dimensions)
    square.setAttribute('x', x)
    square.setAttribute('y', y)
    square.setAttribute('width', square_dimensions)
    square.setAttribute('height', square_dimensions)
    square.setAttribute('fill', color)
    square.setAttribute('stroke', 'grey')
    document.getElementById('svgCanvas').appendChild(svgCanvas)
    svgCanvas.appendChild(square)
}

drawMatrix = (matrix) => {
    for (var x = 0; x < matrix.length; x++) {
        for (var y = 0; y <matrix[x].length; y++) {
            if (matrix[x][y] == 0) {
                createSquare(cell_width, cell_width, x * square_dimensions, y * square_dimensions, "black")
            }  
            else {
                createSquare(cell_width, cell_width, x * square_dimensions, y * square_dimensions, "white")
            }
        }
    }
}

createMatrix = (canvas_width, canvas_height) => {
    var matrix = []
    for (var x = 0; x < canvas_height; x = x + square_dimensions) {
        var inner = []
        for (var y = 0; y < canvas_width; y = y + square_dimensions) {
            inner.push(0)
        }
        matrix.push(inner)
    }
    return matrix
}

var initial_matrix = createMatrix(canvas_width, canvas_height)

var getRandomInt = (matrix_size) => {
    return Math.floor(Math.random() * Math.floor(matrix_size))
}

seedMatrix = (initial_matrix) => {
    for (var i = 0; i < 200; i++) {
        initial_matrix[getRandomInt(matrix_size)][getRandomInt(matrix_size)] = 1
    }
}

seedMatrix(initial_matrix)
drawMatrix(initial_matrix)

processMatrix = (input_matrix) => {
    output_matrix = []
    for (var x = 0; x < input_matrix.length; x++) {
        var inner = []
        for (var y = 0; y < input_matrix[x].length; y++) {

            var x_minus = x - 1 < 0 ? input_matrix[x].length - 1 : x - 1
            var y_minus = y - 1 < 0 ? input_matrix[x].length - 1 : y - 1
            var x_plus = (x + 1) % input_matrix[x].length
            var y_plus = (y + 1) % input_matrix[x].length

            var above_left = input_matrix[x_minus][y_minus]
            var above = input_matrix[x_minus][y]
            var above_right = input_matrix[x_minus][y_plus]
            var left = input_matrix[x][y_minus]
            var right = input_matrix[x][y_plus]
            var below_left = input_matrix[x_plus][y_minus]
            var below = input_matrix[x_plus][y]
            var below_right = input_matrix[x_plus][y_plus]

            var neighbor_count = above_left + above + above_right + left + right + below_left + below + below_right

            /*
            Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            Any live cell with two or three live neighbours lives on to the next generation.
            Any live cell with more than three live neighbours dies, as if by overpopulation.
            Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            */

            var isLive = input_matrix[x][y] == 1 ? true : false

            if (isLive) {
                if (neighbor_count < 2) {
                    inner.push(0)
                }
                else if (neighbor_count == 2 | neighbor_count == 3) {
                    inner.push(1)
                }
                else if (neighbor_count > 3) {
                    inner.push(0)
                }
            }
            else if ((input_matrix[x][y] == 0) && neighbor_count == 3) {
                inner.push(1)
            }
            else {
                inner.push(0)
            }
        }
        output_matrix.push(inner)
    }
    return output_matrix
}

updateMatrix = (matrix) => {
    for (var x = 0; x < matrix.length; x++) {
        for (var y = 0; y < matrix[x].length; y++) {
            var element = document.getElementById(x + ":" + y)
            if (matrix[x][y] == 1) {
                element.setAttribute("fill", "black")
            }
            else {
                element.setAttribute("fill", "white")
            }
        }
    }
}

var processed_matrix = initial_matrix

for (let i = 1; i < 500; i++) {
    setTimeout(function timer() {
        processed_matrix = processMatrix(processed_matrix)
        updateMatrix(processed_matrix)

    }, i * 500)
}