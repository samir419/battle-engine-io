let player = {
    x:0,y:0,w:0,h:0,
    vx:0,
    vy:0,
    health:100,
    meter:0,
    path:"",
    direction:1,
    is_grounded:false,
    temp:{},
    image:"idle.png",
    state:"idle",
    state_buffer:"none",
    objects:[],
    update:function(game){
        if(this.health<=0){
            this.state="ko"
            this.states[this.state].update(this,game)
            return
        }
        if(this.meter>60){
            this.meter=60
        }
       game.physics.apply_physics(this,game)
       this.states[this.state].update(this,game)
       for(let i=0;i<this.objects.length;i++){
            let obj = this.objects[i]
            obj.update(this,game)
        }
    },

    render:function(game){
        let ctx = game.ctx
        let canvas = game.canvas
        let actor = this
        ctx.strokeStyle="green"
        ctx.strokeRect(actor.x,actor.y,actor.w,actor.h)
        if(actor.states[actor.state].hitbox){
            let hitbox = actor.states[actor.state].hitbox
            ctx.strokeStyle="red"
            ctx.strokeRect(hitbox.x,hitbox.y,hitbox.w,hitbox.h)
        }
        let img = new Image()
        img.src=actor.path+this.image
        ctx.save();
        if (actor.direction === -1) {
            ctx.translate(actor.x + actor.w, actor.y);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);
        } else {
            ctx.translate(actor.x, actor.y);
            ctx.drawImage(img, 0, 0);
        }
        ctx.restore(); 
        for(let i=0;i<actor.objects.length;i++){
            let obj = actor.objects[i]
            obj.render(actor,game)
        }
    },

    handle_input:function(inp,game){
        if(inp=="ultimate"){
            if(this.meter>=60){
                this.meter-=60
                this.set_state(inp)
            }
            return
        }
        this.set_state(inp)
    },

    set_state:function(state){
        if(this.state=="idle"||this.state=="block"){
            this.state=state
        }else{
            this.state_buffer=state
        }
    },

    hit:function(damage){
        this.health-=damage
        this.temp.received_damage=damage
        if(damage>5){
            this.knockdown()
        }else{
            this.meter+=5
            this.state="hit"
        }
        
    },

    block_stun:function(time){
        this.state="block stun"
        this.meter+=1
        this.temp.block_stun_time=time
    },

    knockdown:function(){
        this.meter+=7
        this.state="knockdown"
    },

    states:{}
}