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
                    self.vx=400*self.direction
                    self.vy=-600
                    self.is_grounded=false
                    self.temp.jump=true
                    self.image="jump.png"
                }
                
            }
        },
        "dash":{
            dash_counter:0,
            available_states:["jump"],
            update:function(self,game){
                if(this.dash_counter==0){
                    self.vx=600*self.direction
                    this.dash_counter=0.25//0.25 seconds
                    self.image="dash.png"
                }
                this.dash_counter-=game.dt
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
                    self.vx=600*-self.direction
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
            hitbox:{x:0,y:0,w:0,h:0},
            update:function(self,game){
                if(this.frames==0){
                    if(self.is_grounded==true){
                        self.vx=0
                    }
                    self.image="attack.png"
                    this.frames=0.5//0.5 seconds
                }
                this.hitbox.x=self.x+50*self.direction
                this.hitbox.y=self.y+20
                this.hitbox.w=30
                this.hitbox.h=30
                this.frames-=game.dt
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    opponent.hit(5,self,game)
                }
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
            update:function(self,game){
                if(this.frames==0){
                    self.image="special.png"
                    this.frames=1//1 second
                    let fire_ball = {
                        id:`fireball ${self.id}`,
                        x:self.x+50*self.direction,
                        y:self.y+20,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:2,
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
                            ctx.strokeStyle="orange"
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    if (!self.objects.some(obj => obj.id === fire_ball.id)) {
                        self.objects.push(fire_ball);
                    }
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
                {image:"special 2 1.png",duration:0.1},],
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1
                    self.vx=400*self.direction
                }
                self.image=this.animations[this.animation_frame].image
                this.anim_frame_count+=game.dt
                if(this.anim_frame_count>=this.animations[this.animation_frame].duration){
                    this.animation_frame=(this.animation_frame+1)%this.animations.length
                    this.anim_frame_count=0
                }
                this.hitbox.x=self.x+50*self.direction
                this.hitbox.y=self.y+20
                this.hitbox.w=30
                this.hitbox.h=30
                this.frames-=game.dt
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    opponent.hit(5,self,game)
                }
                if(this.frames<=0){
                    this.frames=0
                    self.vx=0
                    self.state="idle"
                }
            }
        },
        "special 3":{
            frames:0,
            hitbox:{x:0,y:0,w:0,h:0},
            update:function(self,game){
                if(this.frames==0){
                    this.frames=1
                    self.image="special3.png"
                    self.vy=-600
                    self.is_grounded=false
                }
                this.hitbox.x=self.x+20*self.direction
                this.hitbox.y=self.y-20
                this.hitbox.w=50
                this.hitbox.h=50
                this.frames-=game.dt
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(this.hitbox,opponent,game)){
                    opponent.hit(15,self,game)
                }
                if(this.frames<=0){
                    this.frames=0
                    self.state="idle"
                }
            }
        },
         "ultimate":{
            frames:0,
            update:function(self,game){
                if(this.frames==0){
                    self.image="special.png"
                    this.frames=1//1 second
                    let fire_ball = {
                        x:self.x+50*self.direction,
                        y:self.y,
                        w:70,
                        h:70,
                        direction:self.direction,
                        frames:3,
                        target:game.match.get_opponent(self,game),
                        update:function(self,game){
                            this.x+=this.direction*200*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                opponent.hit(50,self,game)
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
                            ctx.strokeStyle="orange"
                            ctx.strokeRect(this.x,this.y,this.w,this.h)
                        }
                    }
                    self.objects.push(fire_ball)
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