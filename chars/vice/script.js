let vice = {
    name: "vice",
    width: 59,
    height: 103,
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
                        self.vx=200*self.direction
                        self.vy=-600
                        self.is_grounded=false
                    }
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
                {image:"jump.png",duration:0.25}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.25//1 second
                    self.vx=300*self.direction
                    self.vy=-300
                    self.is_grounded=false
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
                if(this.frames<=0||self.is_grounded==true){
                    self.vx=0
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
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
                {image:"jump.png",duration:0.25}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.25//1 second
                    self.vx=300*-self.direction
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
                    self.vx=0
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
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
                {image:"attack.png",duration:0.1},
                {image:"attack.png",duration:0.1,damage:5},
                {image:"attack.png",duration:0.1}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.3
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
        },
        "special 1":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special10.png",duration:0.1},
                {image:"special11.png",duration:0.3,damage:15}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.4//1 second
                }
                this.hitbox.w = self.w/2;
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
                                            self.image="special11.png"
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
        "special 2":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special20.png",duration:0.06},
                {image:"special21.png",duration:0.06},
                {image:"special22.png",duration:0.06},
                {image:"special23.png",duration:0.06},
                {image:"special24.png",duration:0.06},
                {image:"special25.png",duration:0.1,damage:15},
                {image:"special26.png",duration:0.1,damage:15},
                {image:"special27.png",duration:0.1,damage:15},
                {image:"special28.png",duration:0.1},
                {image:"special29.png",duration:0.1}

            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
                }
                this.hitbox.w = 50;
                this.hitbox.h = self.h/2;
                this.hitbox.x = self.x+100*self.direction;
                this.hitbox.y = self.y+50;
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animations[this.animation_frame].damage){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(this.hitbox,opponent,game)){
                            if(opponent.state=="idle"||opponent.state=="block"){
                                game.playsound("assets/grab.wav")
                                opponent.state="being thrown"
                                opponent.states["being thrown"]={
                                    frames:0,
                                    offsetx:0,
                                    offsety:0,
                                    temps:{},
                                    update:function(self,game){
                                        if(this.frames==0){
                                            self.image="knockdown.png"
                                            this.frames=1
                                            self.vy=-900
                                            self.vx=500*self.direction
                                            self.is_grounded=false
                                        }
                                        this.frames-=game.dt
                                        if(this.frames<=0||self.is_grounded==true){
                                            this.frames=0
                                            self.health-=20
                                            self.knockdown()
                                        }
                                    }
                                }
                            }
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
        "special 3":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"special30.png",duration:0.1},
                {image:"special31.png",duration:0.4,damage:5}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.5//1 second
                }
                this.hitbox.w = self.w;
                this.hitbox.h = self.h;
                this.hitbox.x = self.x+30*self.direction;
                this.hitbox.y = self.y;
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    if(this.animation_frame==1){
                        self.vx=400*self.direction
                    }
                    if(this.animations[this.animation_frame].damage){
                        let opponent=game.match.get_opponent(self,game)
                        if(game.physics.aabb(this.hitbox,opponent,game)){
                            opponent.hit(this.animations[this.animation_frame].damage,self,game)
                            self.vx=0
                            this.frames=0
                            this.anim_frame_count=0
                            this.animation_frame=0
                            self.state="idle"
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
                    self.vx=0
                    this.frames=0
                    this.anim_frame_count=0
                    this.animation_frame=0
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
                {image:"special10.png",duration:0.1},
                {image:"special11.png",duration:0.3,damage:15}
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=0.4//1 second
                }
                this.hitbox.w = self.w/2;
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
                                            self.image="special11.png"
                                            this.frames=0.7
                                            self.vy=-800
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
                                            this.frames=0.7
                                            self.vy=-800
                                            self.is_grounded=false
                                        }
                                        this.frames-=game.dt
                                        if(this.frames<=0){
                                            this.frames=0
                                            self.health-=50
                                            self.knockdown()
                                        }
                                    }
                                }
                            }
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
    }
}

game.chars.push(vice)