let roleMiner = {
    BODY_TYPE: {
        'small': {
            'components': [WORK, WORK, MOVE],
            'price': 250
        },
        'medium': {
            'components': [WORK, WORK, WORK, WORK, MOVE],
            'price': 450
        },
        'large': {
            'components': [WORK, WORK, WORK, WORK, WORK, MOVE],
            'price': 550
        }
    },

    create: function (body, spawn, role) {
        if(!(spawn.spawning)) {
            let creep_name = `miner${Game.time}`;
            if(body in this.BODY_TYPE) {
                var _body = this.BODY_TYPE[body]['components']
            }
            let spawn_result = spawn.spawnCreep(_body, creep_name, {
                memory: {
                    role: role
                }
            });
            if(spawn_result != OK) {
                console.log(`Was unable to spawn ${creep_name}: ${spawn_result}`)
            }
            else {
                spawn.memory.last_spawn = role
            }
        }
    },

    run: function (creep) {


        let target;
        if(creep.memory.target) {
            target = Game.getObjectById(creep.memory.target)
        }
        else {
            target = _.sample(creep.room.find(FIND_SOURCES));
            creep.memory.target = target.id
        }

        if(creep.pos.isNearTo(target)) {
            creep.harvest(target)
        }
        else {
            creep.moveTo(target)
        }
    }

};

module.exports = roleMiner;