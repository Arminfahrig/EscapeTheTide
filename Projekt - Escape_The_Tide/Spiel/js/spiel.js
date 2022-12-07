window.addEventListener('load', function (){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1200
    canvas.height = 675

    class InputHandler {
        constructor(){
            this.keys = []
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||e.key === 'ArrowUp' ||e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)
                }
                console.log(e.key, this.keys)
            })
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 1)
                }
                console.log(e.key, this.keys)
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
            this.x = 0
            this.y = this.gameHeight - this.playerheight
            this.image = document.getElementById('playerImage')
            this.frameX = 1
            this.frameY = 0
            this.speed = 0
            this.vy = 0
            this.weight = 1
        }
        draw(context){
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.playerwidth, this.playerheight)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y - 75, this.playerwidth, this.playerheight)
        }
        update(input){
            if (input.keys.indexOf('ArrowRight') > -1){
                this.speed = 6
                this.frameY = 1
            } else if(input.keys.indexOf('ArrowLeft') > -1){
                this.speed = -6
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
            this.speed2 = 2
            this.width3 = 1280
            this.height3 = 79
            this.speed3 = 3
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
        }
    }

    function handleObstecles(){

    }

    function displayStatusText(){

    }

    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        background.draw(ctx)
        background.update()
        player.draw(ctx)
        player.update(input)
        requestAnimationFrame(animate)
    }
    animate()
})
