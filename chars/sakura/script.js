let sakura = {
    name: "sakura",
    width: 76,
    height: 87,
    states:{
        "jump":{
            update:function(self,game){
                if(self.temp.jump){
                    let opponent
                    /*for(let i=0;i<game.match.actors.length;i++){
                        if(game.match.actors[i].id!=self.id && game.match.actors[i].id!=undefined){
                            opponent=game.match.actors[i]
                        }
                    }
                    let distance=Math.abs(opponent.x-self.x)
                    if(distance<150){
                        self.set_state("attack")    
                    }*/
                    if(self.is_grounded==true){
                        self.state="idle"
                        self.vx=0
                        self.vy=0
                        self.temp.jump=false
                    }
                }else{
                    self.vx=300*self.direction
                    self.vy=-700
                    self.is_grounded=false
                    self.temp.jump=true
                    self.image="jump.png"
                    game.playsound("assets/jump.wav")
                }
                
            }
        },
        "dash":{
            dash_counter:0,
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"dash0.png",duration:0.1},
                {image:"dash1.png",duration:0.1},
                {image:"dash3.png",duration:0.1},
                {image:"dash4.png",duration:0.1},
                {image:"dash5.png",duration:0.1},
                {image:"dash6.png",duration:0.1},
            ],
            target:null,
            update:function(self,game){
                if(this.dash_counter==0){
                    self.vx=300*self.direction
                    this.dash_counter=2
                    this.target=game.match.get_opponent(self,game)
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    this.anim_frame_count=0
                }
                this.dash_counter-=game.dt
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.dash_counter=0
                    return
                }
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
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"backdash0.png",duration:0.1},
                {image:"backdash1.png",duration:0.05},
                {image:"backdash2.png",duration:0.05},
                {image:"backdash3.png",duration:0.05}
            ],
            update:function(self,game){
                if(this.dash_counter==0){
                    self.vx=300*-self.direction
                    this.dash_counter=0.25//0.25 seconds
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    this.anim_frame_count=0
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
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"attack0.png",duration:0.05},
                {image:"attack1.png",duration:0.2,damage:5},
                {image:"attack2.png",duration:0.05}
            ],
            update:function(self,game){
                if(this.frames==0){
                    if(self.is_grounded==true){
                        self.vx=0
                    }
                    this.frames=0.3
                    game.playsound("assets/strike.wav")
                }
                this.hitbox.x=self.x+50*self.direction
                this.hitbox.y=self.y+20
                this.hitbox.w=50
                this.hitbox.h=50
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
                    this.anim_frame_count=0
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    self.vx=0
                    self.vy=0
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "special 1":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special10.png",duration:0.3},
                {image:"special11.png",duration:0.06},
                {image:"special11.png",duration:0.7-0.06},],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==1){
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
            animations:[
                {image:"special 2 0.png",duration:0.1},
                {image:"special 2 1.png",duration:0.1,damage:10},
                {image:"special 2 0.png",duration:0.1},
                {image:"special 2 1.png",duration:0.1,damage:10},
                {image:"special 2 0.png",duration:0.1},
                {image:"special 2 1.png",duration:0.1,damage:10},
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.6
                    self.vx=250*self.direction
                    self.vy=-400
                    self.is_grounded=false
                }
                this.hitbox.x=self.x-20
                this.hitbox.y=self.y+20
                this.hitbox.w=self.w+40
                this.hitbox.h=50
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
                    this.anim_frame_count=0
                }
                this.frames-=game.dt
                if(this.frames<=0||(self.frames>0&&self.is_grounded==true)){
                    this.frames=0
                    self.vx=0
                    self.state="idle"
                }
            }
        },
        "special 3":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            damage:5,
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special30.png",duration:0.1},
                {image:"special31.png",duration:0.1,damage:5},
                {image:"special32.png",duration:0.1,damage:5},
                {image:"special33.png",duration:0.1,damage:5},
                {image:"special34.png",duration:0.1,damage:5},
                {image:"special35.png",duration:0.1,damage:10},
                {image:"special36.png",duration:0.2,damage:10},
                {image:"special37.png",duration:0.1,damage:10},
                {image:"special38.png",duration:0.1,damage:10},
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1
                    self.vx=200*self.direction
                }
                this.hitbox.x=self.x+50*self.direction
                this.hitbox.y=self.y-20
                this.hitbox.w=50
                this.hitbox.h=50
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==6){
                        self.vy=-600
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
                    this.animation_frame=0
                    self.vx=0
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "ultimate":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special10.png",duration:0.3},
                {image:"special11.png",duration:0.06},
                {image:"special11.png",duration:0.7-0.06},],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
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
                            w:self.w,
                            h:self.h,
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
                                    opponent.hit(50,this.user,game)
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
                                img.src=`chars/sakura/sprites/hadokenS${this.animation_frame}.png`
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
        }
    }
}

game.chars.push(sakura)

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