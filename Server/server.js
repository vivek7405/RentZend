const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const uuidv1 = require('uuid');

const typeDefs = gql`
  type Customer {
    ID: String
    Name: String
    Email: String
    Phone: String
    Address: String
    ZipCode: String
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  type Query {
    Customers: [Customer]
    Customer(ID: String!): Customer
  }
  
  type Mutation {
    CreateCustomer(
      Name: String
      Email: String
      Phone: String
      Address: String
      ZipCode: String
    ): Boolean,
    singleUpload(file: Upload!): File!    
  }
`;

class Customer {
  constructor(ID, Name, Email, Phone, Address, ZipCode) {
    this.ID = ID,
      this.Name = Name,
      this.Email = Email,
      this.Phone = Phone,
      this.Address = Address,
      this.ZipCode = ZipCode
  }
}
var customers = new Array();

const resolvers = {
  Query: {
    Customers: () => {
      return customers;
    }
  },
  Mutation: {
    CreateCustomer: (_, data) => {
      customers.push(new Customer(uuidv1(), data.Name, data.Email, data.Phone, data.Address, data.ZipCode));
      return true;
    },
    singleUpload: (parent, args) => {
      return args.file.then(file => {
        const { createReadStream, filename, mimetype } = file

        const fileStream = createReadStream()

        fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))

        return file;
      });
    }
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`\`🚀  Server ready at ${url}`);
});