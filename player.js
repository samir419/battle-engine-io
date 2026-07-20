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
        if(this.temp.vel_timer){
            this.x+=this.temp.vx*game.dt*this.direction
            this.y+=this.temp.vy*game.dt
            this.temp.vel_timer-=game.dt
            if(this.temp.vel_timer<=0){
                this.temp.vel_timer=null
            }
        }
       this.states[this.state].update(this,game)
       for(let i=0;i<this.objects.length;i++){
            let obj = this.objects[i]
            obj.update(this,game)
        }
    },
    get_offset:function(i){
        if(i=='x'){
            return this.states[this.state].offsetx?this.states[this.state].offsetx:0
        }
        if(i=='y'){
            return this.states[this.state].offsety?this.states[this.state].offsety:0
        }
    },
    set_velocity:function(data){
        this.temp.vx=data.vx
        this.temp.vy=data.vy
        this.temp.vel_timer=data.duration
    },

    render:function(game){
        let ctx = game.ctx
        let canvas = game.canvas
        let actor = this
        ctx.strokeStyle="green"
        //ctx.strokeRect(actor.x,actor.y,actor.w,actor.h)
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
            ctx.drawImage(img, ((this.w/2)-img.width/2)+this.get_offset('x')*this.direction, ((this.h/2)-img.height/2)+this.get_offset('y'));
        } else {
            ctx.translate(actor.x, actor.y);
            ctx.drawImage(img, ((this.w/2)-img.width/2)+this.get_offset('x')*this.direction, ((this.h/2)-img.height/2)+this.get_offset('y'));
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
                game.playsound("assets/meterup.wav")
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
            game.hit_effect({frames:0.1,x:this.x,y:this.y})
            if(damage>5){
                game.playsound("assets/hit1.wav")
                this.knockdown()
            }else{
                game.playsound("assets/hit.wav")
                this.state="hit"
            }
            if(damage<=20){
                this.meter+=damage-damage/4
                attacker.meter+=damage
            }
            game.freeze_frame(0.1)
        }
        if(this.state=="block"){
            if(damage<=20){
                this.meter+=damage/2
                attacker.meter+=damage/2
            }
            this.block_stun(0.2)
            game.playsound("assets/blockhit.wav")
        }
    },

    damage:function(data,game){
        let damage = data.damage
        let velx = data.knockback? data.knockback:0
        if (!["block","block stun","knockdown","ko"].includes(this.state)){
            this.enable_physics=true
            game.hit_effect({frames:0.1,x:this.x,y:this.y})
            if(data.knockdown){
                game.playsound("assets/hit1.wav")
                this.knockdown()
            }else{
                game.playsound("assets/hit.wav")
                this.state="hit"
            }
        }
        if(this.state=="block"){
            damage=damage/4
            velx=velx/2
        }
        this.health-=damage
        this.set_velocity({vx:velx,vy:0,duration:0.2})
        game.emit_event({name:"player-hit",player:this.id,amount:damage})
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
                for (let key in this.states) {
                    if(this.states[key].frames){
                        this.states[key].frames=0
                    }
                    if(this.states[key].animation_frame){
                        this.states[key].animation_frame=0
                    }
                    if(this.states[key].animation_frame_count){
                        this.states[key].animation_frame_count=0
                    }
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
                    //self.vx=100*-self.direction
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
            temps:{ct:0},
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
                    if(this.temps.ct==0){
                        self.vx=0
                        game.playsound("assets/knockdown.wav")
                    }
                    this.temps.ct++
                }
                if(this.frames<=0){
                    this.temps.ct=0
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
                this.hitbox.w=self.w/2
                this.hitbox.h=self.h
                this.frames-=game.dt
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    if(opponent.state=="idle"||opponent.state=="block"){
                        game.playsound("assets/grab.wav")
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
                                    self.health-=20
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
            offsety:40,
            temps:{},
            update:function(self,game){
                if(!this.temps.h){
                    this.temps.h=self.h/2
                }
                //self.h=this.temps.h
                game.physics.apply_physics(self,game)
                self.vx=0
                self.image="ko.png"
            }
        },
    }

    ,event:function(data){
        if(data.name=="player-hit"){
            if(this.state=="ultimate")return
            if(this.id==data.player){
                this.meter+=data.amount/2
            }else{
                this.meter+=data.amount
            }
        }
    }
}