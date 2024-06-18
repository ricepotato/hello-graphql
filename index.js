const database = require("./database");

const { ApolloServer, gql } = require("apollo-server");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    teams: [Team]
    team(id: Int): Team
    equipments: [Equipment]
    Supplies: [Supply]
  }
  type Mutation {
    insertEquipment(
      id: String
      user_by: String
      count: Int
      new_or_used: String
    ): Equipment
    updateEquipment(
      id: String
      count: Int
      user_by: String
      new_or_used: String
    ): Equipment
    deleteEquipment(id: String): Equipment
  }
  type Team {
    id: Int
    manager: String
    office: String
    extension_number: String
    mascot: String
    cleaning_duty: String
    project: String
    supplies: [Supply]
  }
  type Equipment {
    id: String
    used_by: String
    count: Int
    new_or_used: String
  }
  type Supply {
    id: String
    team: Int
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    teams: () =>
      database.teams.map((team) => {
        team.supplies = database.supplies.filter(
          (supply) => supply.team === team.id
        );
        return team;
      }),
    team: (parent, args, context, info) => {
      return database.teams.find((team) => team.id === args.id);
    },
    equipments: () => database.equipments,
    Supplies: () => database.supplies,
  },
  Mutation: {
    insertEquipment: (parent, args, context, info) => {
      const newEquipment = {
        id: args.id,
        used_by: args.user_by,
        count: args.count,
        new_or_used: args.new_or_used,
      };
      database.equipments.push(newEquipment);
      return newEquipment;
    },
    updateEquipment: (parent, args, context, info) => {
      const updated = database.equipments.find(
        (equipment) => equipment.id === args.id
      );
      updated.count = args.count;
      updated.used_by = args.user_by;
      updated.new_or_used = args.new_or_used;
      return updated;
    },
    deleteEquipment: (parent, args, context, info) => {
      const deleted = database.equipments.find(
        (equipment) => equipment.id === args.id
      );
      database.equipments = database.equipments.filter(
        (equipment) => equipment.id !== args.id
      );
      return deleted;
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
