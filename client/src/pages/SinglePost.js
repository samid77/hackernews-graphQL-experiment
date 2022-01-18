import React, { Fragment, useContext, useState, useRef} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks'
import { Grid, Button, Card, Icon, Label, Image, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import moment from "moment";

import {AuthContext} from '../context/auth'
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props) {

  const postId = props.match.params.postId;
  console.log(props.match.params.postId)
  const { user } = useContext(AuthContext)
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null)

  const {
    data: {getPost}
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update(){
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  })

  function deletePostCallback(){
    props.history.push('/')
  }


  let postMarkup;
  if(!getPost) {
    postMarkup = <p>Loading post...</p>
  } else {
    const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image 
              src={
                username === 'lionel.messi' ? "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR_BSXPlBjoBeJruSaCamv7kQuMNjoIIWX0CITXUVoapFCbRM9g"
                : username === 'mesut.ozil' ? "https://upload.wikimedia.org/wikipedia/commons/1/12/Mesut_%C3%96zil_at_Baku_before_2019_UEFA_Europe_League_Final.jpg"
                : username === 'samid' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/1200px-Brad_Pitt_2019_by_Glenn_Francis.jpg"
                : "https://www.w3schools.com/w3images/avatar2.png" }
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{id, likeCount, likes}}/>
                <Button 
                  as="div" 
                  labelPosition="right"
                  onClick={() => console.log("Comment on post")}>
                    <Button basic color="blue">
                      <Icon name="comments"/>
                    </Button>
                    <Label basic color="blue" pointing="left">{commentCount}</Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback}/>
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
               <Card.Content>
                 <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input 
                        type="text" 
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button 
                        type="submit" 
                        className="ui button teal" 
                        disabled={comment.trim() === ''}
                        onClick={submitComment}>
                        Submit
                      </button>
                    </div>
                  </Form>
               </Card.Content>
              </Card>
            )}
            {comments.map(c => (
              <Card fluid key={c.id}>
                <Card.Content>
                  {user && user.username === c.username && (
                    <DeleteButton postId={id} commentId={c.id}/>
                  )}
                  <Card.Header>{c.username}</Card.Header>
                  <Card.Meta>{moment(c.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{c.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body){
      id
      comments{
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }

`

const FETCH_POST_QUERY = gql`
  query($postId: ID!){
    getPost(postId: $postId){
      id body createdAt username likeCount
      likes{
        username
      }
      commentCount
      comments{
        id username createdAt body
      }
    }
  }
`

export default SinglePost;