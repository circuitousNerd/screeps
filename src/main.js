let roleMiner = require('role.miner');
let roleHarvester = require('role.harvester')

module.exports.loop = function () {

    // delete creep from memory if it no longer lives.
    for(const name in Memory.creeps) {
        if(!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    for(const spawn_name in Game.spawns) {
        let spawn = Game.spawns[spawn_name];
        let my_creeps = FIND_MY_CREEPS;
        let miners = spawn.room.find(my_creeps, { filter: function(creep) {
            return creep.memory.role === 'miner'
            }});
        let harvesters = spawn.room.find(my_creeps, { filter: function(creep) {
                return creep.memory.role === 'harvesters'
            }});
        if(miners.length < (spawn.room.find(FIND_SOURCES).length && spawn.room.energyCapacityAvailable <= 300
                && spawn.room.energyAvailable >= 250 && spawn.memory.last_spawn != 'miner')) {
            roleMiner.create('small', spawn, 'miner');
        }
        if(harvesters.length < roleHarvester.MIN_CREEPS && spawn.room.energyCapacityAvailable <= 300
            && spawn.room.energyAvailable >= 250 && spawn.memory.last_spawn != 'harvester') {
            roleHarvester.create('small', spawn, 'harvester')
        }
    }

    for(const name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
    }
};