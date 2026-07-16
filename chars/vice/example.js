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
                {image:"jump.png",duration:0.06},
            ],
            offsetx:0,
            offsety:0,
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1//1 second
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    let current = this.animations[this.animation_frame]
                    if(current==0){
                        if(self.is_grounded){
                            self.vx=200*self.direction
                            self.vy=-300
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
        "dash":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "back dash":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "attack":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "special 1":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "special 2":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "special 3":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
        },
        "ultimate":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            animation_frame:0,
            anim_frame_count:0,
            animations:[
                {image:"idle.png",duration:0.1}
            ],
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
    }
}

game.chars.push(vice)