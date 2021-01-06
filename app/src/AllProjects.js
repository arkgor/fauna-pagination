import { Link } from "react-router-dom";
import Table from "./Table";
import { gql } from "graphql-request";
import Loading from "./Loading";
import useData from "./useData";

export default function AllProjects() {
  const { data, isLoading, size, pageCount, updateData } = useProjects();

  if (isLoading) return <Loading />;

  return (
    <>
      <h2>All Projects:</h2>
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

const fetchProjects = (client) => (size, cursor) => async () => {
  const { projects } = await client.request(
    gql`
      query($size: Int, $cursor: String) {
        projects(_size: $size, _cursor: $cursor) {
          data {
            _id
            name
          }
          after
          before
        }
      }
    `,
    {
      cursor,
      size,
    }
  );
  return projects;
};

function useProjects() {
  const data = useData("projects", fetchProjects);
  return data;
}

const columns = [
  {
    Header: "ID",
    accessor: ({ _id }) => <Link to={`/projects/${_id}`}>{_id}</Link>,
  },
  {
    Header: "Name",
    accessor: "name",
  },
];
