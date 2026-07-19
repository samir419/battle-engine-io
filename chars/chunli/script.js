let chunli = {
    name: "chunli",
    width: 60,
    height: 96,
    states:{
        "jump":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"jump.png",duration:1}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
                    if(self.is_grounded){
                        self.vy=-700
                        self.is_grounded=false
                    }
                }
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    return
                }
                self.image=this.animations[this.animation_frame].image
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animations[this.animation_frame].offset){
                        this.offsetx=this.animations[this.animation_frame].offset.x
                        this.offsety=this.animations[this.animation_frame].offset.y
                    }else{this.offsetx=0;this.offsety=0}
                    this.anim_frame_count=0
                }
                this.anim_frame_count+=game.dt
                this.frames-=game.dt
                if(this.frames<=0||self.is_grounded==true){
                    self.vx=0
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    self.state="idle"
                }
            }
        },
        "dash":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"dash.png",duration:4}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=4//1 second
                    self.vx=150*self.direction
                }
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    return
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
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
                    self.vx=0
                    self.state="idle"
                }
            }
        },
        "back dash":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"dash.png",duration:4}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=4//1 second
                    self.vx=100*-self.direction
                }
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
                    return
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
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
                    self.vx=0
                    self.state="idle"
                }
            }
        },
        "attack":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"attack.png",duration:0.05},
                {image:"attack.png",duration:0.2,damage:5,offset:{x:50,y:0}},
                {image:"attack.png",duration:0.05}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    if(self.is_grounded==true){
                        self.vx=0
                    }
                    this.frames=0.3
                    game.playsound("assets/strike.wav")
                }
                this.hitbox.w = self.w*1.5;
                this.hitbox.h = self.h;
                this.hitbox.x = self.x+self.w*self.direction;
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
        },
        "special 1":{
            frames:0,
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special1.png",duration:0.2},
                {image:"special1.png",duration:0.06},
                {image:"special1.png",duration:0.3-0.06},],
            update:function(self,game){
                if(this.frames==0){
                     if(self.is_grounded==true){
                        self.vx=0
                    }
                    this.frames=0.5//1 second
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
                                ctx.strokeRect(this.x,this.y,this.w,this.h)
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
                {image:"special2.png",duration:0.1},
                {image:"special2.png",duration:0.9,damage:5}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
                    self.vx=400*self.direction
                }
                this.hitbox.w = self.w*1.5;
                this.hitbox.h = self.h;
                this.hitbox.x = self.x;
                this.hitbox.y = self.y;
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==1){
                        self.vx=0
                    }
                    if(this.animations[this.animation_frame].offset){
                        this.offsetx=this.animations[this.animation_frame].offset.x
                        this.offsety=this.animations[this.animation_frame].offset.y
                    }else{this.offsetx=0;this.offsety=0}
                    this.anim_frame_count=0
                }
                if(this.animations[this.animation_frame].damage){
                    let opponent=game.match.get_opponent(self,game)
                    if(game.physics.aabb(this.hitbox,opponent,game)){
                        opponent.hit(this.animations[this.animation_frame].damage,self,game)
                        game.hit_effect({frames:0.1,x:opponent.x,y:opponent.y+25*(this.animation_frame-2)})
                    }
                }
                this.frames-=game.dt
                if(this.frames<=0){
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
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
                {image:"special3.png",duration:0.1},
                {image:"special3.png",duration:0.1,damage:5},
                {image:"special3.png",duration:0.1},
                {image:"special3.png",duration:0.1,damage:5},
                {image:"special3.png",duration:0.1},
                {image:"special3.png",duration:0.1,damage:10},
            ],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1.2
                    self.vx=250*self.direction
                }
                this.hitbox.x=self.x-self.w/2
                this.hitbox.y=self.y
                this.hitbox.w=self.w*2
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
                    if(this.animations[this.animation_frame].offset){
                        this.offsetx=this.animations[this.animation_frame].offset.x
                        this.offsety=this.animations[this.animation_frame].offset.y
                    }else{this.offsetx=0;this.offsety=0}
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
        "ultimate":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special2.png",duration:0.1},
                {image:"special2.png",duration:0.9,damage:5},
                {image:"special2.png",duration:0.1},
                {image:"special2.png",duration:0.9,damage:5},
                {image:"special2.png",duration:0.1},
                {image:"special2.png",duration:0.06,damage:15}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=2.16//1 second
                    self.vx=400*self.direction
                }
                this.hitbox.w = self.w*2;
                this.hitbox.h = self.h;
                this.hitbox.x = self.x;
                this.hitbox.y = self.y;
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==2||this.animation_frame==4){
                        self.vx=400*self.direction
                    }
                    if(this.animation_frame==1||this.animation_frame==3||this.animation_frame==5){
                        self.vx=0
                    }
                    if(this.animations[this.animation_frame].offset){
                        this.offsetx=this.animations[this.animation_frame].offset.x
                        this.offsety=this.animations[this.animation_frame].offset.y
                    }else{this.offsetx=0;this.offsety=0}
                    this.anim_frame_count=0
                }
                if(this.animations[this.animation_frame].damage){
                    let opponent=game.match.get_opponent(self,game)
                    if(game.physics.aabb(this.hitbox,opponent,game)){
                        opponent.hit(this.animations[this.animation_frame].damage,self,game)
                        game.hit_effect({frames:0.1,x:opponent.x,y:opponent.y+25*(this.animation_frame-2)})
                    }
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
    }
}

game.chars.push(chunli)