let physics = {
    apply_physics:function(actor,game){
        // Gravity
        if (actor.y + actor.h < game.canvas.height) {
            actor.is_grounded=false
            actor.vy += 2000*game.dt;
            if(actor.vy>=600){
                actor.vy=600
            }
        }

        if(actor.y+actor.h>game.canvas.height){
            actor.y=game.canvas.height-actor.h
            actor.vy=0
            actor.is_grounded=true
            game.playsound("assets/land.wav")
        }

        //update position
        actor.x+=actor.vx*game.dt
        actor.y+=actor.vy*game.dt
    },

    collide_and_eject:function(actor1,actor2,game){
        let a1 = actor1
        let a2 = actor2
        if(!a1.enable_physics||!a2.enable_physics){
            return
        }
        /*if(this.aabb(a1,a2,game)){
            a1.x+=(a1.vx-100)*game.dt*-a1.direction
            a2.x+=a1.vx*game.dt*-a2.direction
            if(a1.vx==0){
                a1.x-=200*game.dt*-a1.direction
                a2.x+=500*game.dt*-a2.direction
            }
        }*/
        const overlapY = Math.min(a1.y + a1.h, a2.y + a2.h) -
                 Math.max(a1.y, a2.y);

        if (overlapY > 10) {
            if(a1.x+a1.w>a2.x&&a1.x+a1.w<a2.x+a2.w){
                    a1.x-=500*game.dt
                    a2.x+=a1.vx*game.dt
            }
            if(a1.x>a2.x&&a1.x<a2.x+a2.w){
                    a1.x+=500*game.dt
                    a2.x+=a1.vx*game.dt
            }
        }
      
        
    },

    aabb:function(actor1,actor2,game){
        // simple AABB overlap test
        if (!actor1 || !actor2) return false
        return !(actor1.x + actor1.w <= actor2.x ||
                 actor1.x >= actor2.x + actor2.w ||
                 actor1.y + actor1.h <= actor2.y ||
                 actor1.y >= actor2.y + actor2.h)
    }
    ,event:function(data){}
}
function barrier_collision(player,player2,object,stage,game){
    if(player.x < 0){
        player.x -= player.vx*game.dt
        if(player.vx ==0){
            player.x += 500*game.dt
        }
        if(stage.x<0&&player2.vx<0){
            stage.x+=300*game.dt
            player2.x-=player2.vx*game.dt
       }

       
    }
    if(player.x+player.w>object.width){
        player.x -= player.vx*game.dt
        if(player.vx ==0){
            player.x -= 500*game.dt
        }
        if(stage.x+stage.w>object.width&&player2.vx>0){
            stage.x-=300*game.dt
            player2.x-=player2.vx*game.dt
        }
    }
}

function player_collision(player,player2,game){
    if(player.x+player.w>player2.x&&player.x<player2.x+player2.w&&player2.x+player2.w<game.canvas.width&&player2.x>0
        &&player.y>=player2.y-5&&player.y<=player2.y+5
    ){
        player2.x+=player.vx*game.dt
        if(player.vx == 0 || player2.vx == 0){
            player2.x+= 500*-player2.direction*game.dt
            player.x+= 500*-player.direction*game.dt
        }
        if(player2.x+player2.w>game.canvas.width-10){
            player.x+= 100*-player.direction*game.dt
        }
        if(player2.x<10){
            player.x+= 100*-player.direction*game.dt
        }
    }
}

/*collide_and_eject:function(actor1,actor2,game){
        // axis-aligned bounding box collision resolution
        // returns true if a collision occurred and was resolved
        // resolve by moving actor1 out along the smallest penetration axis
        let a1 = actor1
        let a2 = actor2

        let ax1 = a1.x
        let ay1 = a1.y
        let aw1 = a1.w
        let ah1 = a1.h

        let ax2 = a2.x
        let ay2 = a2.y
        let aw2 = a2.w
        let ah2 = a2.h

        // centers
        let cx1 = ax1 + aw1/2
        let cy1 = ay1 + ah1/2
        let cx2 = ax2 + aw2/2
        let cy2 = ay2 + ah2/2

        let vx = cx1 - cx2
        let dy = cy1 - cy2

        let overlapX = (aw1 + aw2)/2 - Math.abs(vx)
        let overlapY = (ah1 + ah2)/2 - Math.abs(dy)

        if (overlapX > 0 && overlapY > 0) {
            // collision — resolve along smallest penetration
            if (overlapX < overlapY) {
                // push on X axis
                if (vx > 0) {
                    a1.x += overlapX
                } else {
                    a1.x -= overlapX
                }
                // cancel horizontal velocity to avoid re-penetration
                if (a1.vx) a1.vx = 0
            } else {
                // push on Y axis
                if (dy > 0) {
                    // a1 is below a2 -> push down
                    a1.y += overlapY
                    // if we pushed down, keep vy if moving downward
                    if (a1.vy < 0) a1.vy = 0
                } else {
                    // a1 is above a2 -> landed on top
                    a1.y -= overlapY
                    // zero vertical velocity and mark grounded
                    a1.vy = 0
                    a1.is_grounded = true
                }
            }

            return true
        }

        return false
    }*/