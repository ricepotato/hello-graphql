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
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
