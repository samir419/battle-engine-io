let rose = {
    name: "rose",
    width: 78,
    height: 113,
    states:{
        "jump":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:1,
            animations:[
                {image:"jump0.png",duration:0.4},
                {image:"jump1.png",duration:0.2},
                {image:"jump2.png",duration:0.4},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                self.vy=-800
                self.is_grounded=false
                game.playsound("assets/jump.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer=="special 1"){
                    self.state="special 1"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.state_buffer=="special 2"){
                    self.state="special 2"
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
            total_frames:4,
            animations:[
                {image:"dash0.png",duration:0.1},
                {image:"dash1.png",duration:0.1},
                {image:"dash2.png",duration:0.1},
                {image:"dash3.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){self.vx=90*self.direction},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    return
                }
            },
            end:function(game,obj,self){self.vx=0}
        },
        "back dash":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:4,
            animations:[
                {image:"backdash0.png",duration:0.1},
                {image:"backdash1.png",duration:0.1},
                {image:"backdash2.png",duration:0.1},
                {image:"backdash3.png",duration:0.1},
                {image:"backdash4.png",duration:0.1}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){self.vx=90*-self.direction},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    return
                }
            },
            end:function(game,obj,self){self.vx=0}
        },
        "attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.6,
            animations:[
                {image:"attack0.png",duration:0.1},
                {image:"attack1.png",duration:0.1},
                {image:"attack2.png",duration:0.1,damage:7,knockback:-250,knockdown:false,stun:0.3,freeze_frame:0.1,offset:{x:50,y:0}},
                {image:"attack2.png",duration:0.1,damage:7,knockback:-250,knockdown:false,stun:0.3,freeze_frame:0.1,offset:{x:50,y:0}},
                {image:"attack3.png",duration:0.1},
                {image:"attack4.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:130,h:10},
            init:function(game,obj,self){
                self.vx=0
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
            total_frames:1,
            animations:[
                {image:"special0.png",duration:0.25},
                {image:"special1.png",duration:0.5,damage:15,knockback:-300,knockdown:false,stun:0.4,freeze_frame:0.1,offset:{x:50,y:0},custom:function(game,obj,self){
                    let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+50*self.direction,
                        y:self.y+20,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:3,
                        user:self,
                        target:game.match.get_opponent(self,game),
                        animation_frame:0,
                        anim_frame_count:0,
                        animations:[
                            {duration:0.1},
                        ],
                        update:function(self,game){
                            this.x+=this.direction*100*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                opponent.damage({
                                    damage:10,
                                    knockback:-200,
                                    knockdown:false,
                                    stun:0.2,
                                    freeze_frame:0.2
                                },game)
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
                            img.src=`chars/rose/sprites/fireball.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    self.objects.push(fire_ball);
                }},
                {image:"special2.png",duration:0.25,offset:{x:50,y:0}},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-30,w:130,h:20},
            init:function(game,obj,self){
                self.vx=0
                self.enable_physics=false
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){
                self.enable_physics=true
            }
        },
        "special 3":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.8,
            animations:[
                {image:"special30.png",duration:0.2},
                {image:"special31.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2},
                {image:"special32.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2,custom:function(game,obj,self){
                    let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+50*self.direction,
                        y:self.y+20,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:3,
                        user:self,
                        target:game.match.get_opponent(self,game),
                        animation_frame:0,
                        anim_frame_count:0,
                        animations:[
                            {duration:0.1},
                        ],
                        gravity:-300,
                        update:function(self,game){
                            this.x+=this.direction*100*game.dt
                            this.y+=this.gravity*game.dt
                            this.gravity+=300*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                opponent.damage({
                                    damage:20,
                                    knockback:-200,
                                    knockdown:true,
                                    stun:0.2,
                                    freeze_frame:0.2
                                },game)
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
                            img.src=`chars/rose/sprites/fireball.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    self.objects.push(fire_ball);
                }},
                {image:"special33.png",duration:0.2,damage:10,knockback:0,knockdown:false,freeze_frame:0.2},
                {image:"special34.png",duration:0.2},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:-30,y:-50,w:90,h:70},
            init:function(game,obj,self){
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
            total_frames:0.8,
            animations:[
                {image:"special20.png",duration:0.15},
                {image:"special21.png",duration:0.15},
                {image:"special22.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2},
                {image:"special23.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2,custom:function(game,obj,self){
                    let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+100*self.direction,
                        y:self.y+20,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:3,
                        user:self,
                        target:game.match.get_opponent(self,game),
                        animation_frame:0,
                        anim_frame_count:0,
                        animations:[
                            {duration:0.1},
                        ],
                        hit_timer:0,
                        gravity:-300,
                        update:function(self,game){
                            let opponent=this.target
                            if(this.hit_timer>0){
                                this.hit_timer-=game.dt
                            }
                            if(game.physics.aabb(this,opponent,game)){
                                if(this.hit_timer<=0){
                                    opponent.damage({
                                        damage:5,
                                        knockback:-100,
                                        knockdown:false,
                                        stun:0.2,
                                        freeze_frame:0.1
                                    },game)
                                    this.frames-=10*game.dt
                                    this.hit_timer=0.1
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
                            img.src=`chars/rose/sprites/blueball.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    self.objects.push(fire_ball);
                }},
                {image:"special24.png",duration:0.1},
                {image:"special25.png",duration:0.2},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-20,w:90,h:40},
            init:function(game,obj,self){
                self.vx=0
                self.enable_physics=false
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){
                self.enable_physics=true
            }
        },
        "ultimate":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:1,
            animations:[
                {image:"special0.png",duration:0.25},
                {image:"special1.png",duration:0.5,offset:{x:50,y:0},custom:function(game,obj,self){
                    let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+70*self.direction,
                        y:self.y+20,
                        w:90,
                        h:90,
                        direction:self.direction,
                        frames:10,
                        user:self,
                        target:game.match.get_opponent(self,game),
                        animation_frame:0,
                        anim_frame_count:0,
                        hit_timer:0,
                        hit_max:0,
                        animations:[
                            {duration:0.1},
                        ],
                        update:function(self,game){
                            this.x+=this.direction*10*game.dt
                            let opponent=this.target
                             if(this.hit_timer>0){
                                this.hit_timer-=game.dt
                            }
                            if(game.physics.aabb(this,opponent,game)){
                                if(this.hit_timer<=0){
                                    opponent.damage({
                                        damage:10,
                                        knockback:-100,
                                        knockdown:false,
                                        stun:0.2,
                                        freeze_frame:0.1
                                    },game)
                                    self.meter=0
                                    this.frames-=10*game.dt
                                    this.hit_timer=0.1
                                    this.hit_max+=1
                                    if(this.hit_max>5){
                                        this.frames=0
                                        let index = self.objects.indexOf(this)
                                        if (index > -1) {
                                            self.objects.splice(index, 1);
                                        }
                                    }
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
                            img.src=`chars/rose/sprites/bigball.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    self.objects.push(fire_ball);
                }},
                {image:"special2.png",duration:0.25,offset:{x:50,y:0}},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                self.vx=0
                self.enable_physics=false
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){
                self.enable_physics=true
            }
        },
       
       
        "block":{
            update:function(self,game){
                self.vx=0
                self.image="block.png"
                if(self.state_buffer=="attack"){
                    self.state="sweep"
                    self.state_buffer="none"
                    return
                }
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                }
            }
        },
        "sweep":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.6,
            animations:[
                {image:"sweep0.png",duration:0.1,offset:{x:50,y:0}},
                {image:"sweep1.png",duration:0.1,damage:10,knockdown:true,offset:{x:50,y:0},freeze_frame:0.2},
                {image:"sweep1.png",duration:0.1,damage:10,knockdown:true,offset:{x:50,y:0},freeze_frame:0.2},
                {image:"sweep2.png",duration:0.1,offset:{x:50,y:0}},
                {image:"sweep3.png",duration:0.1,offset:{x:50,y:0}},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:10,y:0,w:80,h:30},
            init:function(game,obj,self){
                self.vx=0
                game.playsound("assets/strike.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "example":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:1,
            animations:[
                {image:"idle.png",duration:1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
    }
}

game.chars.push(rose)