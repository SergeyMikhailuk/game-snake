const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

let score = 0;

const drawBorder = function () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

const drawScore = function () {
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Счет: " + score, blockSize, blockSize);
};

const gameOver = function () {
  playing = false;
  ctx.font = "60px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Конец игры", width / 2, height / 2);
};

const circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
  drawSquare(color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  }
  drawCircle(color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  }
  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}

class Snake {
  constructor() {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];

    this.direction = "right";
    this.nextDirection = "right";
  }
  draw() {
    this.segments[0].drawSquare("LimeGreen");
    let isEvenSegment = false;

    for (let i = 1; i < this.segments.length; i++) {
      if (isEvenSegment) {
        this.segments[i].drawSquare("Blue");
      } else {
        this.segments[i].drawSquare("Yellow");
      }

      isEvenSegment = !isEvenSegment;
    }
  }
  move() {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      animationTime -= 5;
      apple.move(this.segments);
    } else {
      this.segments.pop();
    }
  }
  checkCollision(head) {
    const leftCollision = head.col === 0;
    const topCollision = head.row === 0;
    const rightCollision = head.col === widthInBlocks - 1;
    const bottomCollision = head.row === heightInBlocks - 1;

    const wallCollision =
      leftCollision || topCollision || rightCollision || bottomCollision;

    const selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
        selfCollision = true;
      }
    }

    return wallCollision || selfCollision;
  }
  setDirection(newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right") {
      return;
    }

    this.nextDirection = newDirection;
  }
}

class Apple {
  constructor() {
    this.position = new Block(10, 10);
  }
  draw() {
    this.position.drawCircle("LimeGreen");
  }
  move(occupiedBlocks) {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    let index = occupiedBlocks.length - 1;
    while (index >= 0) {
      if (this.position.equal(occupiedBlocks[index])) {
        this.move(occupiedBlocks);
        return;
      }
      index--;
    }
  }
}

const snake = new Snake();
const apple = new Apple();

let playing = true;
let animationTime = 100;

let gameLoop = function () {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();

  if (playing) {
    setTimeout(gameLoop, animationTime);
  }
};

gameLoop();

const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

$("body").keydown(function (event) {
  const newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
