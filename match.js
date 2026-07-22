let match = {
    actors:[],
    state:"standby",
    ai_enabled:false,
    ai_routine:0,
    temps:{},
    difficulty:1,
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
        this.handle_push_boundary_and_stage_scrolling(this.actors[0],this.actors[1],this.actors[2],game)
        this.handle_push_boundary_and_stage_scrolling(this.actors[0],this.actors[2],this.actors[1],game)
        //barrier_collision(this.actors[1],this.actors[2],game.canvas,this.actors[0],game)
        //barrier_collision(this.actors[2],this.actors[1],game.canvas,this.actors[0],game)
        //player_collision(this.actors[1],this.actors[2],game)
        //player_collision(this.actors[2],this.actors[1],game)
        if(this.ai_enabled){
            this.opponent_ai(game)
        }
        if((this.actors[1].health<=0||this.actors[2].health<=0)&&this.format!="practice"){
            if(!this.temps.endtimer){
                this.temps.endtimer=2
            }
            this.temps.endtimer-=game.dt
            if(this.temps.endtimer<=0){
                game.event({name:"end match"})
                this.temps={}
            }
           
        }
        
    },

    create_match:function(chars){
        let p1 = {...player}
        p1.x=((0+game.canvas.width/2)/2)-chars[0].width/2;
        p1.y=0;
        p1.w=chars[0].width;
        p1.h=chars[0].height
        p1.color="blue"
        p1.path = `chars/${chars[0].name}/sprites/`
        p1.direction=1
        p1.states={...p1.default_states,...chars[0].states}
        p1.id=1

        let p2 = {...player}
        p2.x=(game.canvas.width/2+game.canvas.width)/2-chars[1].width/2;
        p2.y=0;
        p2.w=chars[1].width;
        p2.h=chars[1].height
        p2.color="red"
        p2.path = `chars/${chars[1].name}/sprites/`
        p2.direction=-1
        p2.states={...p2.default_states,...chars[1].states}
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
            update:function(){},
            event:function(data){},
        }
        this.actors = [stage,p1,p2]
        this.state="running"
    },

    handle_input:function(inp,game){
        this.actors[1].handle_input(inp,game)
    },

    handle_push_boundary_and_stage_scrolling:function(stage,p1,p2,game){
        let actor = p1
        //stay within boundaries
        if(actor.x<0){
            actor.x=0
            if(stage.x<0&&p2.x+p2.w<game.canvas.width){
                stage.x+=100*game.dt
                p2.x+=100*game.dt
            }
        }
        if(actor.x+actor.w>game.canvas.width){
            actor.x=game.canvas.width-actor.w
            if(stage.x+stage.width>game.canvas.width&&p2.x>0){
                stage.x-=100*game.dt
                p2.x-=100*game.dt
            }
        }
    },

    handle_player_collision:function(game){
        game.physics.collide_and_eject(this.actors[1],this.actors[2],game)
        game.physics.collide_and_eject(this.actors[2],this.actors[1],game)
    },

    opponent_ai:function(game){
        let p2 = this.actors[2]
        let p1 = this.actors[1]
        let states = ["jump","dash","back dash","attack","block","idle","special 1","special 2","special 3","throw"]
        this.ai_routine += game.dt

        if(this.ai_routine>=1/this.difficulty){
            p2.set_state(states[Math.floor(Math.random()*states.length)])
            if(p2.meter>=60){
                p2.handle_input("ultimate", game)
            }
            /*p1.set_state(states[Math.floor(Math.random()*states.length)])
            if(p1.meter>=60){
                p1.handle_input("ultimate", game)
            }*/
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

    check_boundary:function(actor,game){
        if(actor.x<=0){
            return true
        }
        if(actor.x+actor.w>=game.canvas.width){
            return true
        }
       return false
    }

    ,event:function(data){
        for(let i=0;i<this.actors.length;i++){
            if(this.actors[i].event){this.actors[i].event(data)}
        }
    }
}