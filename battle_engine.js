let battle_engine={
    attack:function(game,obj,self,data){
        let opponent=game.match.get_opponent(self,game)
        if(game.physics.aabb(obj.hitbox,opponent,game)){
            opponent.damage({
                damage:data.damage,
                knockback:data.knockback?data.knockback:0,
                knockdown:data.knockdown?data.knockdown:false,
            },game)
            return true
        }
        return false
    },
    update_animation:function(game,obj,self){
        if(obj.frames==0){
            obj.frames=obj.total_frames
            obj.init(game,obj,self)
        }
        obj.hitbox.w = obj.hitbox_data.w;
        obj.hitbox.h = obj.hitbox_data.h;
        obj.hitbox.x = self.x+obj.hitbox_data.x*self.direction;
        obj.hitbox.y = self.y+obj.hitbox_data.y;
        self.image=obj.animations[obj.animation_frame].image
        obj.anim_frame_count+=game.dt
        if(obj.anim_frame_count>=obj.animations[obj.animation_frame].duration){
            obj.animation_frame=(obj.animation_frame+1)%obj.animations.length
            let current = obj.animations[obj.animation_frame]
            if(current.custom){
                current.custom(game,obj,self)
            }
            if(obj.animations[obj.animation_frame].damage){
                let opponent=game.match.get_opponent(self,game)
                if(game.physics.aabb(obj.hitbox,opponent,game)){
                    opponent.damage({
                        damage:current.damage,
                        knockback:current.knockback,
                        knockdown:current.knockdown?current.knockdown:false,
                    },game)
                }
            }
            if(obj.animations[obj.animation_frame].offset){
                obj.offsetx=obj.animations[obj.animation_frame].offset.x
                obj.offsety=obj.animations[obj.animation_frame].offset.y
            }else{obj.offsetx=0;obj.offsety=0}
            obj.anim_frame_count=0
        }
        obj.frames-=game.dt
        if(obj.frames<=0){
            obj.frames=0
            obj.anim_frame_count=0
            obj.animation_frame=0
            self.state="idle"
            obj.end(game,obj,self)
        }
    }
    ,event:function(data){}
}