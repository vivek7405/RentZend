import React from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { Card } from "@material-ui/core";

export const GET_CUSTOMERS = gql`
  {
    Customers {
      ID
      Name
      Email
      Phone
      Address
      ZipCode
    }
  }
`;

export function Customers() {
    const { loading, error, data } = useQuery(GET_CUSTOMERS, {
        pollInterval: 5000,
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}> Error! ${error.message}`</p>;

    return (
        <div id="viewCustomers">
            <h5>LIST OF AJENTS</h5>
            {data.Customers.map((p, i) => (
                <Card key={i} style={{ padding: "10px", margin: "5px" }}>{`${p.Name}`}</Card>
            ))}
        </div>
    );
}
