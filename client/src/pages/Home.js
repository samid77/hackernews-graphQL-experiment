import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import gql from 'graphql-tag';

// import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
// import PostForm from '../components/PostForm';
// import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {

  const { loading, data: {getPosts: posts} } = useQuery(FETCH_POST_QUERY)

  if(posts) {
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {
          loading 
          ? (<h1>Loading posts...</h1>)
          : (
            posts && posts.map(p => (
              <Grid.Column key={p.id} style={{marginBottom: 20}}>
                <PostCard post={p}/>
              </Grid.Column>
            ))
          )
        }
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POST_QUERY = gql`
  {
    getPosts{
    id
    body
    createdAt
    likeCount
    likes{
      username
    }
    commentCount
    comments{
      id
      username
      createdAt
      body
    }
  }
  }
`

export default Home;
