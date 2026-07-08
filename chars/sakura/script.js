let sakura = {
    name: "sakura",
    width: 76,
    height: 87,
    states:{
        "idle":{
            init:function(self,game){},
            update:function(self,game){
                if(self.state_buffer!="none"){
                    let x = self.state_buffer
                    self.state=x
                    self.state_buffer="none"
                }
                self.image="idle.png"
            }
        },
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
                    if (!["block","block stun","knockdown","hit","ko"].includes(opponent.state)){
                        self.meter+=10
                        opponent.hit(5)
                    }
                    if(opponent.state=="block"){
                        self.meter+=4
                        opponent.block_stun(0.5)
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
        "hit":{
            frames:0,
            update:function(self,game){
                if(this.frames==0){
                    self.image="hit.png"
                    this.frames=0.5//0.5 seconds
                    self.vx=100*-self.direction
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
                self.image="block.png"
            }
        },
        "block stun":{
            update:function(self,game){
                self.temp.block_stun_time-=game.dt
                self.image="block.png"
                self.x+=-100*self.direction*game.dt
                if(self.temp.block_stun_time<=0){
                    self.temp.block_stun_time=0
                    self.state="block"
                }
            }
        },
        "knockdown":{
            frames:0,
            update:function(self,game){
                if(this.frames==0){
                    self.image="knock down.png"
                    this.frames=1
                    self.vx=100*-self.direction
                    self.vy=300*-self.direction
                    self.is_grounded=false
                }
                this.frames-=game.dt
                if(this.frames<=0.5){
                    self.vx=0
                    self.vy=0
                }
                if(this.frames<=0){
                    this.frames=0
                    self.state="idle"
                }
            }
        },
        "ko":{
            update:function(self,game){
                self.image="ko.png"
            }
        },
        "special 1":{
            frames:0,
            update:function(self,game){
                if(this.frames==0){
                    self.image="special.png"
                    this.frames=1//1 second
                    let fire_ball = {
                        x:self.x+50*self.direction,
                        y:self.y+20,
                        w:30,
                        h:30,
                        direction:self.direction,
                        frames:2,
                        target:game.match.get_opponent(self,game),
                        update:function(self,game){
                            this.x+=this.direction*200*game.dt
                            let opponent=this.target
                            if(game.physics.aabb(this,opponent,game)){
                                if (!["block","block stun","knockdown","hit","ko"].includes(opponent.state)){
                                    self.meter+=10
                                    opponent.hit(10)
                                }
                                if(opponent.state=="block"){
                                    self.meter+=4
                                    opponent.block_stun(0.5)
                                }
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
                    if (!["block","block stun","knockdown","hit","ko"].includes(opponent.state)){
                        self.meter+=10
                        opponent.hit(5)
                    }
                    if(opponent.state=="block"){
                        self.meter+=4
                        opponent.block_stun(0.5)
                    }
                    
                }
                if(this.frames<=0){
                    this.frames=0
                    self.vx=0
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
                                if (!["block","block stun","knockdown","hit","ko"].includes(opponent.state)){
                                    opponent.hit(50)
                                }
                                if(opponent.state=="block"){
                                    self.meter+=10
                                    opponent.block_stun(1)
                                }
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
        },
    }
}

game.chars.push(sakura)