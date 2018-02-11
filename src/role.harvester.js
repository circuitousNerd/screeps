let roleHarvester = {
    BODY_TYPE: {
        'small': {
            'components': [WORK, CARRY, MOVE, MOVE],
            'price': 250
        },
        'medium': {
            'components': [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            'price': 450
        },
        'large': {
            'components': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            'price': 900
        }
    },

    MIN_CREEPS: 5,

    create: function (body, spawn, role) {
        if(!(spawn.spawning)) {
            let creep_name = `${role}${Game.time}`;
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

        if(_.sum(creep.carry) <= 0) {
            creep.memory.filling = true;
            delete creep.memory.target
        }
        else {
            creep.memory.filling = false;
            delete creep.memory.source
        }

        if(creep.memory.filling) {
            let resource = _.sample(creep.room.find(FIND_DROPPED_RESOURCES));
            creep.memory.resource = resource.id

            if(creep.pos.isNearTo(resource)) {
                creep.pickup(resource)
            }
            else {
                creep.moveTo(resource)
            }
        }
        else {
            let target;
            if(creep.memory.target) {
                target = Game.getObjectById(creep.memory.target)
            }
            else {
                target = _.sample(creep.room.find(FIND_STRUCTURES, { filter: function(structure) {
                    return structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_CONTROLLER
                    }}));
                creep.memory.target = target.id
            }
            let isClose;
            if(target.structureType === STRUCTURE_CONTROLLER) {
                isClose = 3
            }
            else {
                isClose = 0
            }

            if(creep.pos.inRangeTo(target, isClose) && target.structureType === STRUCTURE_CONTROLLER) {
                creep.upgradeController(target)
            }
            if (creep.pos.isNearTo(target) && target.structureType === STRUCTURE_SPAWN ||
                target.structureType === STRUCTURE_EXTENSION){
                let transfer_result = creep.transfer(target, RESOURCE_ENERGY)
                if (transfer_result != OK) {
                    console.log(`${creep.name} had trouble transferring to ${target}: ${transfer_result}`)
                }
            }
            else {
                creep.moveTo(target)
            }
        }



    }

};

module.exports = roleHarvester;