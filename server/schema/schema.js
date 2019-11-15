const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList, 
} = graphql;

//dummy data
const machines = [
    { name: 'MVV', machineTypeId: '1', stationId: '1', id: '1' },
    { name: 'BMW', machineTypeId: '2', stationId: '1', id: '2' },
    { name: 'KGH', machineTypeId: '3', stationId: '2', id: '3' },
    { name: 'TEST MACHINE', machineTypeId: '4', stationId: '3', id: '4' },
];
const locations = [
    { name: 'Zlicin', id: '1'},
    { name: 'Brno', id: '2'},
]
const stations = [
    { name: 'Zlicin station 1', locationId: '1', id: '1' },
    { name: 'Zlicin station 2', locationId: '1', id: '2' },
    { name: 'Brno station 1', locationId: '2', id: '3' },
]
const machineTypes = [
    { name: 'Escalator', id: '1', machineCategoryId: '1' },
    { name: 'Cogeneration Unit', id: '2', machineCategoryId: '2' },
    { name: 'Intenzifier', id: '3', machineCategoryId: '3' },
    { name: 'Test Engine', id: '4', machineCategoryId: '4' },
]
const machineCategories = [
    { name: 'Escalator category', id: '1' },
    { name: 'Cogeneration Unit category', id: '2' },
    { name: 'Intenzifier category', id: '3' },
    { name: 'Test Engine category', id: '4' },
]

const MachineType = new GraphQLObjectType({
    name: 'Machine',
    fields: () => ({
        id: { type: GraphQLID },
        name: {type: GraphQLString },
        machine_type: {type: GraphQLID},
        station: {
            type: StationType,
            resolve(parent, args){
                return _.find(stations, { id: parent.stationId })
            }
        },
        location: {
            type: LocationType,
            resolve(parent, args){
                const station = _.find(stations, { id: parent.stationId });
                return _.find(locations, {id: station.locationId });
            }
        },
        machine_type: {
            type: MachineTypeType,
            resolve(parent, args) {
                return _.find(machineTypes, { id: parent.machineTypeId });
            }
        },
        machine_category: {
            type: MachineCategoryType,
            resolve(parent, args) {
                const machine_type = _.find(machineTypes, { id: parent.machineTypeId });
                return _.find(machineCategories, { id: machine_type.machineCategoryId });
            }
        }
    })
});
const StationType = new GraphQLObjectType({
    name: 'Station',
    fields: () => ({
        id: { type: GraphQLID },
        name: {type: GraphQLString },
    })
});
const LocationType = new GraphQLObjectType({
    name: 'Location',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        stations: {
            type: new GraphQLList(StationType),
            resolve(parent, args){
                return _.filter(stations, { locationId: parent.id });
            }
        }
    })
});
const MachineTypeType = new GraphQLObjectType({
    name: 'MachineType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        category: {
            type: MachineCategoryType,
            resolve(parent, args){
                return _.find(machineCategories, {id: parent.machineCategoryId});
            }
        }
    })
});
const MachineCategoryType = new GraphQLObjectType({
    name: 'CategoryType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        machine: {
            type: MachineType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                return _.find(machines, { id: args.id });
            }
        },
        station: {
            type: StationType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                return _.find(stations, { id: args.id });
            }
        },
        location: {
            type: LocationType,
            args: { id: {type: GraphQLID} },
            resolve(parent, args) {
                return _.find(locations, { id: args.id });
            }
        },
        machine_type: {
            type: MachineTypeType,
            args: {id: {type: GraphQLID} },
            resolve(parent, args) {
                return _.find(machineTypes, { id: args.id });
            }
        },
        machine_category: {
            type: MachineCategoryType,
            args: {id: {type: GraphQLID} },
            resolve(parent, args) {
                return _.find(machineCategories, {id: args.id });
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});