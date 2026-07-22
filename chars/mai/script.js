let mai = {
    name: "mai",
    width: 58,
    height: 87,
    states:{
        "jump":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:5,
            animations:[
                {image:"backdash.png",duration:0.1},
                {image:"backdash.png",duration:4.9}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                self.vx=300*self.direction
                self.vy=-700
                self.is_grounded=false
                //game.playsound("assets/jump.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer=="special 3"){
                    self.state="jump special"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.state_buffer=="attack"){
                    self.state="jump attack"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.is_grounded==true){
                    self.state="idle"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    self.vx=0
                    self.vy=0
                }
            },
            end:function(game,obj,self){
                self.vx=0
                self.vy=0
            }
        },
        "dash":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.5,
            temps:{},
            animations:[
                {image:"dash0.png",duration:0.1},
                {image:"dash1.png",duration:0.1},
                {image:"dash2.png",duration:0.1},
                {image:"dash3.png",duration:0.1},
                {image:"dash4.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:40,y:-15,w:50,h:120},
            init:function(game,obj,self){
                self.enable_physics=false
                this.temps.func=self.hit
                this.temps.direction=self.direction
                self.hit=function(){}
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                self.x+=250*this.temps.direction*game.dt
            },
            end:function(game,obj,self){
                self.enable_physics=true
                self.hit=this.temps.func
            }
        },
        "back dash":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:5,
            animations:[
                {image:"backdash.png",duration:0.1},
                {image:"backdash.png",duration:4.9}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                self.vx=-300*self.direction
                self.vy=-700
                self.is_grounded=false
                game.playsound("assets/jump.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer=="special 1"){
                    self.state="jump special"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.state_buffer=="attack"){
                    self.state="jump attack"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.is_grounded==true){
                    self.state="idle"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    self.vx=0
                    self.vy=0
                }
            },
            end:function(game,obj,self){
                self.vx=0
                self.vy=0
            }
        },
        "attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.3,
            animations:[
                {image:"attack.png",duration:0.1},
                {image:"attack.png",duration:0.1,damage:5,knockback:-100},
                {image:"attack.png",duration:0.1}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-40,w:60,h:30},
            init:function(game,obj,self){
                game.playsound("assets/strike.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "special 1":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.5,
            animations:[
                {image:"special10.png",duration:0.2},
                {image:"attack.png",duration:0.3,
                    custom:function(game,obj,self){
                        let fire_ball = {
                            id:`fan ${self.id}`,
                            x:self.x+50*self.direction,
                            y:self.y+20,
                            w:30,
                            h:30,
                            direction:self.direction,
                            frames:3,
                            user:self,
                            target:game.match.get_opponent(self,game),
                            update:function(self,game){
                                this.x+=this.direction*200*game.dt
                                let opponent=this.target
                                if(game.physics.aabb(this,opponent,game)){
                                    opponent.hit(10,this.user,game)
                                    this.frames=0
                                    let index = self.objects.indexOf(this)
                                    if (index > -1) {
                                        self.objects.splice(index, 1);
                                    }
                                }
                                this.frames-=game.dt
                                if(this.frames<=0){
                                    this.frames=0
                                    let index = self.objects.indexOf(this)
                                    if (index > -1) {
                                        self.objects.splice(index, 1);
                                    }
                                }
                            },
                            render:function(self,game){
                                let ctx = game.ctx
                                let canvas = game.canvas
                                let img = new Image()
                                let actor=this
                                let center = {x:this.x+this.w/2,y:this.y+this.h/2}
                                img.src=`chars/mai/sprites/fan.png`
                                ctx.save();
                                if (actor.direction === -1) {
                                    ctx.translate(actor.x + actor.w, actor.y);
                                    ctx.scale(-1, 1);
                                    ctx.drawImage(img, (this.w/2)-img.width/2, (this.h/2)-img.height/2);
                                } else {
                                    ctx.translate(actor.x, actor.y);
                                    ctx.drawImage(img, (this.w/2)-img.width/2, (this.h/2)-img.height/2);
                                }
                                ctx.restore(); 
                                ctx.strokeStyle="orange"
                                //ctx.strokeRect(this.x,this.y,this.w,this.h)
                            }
                        }
                        if (!self.objects.some(obj => obj.id === fire_ball.id)) {
                            self.objects.push(fire_ball);
                        }
                    }
                },
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                this.target=game.match.get_opponent(self,game)
                self.vx=0
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "special 2":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.6,
            animations:[
                {image:"special20.png",duration:0.1},
                {image:"special21.png",duration:0.1},
                {image:"special22.png",duration:0.1,damage:10,knockback:-100},
                {image:"special23.png",duration:0.1,damage:10,knockdown:true},
                {image:"special24.png",duration:0.1},
                {image:"special25.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-20,w:100,h:30},
            init:function(game,obj,self){},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "special 3":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.8,
            animations:[
                {image:"special30.png",duration:0.1},
                {image:"special31.png",duration:0.1,damage:15,knockdown:true},
                {image:"special32.png",duration:0.1,damage:15,knockdown:true},
                {image:"special34.png",duration:0.5},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-45,w:90,h:120},
            init:function(game,obj,self){
                self.vx=200*self.direction
                self.vy=-700
                self.is_grounded=false
                game.playsound("assets/jump.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "ultimate":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:1,
            animations:[
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5},
                {image:"ultimate.png",duration:0.1,damage:5,knockdown:true}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:-50,y:-200,w:58+75,h:97*3},
            init:function(game,obj,self){self.vx=0},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "jump special":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.3,
            temps:{},
            animations:[
                {image:"jumpspecial.png",duration:0.1},
                {image:"jumpspecial.png",duration:0.1,damage:15,knockdown:true},
                {image:"jumpspecial.png",duration:0.1,damage:15,knockdown:true},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:40,y:20,w:80,h:60},
            init:function(game,obj,self){
                self.set_velocity({vx:200*self.direction,vy:200,duration:0.3})
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){
                self.vx=0
            }
        },
        "jump attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.4,
            animations:[
                {image:"jumpattack.png",duration:0.1},
                {image:"jumpattack.png",duration:0.1,
                    custom:function(game,obj,self){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(obj.hitbox,opponent,game)){
                            opponent.damage({
                                damage:5,
                                knockback:0,
                                knockdown:false,
                            },game)
                            self.vy=-700
                        }
                    }
                },
                {image:"jumpattack.png",duration:0.1,
                    custom:function(game,obj,self){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(obj.hitbox,opponent,game)){
                            opponent.damage({
                                damage:5,
                                knockback:0,
                                knockdown:false,
                            },game)
                            self.vy=-700
                        }
                    }
                },
                {image:"jumpattack.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:-25,y:40,w:50,h:20},
            init:function(game,obj,self){
                game.playsound("assets/strike.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
    }
}

game.chars.push(mai)

