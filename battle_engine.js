let battle_engine={
    get_opponent:function(actor,game){
        for(let i=0;i<game.match.actors.length;i++){
            if(game.match.actors[i].id!==actor.id && game.match.actors[i].id!==undefined){
                return game.match.actors[i]
            }
        }
    },
}