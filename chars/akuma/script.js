let akuma = {
    name: "akuma",
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
                {image:"jump0.png",duration:0.1},
                {image:"jump1.png",duration:0.1},
                {image:"jump2.png",duration:0.1},
                {image:"jump3.png",duration:0.1},
                {image:"jump4.png",duration:0.6},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){
                self.vx=200*self.direction
                self.vy=-600
                self.is_grounded=false
                game.playsound("assets/jump.wav")
            },
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                if(self.state_buffer=="attack"){
                    self.state="jump attack"
                    self.state_buffer="none"
                    this.anim_frame_count=0
                    this.animation_frame=0
                    this.frames=0
                    return
                }
                if(self.state_buffer=="special 1"){
                    self.state="jump special"
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
            total_frames:0.2,
            animations:[
                {image:"dash.png",duration:1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){},
            update:function(self,game){
                self.vx=500*self.direction
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "back dash":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:2,
            animations:[
                {image:"hype.png",duration:2},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:0,h:0},
            init:function(game,obj,self){},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
                self.meter+=10*game.dt
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    if(self.is_grounded==true){
                        self.state=x
                        self.state_buffer="none"
                    }else{
                        if(self.states[x].arial){
                            self.state=x
                            self.state_buffer="none"
                        }
                    }
                   
                }
            },
            end:function(game,obj,self){}
        },
        "attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.3,
            animations:[
                {image:"attack0.png",duration:0.1},
                {image:"attack1.png",duration:0.1,damage:5,knockback:-50,knockdown:false,stun:0.3,freeze_frame:0.1},
                {image:"attack2.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:100,h:10},
            init:function(game,obj,self){},
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
                {image:"special1.png",duration:0.5,custom:function(game,obj,self){
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
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                        ],
                        update:function(self,game){
                            this.x+=this.direction*100*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                opponent.damage({
                                    damage:10,
                                    knockback:0,
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
                            img.src=`chars/sakura/sprites/hadoken${this.animation_frame}.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    if (!self.objects.some(obj => obj.id === fire_ball.id)) {
                        self.objects.push(fire_ball);
                    }
                }},
                {image:"special2.png",duration:0.25},
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
        "special 2":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:1,
            animations:[
                {image:"special20.png",duration:0.1},
                {image:"special21.png",duration:0.1,damage:10,knockback:-100,knockdown:false,freeze_frame:0.1},
                {image:"special22.png",duration:0.1},
                {image:"special23.png",duration:0.1,damage:10,knockback:-100,knockdown:false,freeze_frame:0.1},
                {image:"special24.png",duration:0.1},
                {image:"special21.png",duration:0.1,damage:10,knockback:-100,knockdown:false,freeze_frame:0.1},
                {image:"special22.png",duration:0.1},
                {image:"special23.png",duration:0.1,damage:10,knockback:-100,knockdown:false,freeze_frame:0.1},
                {image:"special24.png",duration:0.1},
                {image:"special25.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:50,h:40},
            init:function(game,obj,self){
                self.vx=300*self.direction
            },
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
            total_frames:1,
            animations:[
                {image:"special30.png",duration:0.1},
                {image:"special31.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2},
                {image:"special32.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0.2},
                {image:"special33.png",duration:0.7,custom:function(game,obj,self){
                    self.vx=50*self.direction
                    self.vy=-800
                },damage:10,knockback:0,knockdown:true,freeze_frame:0.2}
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:-100,w:70,h:100},
            init:function(game,obj,self){},
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
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:false,freeze_frame:0},
                {image:"ultimate.png",duration:0.1,damage:10,knockback:0,knockdown:true,freeze_frame:0},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:-100,y:-100,w:320,h:320},
            init:function(game,obj,self){},
            update:function(self,game){
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "sweep":{},
        "block":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.1,
            animations:[
                {image:"block.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:70,h:10},
            init:function(game,obj,self){
                self.state="overhead"
            },
            update:function(self,game){
                self.state="overhead"
                game.battle_engine.update_animation(game,this,self)
            },
            end:function(game,obj,self){}
        },
        "overhead":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.5,
            animations:[
                {image:"overhead0.png",duration:0.1},
                {image:"overhead1.png",duration:0.1},
                {image:"overhead2.png",duration:0.1,damage:5,knockback:100,knockdown:false,stun:0.3,freeze_frame:0.2},
                {image:"overhead3.png",duration:0.1,damage:5,knockback:100,knockdown:false,stun:0.3,freeze_frame:0.2},
                {image:"overhead4.png",duration:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:70,h:10},
            init:function(game,obj,self){},
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
            animations:[
                {image:"jumpspecial.png",duration:0.1},
                {image:"jumpspecial.png",duration:0.1,custom:function(game,obj,self){
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
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                            {duration:0.1},
                        ],
                        update:function(self,game){
                            this.x+=this.direction*100*game.dt
                            this.y+=100*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                opponent.damage({
                                    damage:10,
                                    knockback:-200,
                                    knockdown:false,
                                    stun:0.5,
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
                            img.src=`chars/sakura/sprites/hadoken${this.animation_frame}.png`
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
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    if (!self.objects.some(obj => obj.id === fire_ball.id)) {
                        self.objects.push(fire_ball);
                    }
                }},
                {image:"jumpspecial.png",duration:0.1},
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
        "jump attack":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            hitbox:{x:0,y:0,w:0,h:0},
            total_frames:0.3,
            animations:[
                {image:"jumpattack0.png",duration:0.1},
                {image:"jumpattack1.png",duration:0.2,damage:5,knockback:-100,knockdown:false,stun:0.5,freeze_frame:0.1},
            ],
            offsetx:0,
            offsety:0,
            hitbox_data:{x:0,y:0,w:70,h:50},
            init:function(game,obj,self){},
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

game.chars.push(akuma)

example = {
    frames:0,
    hitbox:{x:0,y:0,w:0,h:0},
    animation_frame:0,
    anim_frame_count:0,
    animations:[
        {image:"special10.png",duration:0.3},
        {image:"special11.png",duration:0.06},
        {image:"special11.png",duration:0.7-0.06},],
    offsetx:0,
    offsety:0,
    update:function(self,game){
        if(this.frames==0){
            this.frames=1//1 second
        }
        this.hitbox.w = self.w;
        this.hitbox.h = self.h;
        this.hitbox.x = self.x;
        this.hitbox.y = self.y;
        self.image=this.animations[this.animation_frame].image
        this.anim_frame_count+=game.dt
        if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
            this.animation_frame=(this.animation_frame+1)%this.animations.length
            if(this.animations[this.animation_frame].damage){
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    opponent.hit(this.animations[this.animation_frame].damage,self,game)
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
            this.anim_frame_count=0
            this.animation_frame=0
            self.state="idle"
        }
    }
}