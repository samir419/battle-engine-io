let game = {}

game.canvas = document.getElementById('game-canvas');
game.ctx = game.canvas.getContext('2d');
game.canvas.width = 384
game.canvas.height = 224
game.lastTime = 0;
game.char_paths=[
    "chars/sakura",
    "chars/lilith",
    "chars/hibiki",
    "chars/vice"
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


game.playsound=(src)=>{
    let sound = new Audio()
    sound.src=src
    sound.play()
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

game.event=(data)=>{
    if(data.name=="end match"){
        let p1 = game.chars[Math.floor(Math.random()*game.chars.length)]
        let p2 = game.chars[Math.floor(Math.random()*game.chars.length)]
        game.match.create_match([p1,p2])
    }
}

game.init()

document.getElementById("start").onclick=()=>{
    document.getElementById("start-screen").style.display="none"
    document.getElementById("character-select").style.display="flex"
    let selectnum=1
    let p1
    let p2
    function char_select(){
        document.getElementById("char-renders").innerHTML=""
        document.getElementById("chrlog").textContent=`player ${selectnum} select--`
        for(let i=0;i<game.chars.length;i++){
            let btn = document.createElement("button")
            btn.classList="btn"
            btn.textContent=game.chars[i].name
            btn.onclick=()=>{
                if(selectnum==1){
                    p1 = game.chars[i]
                    selectnum++
                    char_select()
                }else{
                    p2 = game.chars[i]
                    document.getElementById("character-select").style.display="none"
                    game.match.create_match([p1,p2])
                }
            }
            document.getElementById("char-renders").append(btn)
        }
    }
    char_select()
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
    document.getElementById("character-select").style.display="flex"
    let selectnum=1
    let p1
    let p2
    function char_select(){
        document.getElementById("char-renders").innerHTML=""
        document.getElementById("chrlog").textContent=`player ${selectnum} select--`
        for(let i=0;i<game.chars.length;i++){
            let btn = document.createElement("button")
            btn.classList="btn"
            btn.textContent=game.chars[i].name
            btn.onclick=()=>{
                if(selectnum==1){
                    p1 = game.chars[i]
                    selectnum++
                    char_select()
                }else{
                    p2 = game.chars[i]
                    document.getElementById("character-select").style.display="none"
                    game.state="running"
                    game.match.create_match([p1,p2])
                }
            }
            document.getElementById("char-renders").append(btn)
        }
    }
    char_select()
}

document.getElementById("toggle-ai").onclick=()=>{
    game.match.ai_enabled=!game.match.ai_enabled
}

function handleKey(e){
    switch(e.key){
        case "w":
            game.input('jump')
            break;
        case "s":
            game.match.actors[1].set_state('block')
            break;
        case "d":
            if(game.match.actors[1].direction==1){
                game.input('dash')
            }else{
                game.input('back dash')
            }
            break;
        case "a":
            if(game.match.actors[1].direction==1){
                game.input('back dash')
            }else{
                game.input('dash')
            }
            break;
        case "j":
            game.match.actors[1].set_state('attack')
            break;
        case "k":
            game.match.actors[1].set_state('special 1')
            break;
        case "l":
            game.match.actors[1].set_state('special 2')
            break;
        case "i":
            game.match.actors[1].set_state('special 3')
            break;
        case "o":
            game.match.actors[1].handle_input('ultimate', game)
            break;
        case "p":
            game.match.actors[1].set_state('throw')
            break;
    }
}

document.addEventListener("keydown", handleKey);

function addSwipeListener(element, callback, minDistance = 50){

    let startX;
    let startY;

    element.addEventListener("touchstart", (e) => {

        let t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;

    });

    element.addEventListener("touchend", (e) => {

        let t = e.changedTouches[0];

        let dx = t.clientX - startX;
        let dy = t.clientY - startY;

        if(Math.abs(dx) == Math.abs(dy)){
            callback("none")
            return
        }

        if(Math.abs(dx) > Math.abs(dy)){

            if(Math.abs(dx) > minDistance){
                callback(dx > 0 ? "right" : "left");
            }

        } else {

            if(Math.abs(dy) > minDistance){
                callback(dy > 0 ? "down" : "up");
            }

        }

    });

}


addSwipeListener(document.getElementById("touch-screen-left"), (direction) => {
    if(direction=="none"){
        game.match.actors[1].set_state('block')
    }
    if(direction=='up'){
        game.input('jump')
    }
    if(direction == 'down'){
        game.match.actors[1].set_state('throw')
    }
    if(direction == 'right'){
        game.input('dash')
    }
    if(direction == 'left'){
        game.input('back dash')
    }
});

addSwipeListener(document.getElementById("touch-screen-right"), (direction) => {
    if(direction=="none"){
        game.match.actors[1].set_state('attack')
    }
    if(direction=='up'){
        game.match.actors[1].set_state('special 3')
    }
    if(direction == 'down'){
        game.match.actors[1].handle_input('ultimate', game)
    }
    if(direction == 'right'){
        game.match.actors[1].set_state('special 1')
    }
    if(direction == 'left'){
        game.match.actors[1].set_state('special 2')
    }
});