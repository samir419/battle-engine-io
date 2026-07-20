let lilith = {
    name: "lilith",
    width: 58,
    height: 97,
    states:{
        "jump":{
            update:function(self,game){
                if(self.temp.jump){
                    let opponent = game.match.get_opponent(self,game)
                    let distance=Math.abs(opponent.x-self.x)
                    if(distance<150){
                        self.state="jump attack"
                        self.temp.jump=false
                    }
                    if(self.is_grounded==true){
                        self.state="idle"
                        self.vx=0
                        self.vy=0
                        self.temp.jump=false
                    }
                }else{
                    if(!self.is_grounded)return
                    game.playsound("assets/jump.wav")
                    self.vx=300*self.direction
                    self.vy=-600
                    self.is_grounded=false
                    self.temp.jump=true
                    self.image="jump.png"
                }
                
            }
        },
        "dash":{
            dash_counter:0,
            target:null,
            update:function(self,game){
                if(this.dash_counter==0){
                    self.vx=400*self.direction
                    this.dash_counter=0.25//0.25 seconds
                    self.image="dash.png"
                    this.target=game.match.get_opponent(self,game)
                }
                this.dash_counter-=game.dt
                let distance=Math.abs(this.target.x-self.x)
                if(distance<90){
                    self.state="attack"
                    this.dash_counter=0
                    return
                }
                if(this.dash_counter<=0){
                    this.dash_counter=0
                    self.state="idle"
                    self.vx=0
                }
                
            }
        },
        "back dash":{
            dash_counter:0,
            available_states:["jump"],
            update:function(self,game){
                if(this.dash_counter==0){
                    self.vx=350*-self.direction
                    this.dash_counter=0.25//0.25 seconds
                    self.image="back dash.png"
                }
                this.dash_counter-=game.dt
                if(this.dash_counter<=0){
                    this.dash_counter=0
                    self.state="idle"
                    self.vx=0
                }
                
            }
        },
        "attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.3,
            animations:[
                {image:"attack0.png",duration:0.1},
                {image:"attack3.png",duration:0.1,damage:5,knockback:-100},
                {image:"attack4.png",duration:0.1}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:40,y:15,w:50,h:20},
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
            animations:[
                {image:"special1.png",duration:0.1},
                {image:"special1.png",duration:0.06},
                {image:"special1.png",duration:0.4-0.06},
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.5//0.5 seconds
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==1){
                        let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+50*self.direction,
                        y:self.y,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:4,
                        user:self,
                        target:game.match.get_opponent(self,game),
                        animation_frame:0,
                        anim_frame_count:0,
                        animations:[
                            {image:"fb0.png",duration:0.1},
                            {image:"fb1.png",duration:0.1},
                            {image:"fb2.png",duration:0.1},
                            {image:"fb3.png",duration:0.1},
                            {image:"fb4.png",duration:0.1},
                            {image:"fb5.png",duration:0.1}
                        ],
                        update:function(self,game){
                            this.x+=this.direction*50*game.dt
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
                            img.src=`chars/lilith/sprites/${this.animations[this.animation_frame].image}`
                            this.anim_frame_count+=game.dt
                            if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                                this.animation_frame=(this.animation_frame+1)%this.animations.length
                                this.anim_frame_count=0
                            }
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
                    this.anim_frame_count=0
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "special 2":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            total_frames:0.6,
            animations:[
                {image:"special21.png",duration:0.1},
                {image:"special20.png",duration:0.1,damage:5,knockback:-50},
                {image:"special21.png",duration:0.1},
                {image:"special20.png",duration:0.1,damage:5,knockback:-50},
                {image:"special21.png",duration:0.1},
                {image:"special20.png",duration:0.1,damage:5,knockback:-50},
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=this.total_frames
                    self.vx=300*self.direction
                }
                this.hitbox.w = self.w * 2;
                this.hitbox.h = self.h / 4;
                this.hitbox.x = self.x + (self.w - this.hitbox.w) / 2;
                this.hitbox.y = self.y + (self.h - this.hitbox.h) / 2;
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    let current = this.animations[this.animation_frame]
                    if(current.custom){
                        current.custom(self,game)
                    }
                    if(this.animations[this.animation_frame].damage){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(this.hitbox,opponent,game)){
                            opponent.damage({
                                damage:current.damage,
                                knockback:current.knockback,
                                knockdown:current.knockdown?current.knockdown:false,
                            },game)
                        }
                    }
                    if(this.animations[this.animation_frame].offset){
                        this.offsetx=this.animations[this.animation_frame].offset.x
                        this.offsety=this.animations[this.animation_frame].offset.y
                    }else{this.offsetx=0;this.offsety=0}
                    this.anim_frame_count=0
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    this.frames=0
                    this.animation_frame=0
                    this.anim_frame_count=0
                    self.vx=0
                    self.state="idle"
                }
            }
        },
        "special 3":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special3.png",duration:0.1,damage:15},
                {image:"special3.png",duration:0.06,damage:15},
                {image:"special3.png",duration:0.65-0.06,damage:15},
            ],
            update:function(self,game){
                if(this.frames==0){
                    if(self.is_grounded==false){
                        self.state="idle"
                        return
                    }
                    this.frames=0.75
                }
                this.hitbox.x=self.x+20*self.direction
                this.hitbox.y=self.y-20
                this.hitbox.w=100
                this.hitbox.h=50
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==1){
                        self.vy=-800
                        self.vx=100*self.direction
                        self.is_grounded=false
                    }
                    if(this.animations[this.animation_frame].damage){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(this.hitbox,opponent,game)){
                            opponent.hit(this.animations[this.animation_frame].damage,self,game)
                        }
                    }
                    this.anim_frame_count=0
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    this.frames=0
                    self.vx=0
                    self.state="idle"
                }
            }
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
            hitbox_data:{x:-25,y:-25,w:58+75,h:97+75},
            init:function(game,obj,self){
                self.enable_physics=false
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                self.x+=self.direction*150*game.dt
                self.y-=130*game.dt
                self.is_grounded=false
            },
            end:function(game,obj,self){
                self.vx=0
                self.enable_physics=true
            }
        },
        "jump attack":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"jumpattack0.png",duration:0.1},
                {image:"jumpattack1.png",duration:0.1},
                {image:"jumpattack2.png",duration:0.1}
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.4
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(this.hitbox,opponent,game)){
                            opponent.hit(5,self,game)
                        }
                    }
                    this.anim_frame_count=0
                }
                this.hitbox.x=self.x-20
                this.hitbox.y=self.y
                this.hitbox.w=self.w+40
                this.hitbox.h=self.h/2
                this.frames-=game.dt
                if(this.frames<=0||self.is_grounded==true){
                    self.vx=0
                    self.vy=0
                    this.frames=0
                    self.state="idle"
                }
            }
        }
    }
}

game.chars.push(lilith)