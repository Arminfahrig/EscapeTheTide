window.addEventListener('load', function (){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1200
    canvas.height = 675
    let obstecles = []
    let score = 0
    let speed = 1 + score * 0.01
    let gameOver = false

    class InputHandler {
        constructor(){
            this.keys = []
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||e.key === 'ArrowUp' ||e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)
                }
                //console.log(e.key, this.keys)
            })
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
                //console.log(e.key, this.keys)
            })
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.playerwidth = 100
            this.playerheight = 100
            this.width = 840
            this.height = 840
            this.x = 300
            this.y = this.gameHeight - this.playerheight
            this.image = document.getElementById('playerImage')
            this.frameX = 0
            this.maxFrame = 1
            this.frameY = 0
            this.fps = 10
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.speed = 0
            this.vy = 0
            this.weight = 1
        }
        draw(context){
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y - 75, this.playerwidth, this.playerheight)
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.playerwidth, this.playerheight)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y - 75, this.playerwidth, this.playerheight)
        }
        update(input, deltaTime, obstecles){
            //colliison detection
            obstecles.forEach(obstecle => {
                const dx = obstecle.x - this.x - this.playerwidth
                const dy = obstecle.y - 126 - this.y + this.playerheight
                console.log(dx, dy)
                if (dx <= 0 && dy <= 0) {
                    gameOver = true
                }
            })
            //sprite animation
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else{
                this.frameTimer += deltaTime
            }
            //controls
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = speed * 5
                this.frameY = 1
            } else if(input.keys.indexOf('ArrowLeft') > -1){
                this.speed = -speed * 5
                this.frameY = 2
            } else if(input.keys.indexOf('ArrowUp') === 0 && this.onGround()){
                this.vy -= 30
            } else {
                this.frameY = 0
                this.speed = 0
            }
            // horizontal movement
            this.x += this.speed
            if (this.x < 0) this.x = 0
            else if (this.x > this.gameWidth - this.playerwidth) this.x = this.gameWidth - this.playerwidth
            // vertical movement
            this.y += this.vy
            if (!this.onGround()){
                this.vy += this.weight
                if(input.keys.indexOf('ArrowRight') > -1) this.frameY = 3
                if(input.keys.indexOf('ArrowLeft') > -1) this.frameY = 4
            } else {
                if (input.keys.indexOf('ArrowRight') > -1) this.frameY = 1
                if(input.keys.indexOf('ArrowLeft') > -1) this.frameY = 2
                this.vy = 0
            }
            if (this.y > this.gameHeight - this.playerheight) this.y = this.gameHeight - this.playerheight
        }
        onGround(){
            return this.y >= this.gameHeight - this.playerheight
        }
    }

    class Background {
        constructor(gamewidth,gameheight){
            this.gamewidth = gamewidth
            this.gameheight = gameheight
            this.image1 = document.getElementById('backgroundImage1')
            this.image2 = document.getElementById('backgroundImage2')
            this.image3 = document.getElementById('backgroundImage3')
            this.x1 = 0
            this.y1 = 0
            this.x2 = 0
            this.y2 = 0
            this.x3 = 0
            this.y3 = 0
            this.width1 = 2023
            this.height1 = 600
            this.speed1 = 1
            this.width2 = 903
            this.height2 = 260
            this.speed2 = speed * 2
            this.width3 = 1280
            this.height3 = 79
            this.speed3 = speed * 3
        }
        draw(context){
            context.drawImage(this.image1, this.x1, this.y1, this.width1, this.height1)
            context.drawImage(this.image1, this.x1 + this.width1, this.y1, this.width1, this.height1)
            context.drawImage(this.image2, this.x2, this.y2, this.width2, this.height2)
            context.drawImage(this.image2, this.x2 + this.width2 -1, this.y2, this.width2, this.height2)
            context.drawImage(this.image2, this.x2 + this.width2 + this.width2 -2, this.y2, this.width2, this.height2)
            context.drawImage(this.image3, this.x3, this.y3 + this.height1 -1, this.width3, this.height3)
            context.drawImage(this.image3, this.x3 + this.width3 -1 , this.y3 + this.height1 -1, this.width3, this.height3)
        }
        update(){
            this.x1 -= this.speed1
            if(this.x1 < 0 - this.width1) this.x1 = 0
            this.x2 -= this.speed2
            if(this.x2 < 0 - this.width2) this.x2 = 0
            this.x3 -= this.speed3
            if(this.x3 < 0 - this.width3) this.x3 = 0
        }
    }

    class Obstecles {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 60
            this.height = 74
            this.image = document.getElementById('obsteclesImage')
            this.x = this.gameWidth
            this.y = this.gameHeight - this.height
            this.speed = 2
            this.markedForDeletion = false
        }
        draw(context){
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y, this.width, this.height)
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(){
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    function handleObstecles(deltaTime){
        if (obstecleTimer > obstecleInterval + randomObstecleInterval){
            obstecles.push(new Obstecles(canvas.width, canvas.height))
            console.log(obstecles)
            //randomObstecleInterval = Math.random() * 1000 + 500
            obstecleTimer = 0
        } else {
            obstecleTimer += deltaTime
        }
        obstecles.forEach(obstecle => {
            obstecle.draw(ctx)
            obstecle.update()
        })
        obstecles = obstecles.filter(obstecles => !obstecles.markedForDeletion)
    }

    function displayStatusText(context){
        context.fillStyle = 'black'
        context.font = '40px Helvetica'
        context.fillText('Score: ' + Math.floor(score), 20, 50)
        context.fillStyle = 'white'
        context.font = '40px Helvetica'
        context.fillText('Score: ' + Math.floor(score), 22, 51)
    }

    function gameover(context){
        if(score === 0) {
            if(gameOver) {
                context.textAlign = 'center'
                context.fillStyle = 'black'
                context.font = '40px Helvetica'
                context.fillText('Game Over', 500, 300)
                context.fillStyle = 'white'
                context.font = '40px Helvetica'
                context.fillText('Game Over', 502, 301)
            }
        }
    }

    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)
    const obstecle1 = new Obstecles(canvas.width, canvas.height)

    let lastTime = 0
    let obstecleTimer = 0
    let obstecleInterval = 4000
    let randomObstecleInterval = Math.random() * 1500

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        //console.log(deltaTime)
        //ctx.clearRect(0,0,canvas.width,canvas.height)
        background.draw(ctx)
        background.update()
        player.draw(ctx)
        player.update(input, deltaTime, obstecles)
        handleObstecles(deltaTime)
        displayStatusText(ctx)
        gameover(ctx)
        if(!gameOver) requestAnimationFrame(animate)
        if (!(speed === 0)) score += 0.01
    }
    animate(0)
})
