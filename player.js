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
    enable_physics:true,
    update:function(game){
        if(this.health<=0){
            this.state="ko"
            this.states[this.state].update(this,game)
            return
        }
        if(this.meter>60){
            this.meter=60
        }
        if(this.enable_physics){
            game.physics.apply_physics(this,game)
        }
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
            ctx.drawImage(img, 0+(this.states[this.state].offsetx?this.states[this.state].offsetx:0), 0+(this.states[this.state].offsety?this.states[this.state].offsety:0));
        } else {
            ctx.translate(actor.x, actor.y);
            ctx.drawImage(img, 0+(this.states[this.state].offsetx?this.states[this.state].offsetx:0), 0+(this.states[this.state].offsety?this.states[this.state].offsety:0));
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
                game.freeze_frame(0.4)
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

    hit:function(damage,attacker,game){
        if (!["block","block stun","knockdown","hit","ko"].includes(this.state)){
            this.health-=damage
            this.temp.received_damage=damage
            this.enable_physics=true
            if(damage>5){
                this.knockdown()
            }else{
                this.state="hit"
            }
            if(damage<=20){
                this.meter+=damage-damage/4
                attacker.meter+=damage
            }
            game.freeze_frame(0.2)
        }
        if(this.state=="block"){
            if(damage<=20){
                this.meter+=damage/2
                attacker.meter+=damage/2
            }
            this.block_stun(0.5)
        }
    },

    block_stun:function(time){
        this.state="block stun"
        this.temp.block_stun_time=time
    },

    knockdown:function(){
        this.state="knockdown"
    },

    states:{},

    default_states:{
        "idle":{
            init:function(self,game){},
            update:function(self,game){
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                }
                self.enable_physics=true
                self.image="idle.png"
            }
        },
        "hit":{
            frames:0,
            update:function(self,game){
                if(this.frames==0){
                    self.image="hit.png"
                    this.frames=0.2
                    self.vx=100*-self.direction
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    self.vx=0
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "block":{
            update:function(self,game){
                self.vx=0
                self.image="block.png"
            }
        },
        "block stun":{
            update:function(self,game){
                self.temp.block_stun_time-=game.dt
                self.image="block.png"
                if(!game.match.check_boundary(self,game)){
                    self.x+=-100*self.direction*game.dt
                }
                if(self.temp.block_stun_time<=0){
                    self.temp.block_stun_time=0
                    self.state="block"
                }
            }
        },
        "knockdown":{
            frames:0,
            offsetx:0,
            offsety:0,
            temps:{},
            update:function(self,game){
                if(this.frames==0){
                    self.image="knockdown.png"
                    this.frames=1
                    self.vx=100*-self.direction
                    self.vy=-400
                    self.is_grounded=false
                    this.temps.h=self.h
                    self.h=self.h/2
                }
                this.frames-=game.dt
                if(this.frames<=0.5){
                    self.vx=0
                }
                if(this.frames<=0){
                    self.h = this.temps.h
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "throw":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            update:function(self,game){
                if(this.frames==0){
                    self.image="idle.png"
                    this.frames=0.2//0.5 seconds
                }
                this.hitbox.x=self.x+self.w*self.direction
                this.hitbox.y=self.y
                this.hitbox.w=self.w
                this.hitbox.h=self.h
                this.frames-=game.dt
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    if(opponent.state=="idle"||opponent.state=="block"){
                        opponent.health-=20
                        self.state="throwing"
                        opponent.state="being thrown"
                        self.states["throwing"]={
                            frames:0,
                            offsetx:0,
                            offsety:0,
                            temps:{},
                            update:function(self,game){
                                if(this.frames==0){
                                    self.image="idle.png"
                                    this.frames=0.6
                                    self.vy=-600
                                    self.is_grounded=false
                                }
                                this.frames-=game.dt
                                if(this.frames<=0){
                                    this.frames=0
                                    self.state="idle"
                                }
                            }
                        }
                        opponent.states["being thrown"]={
                            frames:0,
                            offsetx:0,
                            offsety:0,
                            temps:{},
                            update:function(self,game){
                                if(this.frames==0){
                                    self.image="idle.png"
                                    this.frames=0.6
                                    self.vy=-600
                                    self.is_grounded=false
                                }
                                this.frames-=game.dt
                                if(this.frames<=0){
                                    this.frames=0
                                    self.knockdown()
                                }
                            }
                        }
                    }
                }
                if(this.frames<=0){
                    self.vx=0
                    self.vy=0
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "throwing":{},
        "being thrown":{},
        "ko":{
            offsetx:0,
            offsety:0,
            temps:{},
            update:function(self,game){
                if(!this.temps.h){
                    this.temps.h=self.h/2
                }
                self.h=this.temps.h
                game.physics.apply_physics(self,game)
                self.image="ko.png"
            }
        },
    }
}