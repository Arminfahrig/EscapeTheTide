window.addEventListener('load', function (){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1200
    canvas.height = 675
    let obstecles = []
    let score = 0
    let speed = 0
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
            this.gameHeight = gameHeight - 75
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
            context.strokeRect(this.x, this.y, this.playerwidth, this.playerheight)
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.playerwidth, this.playerheight)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.playerwidth, this.playerheight)
        }
        update(input, deltaTime, obstecles, gameHeight){
            //colliison detection
            obstecles.forEach(obstecle => {
                const dx1 = obstecle.x - this.x - this.playerwidth
                const dx2 = obstecle.x + obstecle.obsteclewidth - 20 - this.x
                const dy1 = obstecle.y - 126 - this.y + this.playerheight
                if ((dx1 <= 0 && dx2 >= 0) && dy1 <= 0) {
                    gameOver = true
                }

                const tex1 = obstecle.x - this.x - this.playerheight
                //const tex2 = obstecle.x + obstecle.terrainwidth - this.x
                //const tex3 = obstecle.x * 2
                const tey1 = obstecle.y - this.y - this.playerheight
                //const playerBotBorder = this.y + this.playerheight
                //console.log(this.gameHeight,obstecle.y,playerBotBorder)
                console.log(this.x , obstecle.x + obstecle.terrainwidth)
                console.log(this.x + this.playerwidth , obstecle.x)
                if((this.x + this.playerwidth > obstecle.x) && (this.x < obstecle.x + obstecle.terrainwidth * 7.5) && (this.y + this.playerheight <= obstecle.y)) {
                    this.gameHeight = obstecle.y
                }else if (this.x > obstecle.x + obstecle.terrainwidth * 7.5) {
                    if(this.x<=obstecle.x+obstecle.terrainwidth*7.5) this.x=obstecle.x+obstecle.terrainwidth*7.5
                    this.gameHeight = gameHeight - 75
                }
                //if(this.x<obstecle.x+obstecle.terrainwidth*7.5) this.x=obstecle.x+obstecle.terrainwidth*7.5
                if(tex1<0 && this.x < obstecle.x && tey1 < 0) this.x = obstecle.x - this.playerwidth
            })
            const tx1 = tide.x - this.x - this.playerwidth
            const tx2 = tide.x + tide.tidewidth - this.x
            const ty1 = tide.y - 10 - this.y + this.playerheight
            //console.log(dx1, dx2, dy1, obstecle.obsteclewidth)
            if ((tx1 <= 0 && tx2 >= 0) && ty1 <= 0) {
                gameOver = true
            }

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
                speed = 1 + score * 0.05
                this.speed = speed * 5
                this.frameY = 1
                this.speedModifier = 1
            } else if(input.keys.indexOf('ArrowLeft') > -1){
                this.speed = -speed * 8
                this.frameY = 2
                this.speedModifier = 1
            } else if (input.keys.indexOf('ArrowDown') > -1){
                speed = 1 + score * 0.05
                this.speed = 0
                this.frameY = 1
                this.speedModifier = 1
            } else if(input.keys.indexOf('ArrowUp') === 0 && this.onGround()){
                this.vy -= 30
            } else {
                this.frameY = 0
                this.speed = 0
                this.speedModifier = 0
            }
            if (this.speedModifier === 0) speed = 0
            else speed = 1 + score * 0.05

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
            this.speed2 = 2.5
            this.width3 = 1280
            this.height3 = 79
            this.speed3 = 5
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
            //console.log(speed,this.speed1)
            this.x1 -= this.speed1 * speed
            if(this.x1 < 0 - this.width1) this.x1 = 0
            this.x2 -= this.speed2 * speed
            if(this.x2 < 0 - this.width2) this.x2 = 0
            this.x3 -= this.speed3 * speed
            if(this.x3 < 0 - this.width3) this.x3 = 0
            //console.log(this.speed1, this.speed2, this.speed3)
        }
    }

    class Obstecles {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 900
            this.height = 200
            this.obsteclewidth = 180
            this.obstecleheight = 40
            this.image = document.getElementById('obsteclesImage')
            this.x = this.gameWidth
            this.y = this.gameHeight - 75
            this.speed = 5
            this.markedForDeletion = false
        }
        draw(context){
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y, this.obsteclewidth - 20, this.obstecleheight)
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x - 10, this.y, this.obsteclewidth, this.obstecleheight)
        }
        update(){
            this.x -= this.speed * speed
            if (this.x < -1000 - this.obsteclewidth) {
                this.markedForDeletion = true
            }
        }
    }

    class Tide {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 90
            this.height = 120
            this.tidewidth = 360 - 55
            this.tideheight = 480
            this.image = document.getElementById('tideImage')
            this.x = -500
            this.y = this.gameHeight - this.tideheight
            this.speed = 0.1
        }
        draw(context){
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y + 120, this.tidewidth, this.tideheight)
            //context.fillStyle = 'white'
            //context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.tidewidth + 55, this.tideheight)
        }
        update(){
            this.x += this.speed + 0.1
        }
    }

    class Easteregg {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.easteregg1 = document.getElementById('eastereggImage1')
            this.easteregg2 = document.getElementById('eastereggImage2')
            this.x = 0
            this.y = 0

            this.width = 1080
            this.height = 1416

        }
        draw(context){
            context.drawImage(this.easteregg1, 200,0, this.width, this.height, this.x, this.y, this.width/3, this.height/3)
            context.drawImage(this.easteregg2, 200, 0, this.width, this.height, this.gameWidth-this.width/3, 0, this.width/3, this.height/3)
        }
        update(){
        }
    }

    class Terrain {
        constructor(gameWidth,gameHeight,pngWidth,pngHeight,terrainWidth,terrainHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            if(pngWidth===314&&pngHeight===797) this.image = document.getElementById('terrainImage1')
            else if(pngWidth===603&&pngHeight===841) this.image = document.getElementById('terrainImage2')
            else if(pngWidth===605&&pngHeight===273) this.image = document.getElementById('terrainImage3')
            else if(pngWidth===1206&&pngHeight===291) this.image = document.getElementById('terrainImage4')
            this.x = this.gameWidth
            this.y = this.gameHeight - terrainHeight * 7.5 - 75
            this.width = pngWidth
            this.height = pngHeight
            this.terrainwidth = terrainWidth //* this.faktor
            this.terrainheight = terrainHeight //* this.faktor
            this.speed = 5
            this.markedForDeletion = false
            this.faktor = 7.5
        }
        draw(context){
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.gameHeight - this.terrainheight * this.faktor - 75, this.terrainwidth * this.faktor, this.terrainheight * this.faktor)
        }
        update(){
            this.x -= this.speed * speed
            if (this.x < -1000 - this.terrainwidth) {
                this.markedForDeletion = true
            }
        }
    }

    function handleObstecles(deltaTime){
        if (obstecleTimer > obstecleInterval + randomObstecleInterval){
            let i = Math.random()
            if(i < 0.5) {
                obstecles.push(new Obstecles(canvas.width, canvas.height))
                //obstecles.push(new Terrain(canvas.width, canvas.height, 314, 797, 17 ,43))
            } else {
                let tco = Math.random()
                if (tco < 0.25) obstecles.push(new Terrain(canvas.width, canvas.height, 314, 797, 17, 43))
                else if (tco < 0.5) obstecles.push(new Terrain(canvas.width, canvas.height, 603, 841, 31,43))
                else if (tco < 0.75) obstecles.push(new Terrain(canvas.width, canvas.height, 605, 273,31,14))
                else if (tco < 1) obstecles.push(new Terrain(canvas.width, canvas.height, 1206, 291,62,14))

            }
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
            if(gameOver) {
                //context.textAlign = 'center'
                context.fillStyle = 'black'
                context.font = '40px Helvetica'
                context.fillText('Game Over', 500, 300)
                context.fillStyle = 'white'
                context.font = '40px Helvetica'
                context.fillText('Game Over', 502, 301)
            }
    }

    function easteregg1(context){
            //context.textAlign = 'center'
            /*context.fillStyle = 'black'
            context.font = '40px Helvetica'
            context.fillText('EASTEREGG', 475, 300)
            context.fillStyle = 'white'
            context.font = '40px Helvetica'
            context.fillText('EASTEREGG', 477, 301)

             */
        context.fillStyle = 'black'
        context.font = '40px Helvetica'
        context.fillText('WOW ein score von 100', 390, 500)
        context.fillStyle = 'white'
        context.font = '40px Helvetica'
        context.fillText('WOW ein score von 100', 392, 501)
        //document.write("<input type='button' value='weiter' onClick=plus()")
            //easteregg.draw(ctx)
        //terrain.draw(ctx)
    }

    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)
    const obstecle1 = new Obstecles(canvas.width, canvas.height)
    const tide = new Tide(canvas.width, canvas.height)
    const easteregg = new Easteregg(canvas.width,canvas.height)
    const terrain = new Terrain(canvas.width, canvas.height, 314, 797, 17 ,43)

    let lastTime = 0
    let obstecleTimer = 0
    let obstecleInterval = 3000
    let randomObstecleInterval = Math.random() * 2000 + 500

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        //console.log(deltaTime)
        //ctx.clearRect(0,0,canvas.width,canvas.height)
        background.draw(ctx)
        background.update()
        player.update(input, deltaTime, obstecles, canvas.height)
        player.draw(ctx)
        handleObstecles(deltaTime)
        tide.draw(ctx)
        tide.update()
        displayStatusText(ctx)

        if(!(score>=100 && score<=101)) {
            if (!gameOver) {
                requestAnimationFrame(animate)
            } else gameover(ctx)
        } else easteregg1(ctx)

        if (!(speed === 0)) score += 0.01
        //console.log(speed, player.speed)
    }
    animate(0)
    //easteregg1(ctx)
})
