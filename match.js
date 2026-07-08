let match = {
    actors:[],
    state:"standby",
    ai_enabled:false,
    ai_routine:0,
    update:function(game){
        if(this.state=="pause") return
        for(let i=0;i<this.actors.length;i++){
            let actor = this.actors[i]
            actor.update(game)
        }
        if(this.actors[1].x<this.actors[2].x){
            this.actors[1].direction=1
            this.actors[2].direction=-1
        }else{
            this.actors[1].direction=-1
            this.actors[2].direction=1
        }
        this.handle_player_collision(game)
        this.handle_push_boundary_and_stage_scrolling(game)
        if(this.ai_enabled){
            this.opponent_ai(game)
        }
        
    },

    create_match:function(chars){
        let p1 = {...player}
        p1.x=0;
        p1.y=0;
        p1.w=chars[0].width;
        p1.h=chars[0].height
        p1.color="blue"
        p1.path = `chars/${chars[0].name}/sprites/`
        p1.direction=1
        p1.states=chars[0].states
        p1.id=1

        let p2 = {...player}
        p2.x=game.canvas.width-chars[1].width;
        p2.y=0;
        p2.w=chars[1].width;
        p2.h=chars[1].height
        p2.color="red"
        p2.path = `chars/${chars[1].name}/sprites/`
        p2.direction=-1
        p2.states=chars[1].states
        p2.id=2

        let stage = {
            x:-384,y:0,w:384*3,h:224,img:"stage.png",
            render:function(game){
                let ctx = game.ctx
                let canvas = game.canvas
                let actor = this
                let img = new Image()
                img.src=this.img
                ctx.drawImage(img, this.x, this.y, this.w, this.h);
            },
            update:function(){}
        }
        this.actors = [stage,p1,p2]
        this.state="running"
    },

    handle_input:function(inp,game){
        this.actors[1].handle_input(inp,game)
    },

    handle_push_boundary_and_stage_scrolling:function(game){
        let p1 = this.actors[1]
        let p2 = this.actors[2]
        let stage = this.actors[0]

        let is_on_left_boundary=(actor)=>{
            // Left boundary
            if (actor.x < 0) {
                actor.vx += Math.abs(actor.vx); // eject back inside
                if(actor.vx>=500){
                    actor.vx=500
                }
                if(actor.vx==0){
                    actor.x+=500*game.dt
                }
                // optional: bounce effect
                // actor.vx = Math.abs(actor.vx);
                return true
            }
        }
        let is_on_right_boundary=(actor)=>{
            // Right boundary
            if (actor.x + actor.w > game.canvas.width) {
                actor.vx -= Math.abs(actor.vx); // eject back inside
                if(actor.vx<=-500){
                    actor.vx=-500
                }
                if(actor.vx==0){
                    actor.x-=500*game.dt
                }
                // optional: bounce effect
                // actor.vx = -Math.abs(actor.vx);
                return true
            }
        }

        let stage_scroll = (actor1,actor2) => {
           
            let left = actor1.x < 0
            let right = actor1.x + actor1.w > game.canvas.width
            if (!left && !right) return // no need to scroll if actor is within boundaries

            actor1.vx += left ? Math.abs(actor1.vx) : -Math.abs(actor1.vx)
            let shift = actor1.vx * game.dt
            if (actor1.vx === 0) {
                shift = (left ? 1 : -1) * 500 * game.dt
            }

            if (left && stage.x < 0) {
                stage.x += shift
                actor2.x += shift
            } else if (right && stage.x + stage.w > game.canvas.width) {
                stage.x += shift
                actor2.x += shift
            }

            actor1.x += shift
           
        }
        stage_scroll(p1, p2)
        stage_scroll(p2, p1)
    },

    handle_player_collision:function(game){
        game.physics.collide_and_eject(this.actors[1],this.actors[2],game)
        game.physics.collide_and_eject(this.actors[2],this.actors[1],game)
    },

    opponent_ai:function(game){
        let p2 = this.actors[2]
        let p1 = this.actors[1]
        let states = ["jump","dash","back dash","attack","block","idle","special 1","special 2"]
        this.ai_routine += game.dt

        if(this.ai_routine>=1){
            p2.set_state(states[Math.floor(Math.random()*states.length)])
            if(p2.meter>=60){
                p2.handle_input("ultimate", game)
            }
            this.ai_routine=0
        }
        
    },

    get_opponent:function(actor,game){
        for(let i=0;i<game.match.actors.length;i++){
            //console.log("actor id:", game.match.actors[i].id, "self id:", actor.id);
            if(game.match.actors[i].id!==actor.id && game.match.actors[i].id!==undefined){
                return game.match.actors[i]
            }
        }
    },
}