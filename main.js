let game = {}

game.canvas = document.getElementById('game-canvas');
game.ctx = game.canvas.getContext('2d');
game.canvas.width = 384
game.canvas.height = 224
game.lastTime = 0;
game.char_paths=[
    "chars/sakura",
    "chars/lilith"
]
game.chars=[]
for(let i=0;i<game.char_paths.length;i++){
    let script = document.createElement("script")
    script.src=`${game.char_paths[i]}/script.js`
    document.querySelector("body").appendChild(script)
}

game.physics = physics
game.battle_engine = battle_engine
game.match = match
game.state="running"
game.freeze_timer=0

game.render=()=>{
    let ctx = game.ctx
    let canvas = game.canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle='gray'
    ctx.fillRect(0,0,canvas.width,canvas.height)
   
    if(game.match.state=="running"){
        for(let i=0;i<game.match.actors.length;i++){
            let actor = game.match.actors[i]
            actor.render(game)
        }
        ctx.fillStyle='yellow'
        ctx.fillRect(0,10,game.match.actors[1].health,20)
        ctx.fillRect(canvas.width-100,10,game.match.actors[2].health,20)
        if(game.match.actors[1].meter==60){
            ctx.fillStyle='orange'
        }else{
            ctx.fillStyle='blue'
        }
        ctx.fillRect(0,canvas.height-20,game.match.actors[1].meter,10)
        if(game.match.actors[2].meter==60){
            ctx.fillStyle='orange'
        }else{
            ctx.fillStyle='blue'
        }
        ctx.fillRect(canvas.width-60,canvas.height-20,game.match.actors[2].meter,10)
    }
}

game.input=(inp)=>{
    game.match.handle_input(inp,game)
}

game.freeze_frame=(duration)=>{
    game.freeze_timer=duration
    game.state="freeze"
}

game.update=(timeStamp)=>{
    game.dt = (timeStamp - game.lastTime) / 1000;
    game.lastTime = timeStamp;
    if(game.state=="freeze"){
        game.freeze_timer-=game.dt
        if(game.freeze_timer<=0){
            game.freeze_timer=0
            game.state="running"
        }
    }
    if(game.state=="running"){
        if(game.match.state=="running"){
            game.match.update(game)
        }
    }
    if(game.state=="pause"){}
    game.render();
    requestAnimationFrame(game.update);
}

game.update = game.update.bind(game);

game.init=()=>{
    requestAnimationFrame(game.update);
}

game.init()

document.getElementById("start").onclick=()=>{
    document.getElementById("start-screen").style.display="none"
    game.match.create_match([game.chars[1],game.chars[0]])
}

document.getElementById("pause").onclick=()=>{
    document.getElementById("pause-menu").style.display="flex"
    game.state="pause"
}

document.getElementById("resume").onclick=()=>{
    document.getElementById("pause-menu").style.display="none"
    game.state="running"
}

document.getElementById("restart").onclick=()=>{
    document.getElementById("pause-menu").style.display="none"
    game.state="running"
    game.match.create_match([game.chars[0],game.chars[0]])
}

document.getElementById("toggle-ai").onclick=()=>{
    game.match.ai_enabled=!game.match.ai_enabled
}