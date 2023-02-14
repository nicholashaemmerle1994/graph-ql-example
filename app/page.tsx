import { initializeApollo } from '@/util/client';
import { gql } from '@apollo/client';
import Image from 'next/image';

type GitHubProfileresponse = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          name: string;
          id: string;
        };
      }[];
    };
  };
};

export default async function HomePage() {
  const client = initializeApollo(null);

  const { data } = await client.query<GitHubProfileresponse>({
    query: gql`
      query profileQuery($username: String = "prochaLu") {
        user(login: $username) {
          name
          avatarUrl
          repositories(last: 10) {
            edges {
              node {
                name
                defaultBranchRef {
                  name
                  id
                }
              }
            }
          }
        }
      }
    `,
  });
  console.log(data);
  return (
    <div>
      <h1>{data.user.name} Portfolio</h1>
      <Image
        src={data.user.avatarUrl}
        alt={`${data.user.name}´s Avatar`}
        width={400}
        height={400}
      />
      <h2>Repos</h2>
      {data.user.repositories.edges.map((repos) => (
        <li key={repos.node.id}> {repos.node.name}</li>
      ))}
    </div>
  );
}
