let game = {}

game.canvas = document.getElementById('game-canvas');
game.ctx = game.canvas.getContext('2d');
game.canvas.width = 384
game.canvas.height = 224
game.lastTime = 0;
game.char_paths=[
    "chars/sakura"
]
game.chars=[]
for(let i=0;i<game.char_paths.length;i++){
    let script = document.createElement("script")
    script.src=`${game.char_paths[0]}/script.js`
    document.querySelector("body").appendChild(script)
}

game.physics = physics
game.battle_engine = battle_engine
game.match = match

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
        ctx.fillStyle='blue'
        ctx.fillRect(0,canvas.height-20,game.match.actors[1].meter,10)
        ctx.fillRect(canvas.width-60,canvas.height-20,game.match.actors[2].meter,10)
    }
}

game.input=(inp)=>{
    game.match.handle_input(inp,game)
}

game.update=(timeStamp)=>{
    game.dt = (timeStamp - game.lastTime) / 1000;
    game.lastTime = timeStamp;
    if(game.match.state=="running"){
        game.match.update(game)
    }
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
    game.match.create_match([game.chars[0],game.chars[0]])
}

document.getElementById("pause").onclick=()=>{
    document.getElementById("pause-menu").style.display="flex"
    game.match.state="pause"
}

document.getElementById("resume").onclick=()=>{
    document.getElementById("pause-menu").style.display="none"
    game.match.state="running"
}

document.getElementById("restart").onclick=()=>{
    document.getElementById("pause-menu").style.display="none"
    game.match.create_match([game.chars[0],game.chars[0]])
}

document.getElementById("toggle-ai").onclick=()=>{
    game.match.ai_enabled=!game.match.ai_enabled
}