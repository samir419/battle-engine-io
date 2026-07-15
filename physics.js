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
        /*if(this.aabb(a1,a2,game)){
            a1.x+=(a1.vx-100)*game.dt*-a1.direction
            a2.x+=a1.vx*game.dt*-a2.direction
            if(a1.vx==0){
                a1.x-=200*game.dt*-a1.direction
                a2.x+=500*game.dt*-a2.direction
            }
        }*/
       if(a1.x+a1.w>a2.x&&a1.x+a1.w<a2.x+a2.w&&a1.y+a1.h>a2.y){
            a1.x-=500*game.dt
            a2.x+=a1.vx*game.dt
       }
       if(a1.x>a2.x&&a1.x<a2.x+a2.w&&a1.y+a1.h>a2.y){
            a1.x+=500*game.dt
            a2.x+=a1.vx*game.dt
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

        let dx = cx1 - cx2
        let dy = cy1 - cy2

        let overlapX = (aw1 + aw2)/2 - Math.abs(dx)
        let overlapY = (ah1 + ah2)/2 - Math.abs(dy)

        if (overlapX > 0 && overlapY > 0) {
            // collision — resolve along smallest penetration
            if (overlapX < overlapY) {
                // push on X axis
                if (dx > 0) {
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