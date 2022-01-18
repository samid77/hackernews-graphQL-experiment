import React from 'react'
import {Button, Form} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'

import {useForm} from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql.js'

function PostForm(){

  const {values, onChange, onSubmit} = useForm(createPostCallback, {
    body: ''
  })
  const [createPost, {error}] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      console.log(`Post result: ${JSON.stringify(result, undefined, 2)}`);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })
      data.getPosts = [result.data.createPost, ...data.getPosts]
      proxy.writeQuery({query: FETCH_POSTS_QUERY, data})
      values.body = ''
    }
  })

 function createPostCallback() {
    createPost()
  }


  return (
    <Form onSubmit={onSubmit}>
      <h2>Create Post</h2>
      <Form.Field>
        <Form.Input 
          placeholder="Post body"
          name="body"
          onChange={onChange}
          value={values.body}
        />

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form.Field>
    </Form>
  )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!){
    createPost(body: $body){
      id body createdAt username 
      likes{
        id username createdAt
      }
      likeCount
      comments{
        id body username createdAt
      }
      commentCount
    }
  }
`

export default PostForm
