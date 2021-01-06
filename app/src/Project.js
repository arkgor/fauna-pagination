import React from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import Table from "./Table";
import Loading from "./Loading";
import useData from "./useData";

export default function Project() {
  let { id } = useParams();

  const { data, isLoading, size, pageCount, updateData } = useProjectTests({
    id,
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <h2>Project {id}:</h2>
      <Table
        columns={columns}
        data={data}
        fetchData={updateData}
        pageCount={pageCount}
        initialPageSize={size}
      />
    </>
  );
}

const fetchTests = (client) => (size, cursor, variables) => async () => {
  const { tests } = await client.request(
    gql`
      query($size: Int, $cursor: String, $id: ID) {
        tests: getTestsByProject(id: $id, _size: $size, _cursor: $cursor) {
          data {
            _id
            name
            student {
              _id
              name
            }
          }
          after
          before
        }
      }
    `,
    {
      size,
      cursor,
      ...variables,
    }
  );
  return tests;
};

function useProjectTests(vars) {
  const data = useData("projecTests", fetchTests, vars);
  return data;
}

const columns = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Student",
    accessor: "student.name",
  },
];
