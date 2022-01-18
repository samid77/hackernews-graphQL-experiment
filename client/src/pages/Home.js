import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const {user} = useContext(AuthContext);

  const { loading, data: {getPosts: posts} } = useQuery(FETCH_POSTS_QUERY)

  if(posts) {
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm></PostForm>
          </Grid.Column>
        )}
        {
          loading 
          ? (<h1>Loading posts...</h1>)
          : (
            <Transition.Group>
              {
                posts && posts.map(p => (
                  <Grid.Column key={p.id} style={{marginBottom: 20}}>
                    <PostCard post={p}/>
                  </Grid.Column>
                ))
              }
            </Transition.Group>
          )
        }
      </Grid.Row>
    </Grid>
  );
}

export default Home;
