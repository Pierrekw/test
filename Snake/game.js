class Snake {
    constructor() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    move(food) {
        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            return true;
        }

        this.body.pop();
        return false;
    }

    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }

    update() {
        this.direction = this.nextDirection;
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileSize = this.canvas.width / this.gridSize;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.gameLoop = this.gameLoop.bind(this);
    }

    generateFood() {
        const food = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };

        // 确保食物不会生成在蛇身上
        for (const segment of this.snake.body) {
            if (food.x === segment.x && food.y === segment.y) {
                return this.generateFood();
            }
        }
        return food;
    }

    handleKeyPress(event) {
        const keyActions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            ' ': 'restart'
        };

        const action = keyActions[event.key];
        if (!action) return;

        if (action === 'restart' && this.gameOver) {
            this.restart();
            return;
        }

        if (!this.gameOver) {
            this.snake.changeDirection(action);
        }
    }

    update() {
        if (this.gameOver) return;

        this.snake.update();
        if (this.snake.move(this.food)) {
            this.score += 10;
            this.food = this.generateFood();
            document.getElementById('score').textContent = `分数: ${this.score}`;
        }

        if (this.snake.checkCollision(this.gridSize)) {
            this.gameOver = true;
            document.getElementById('game-over').style.display = 'block';
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制食物
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );

        // 绘制蛇
        this.ctx.fillStyle = 'green';
        this.snake.body.forEach((segment, index) => {
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        });
    }

    restart() {
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = '分数: 0';
        document.getElementById('game-over').style.display = 'none';
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(this.gameLoop, 150);
    }

    start() {
        this.gameLoop();
    }
}

// 启动游戏
const game = new Game();
game.start();