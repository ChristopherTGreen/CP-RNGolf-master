class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 300
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOW_VELOCITY_Y_MAX = 1100
        this.WALL_SPEED = 100

        // other variables 
        this.shots = 0
        this.holes = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // initial score config
        let scoreConfig = {
            fontSize: '50px',
            fontFamily: 'Arial',
            color: '#82c4f3',
        }

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // display
        this.displayShots = this.add.text(0, 0, "Shots: " + this.shots, scoreConfig)
        this.displayHoles = this.add.text(0, 40, "Holes: "+ this.holes, scoreConfig)
        this.displayRate = this.add.text(0, 80, "Rate: 0", scoreConfig)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        this.wallA = this.physics.add.sprite(0, height/4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setCollideWorldBounds(true)
        this.wallA.body.setImmovable(true)
        this.wallA.body.setVelocityX(this.WALL_SPEED)
        this.wallA.body.setBounce(1.0)

        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([this.wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            let shotRelative = pointer.x <= this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(shotRelative * Phaser.Math.Between(100, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOW_VELOCITY_Y_MAX) * shotDirection)
            
            // shots counter
            this.shots+=1
            this.displayShots.setText("Shots: " + this.shots)
            this.displayRate.setText("Rate: " + Phaser.Math.RoundTo((this.holes/this.shots), -2, 10))
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.setPosition(width / 2, height - height / 10)
            this.ball.setX(Phaser.Math.Between(0 + ball.width / 2, width - ball.width / 2))
            this.ball.setVelocity(0, 0)

            // holes counter
            this.holes += 1
            this.displayHoles.setText("Holes: " + this.holes)
            this.displayRate.setText("Rate: " + Phaser.Math.RoundTo((this.holes/this.shots), -2, 10))
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ x ] Add ball reset logic on successful shot
[ x ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ x ] Make one obstacle move left/right and bounce against screen edges
[ x ] Create and display shot counter, score, and successful shot percentage
*/