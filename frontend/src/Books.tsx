import React from 'react';
import { useEffect, Profiler } from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';

import { applyPatch } from 'fast-json-patch';

// import { gql } from '@apollo/client';
const BOOKS_QUERY = gql`
      query GetBooks {
        books {
          id
          title
          author
        }
      }
    `;

const MY_DATA_PATCHED = gql`
    subscription onDataPatched {
      myDataPatched
    }
  `;

export function Books() {
    console.log("Redraw books");
    const { subscribeToMore, loading, error, data } = useQuery(BOOKS_QUERY);

    const { data: patch, loading: subLoading } = useSubscription(
        MY_DATA_PATCHED,
        { }
      );
    useEffect(() => {
        const unsubscribe = subscribeToMore({
            document: MY_DATA_PATCHED,
            // variables: { postID: params.postID },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const patch = subscriptionData.data.myDataPatched;
                // console.log(patch);
                // return prev;
                // console.log(prev);
                const newDoc = applyPatch(prev, patch, false, false);
                // console.log(newDoc);
                return newDoc.newDocument;
            //   return Object.assign({}, prev, {
            //     post: {
            //       comments: [newFeedItem, ...prev.post.comments]
            //     }
            //   });
            }
        })
        return () => unsubscribe();
    }, [])
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.log("Loaded")
        // subscribeToMore({
        //     document: MY_DATA_PATCHED,
        //     // variables: { postID: params.postID },
        //     updateQuery: (prev, { subscriptionData }) => {
        //       if (!subscriptionData.data) return prev;
        //       const patch = subscriptionData.data.myDataPatched;
        //       console.log(patch);
        //       return prev;
        //     //   return Object.assign({}, prev, {
        //     //     post: {
        //     //       comments: [newFeedItem, ...prev.post.comments]
        //     //     }
        //     //   });
        //     }
        // })
  
    return (<div>
        <p> Nothing</p>
        <Profiler id="InBooks" onRender={(...props)=> {console.log(props);}}>
        {
        data.books.map(({ title, author, id }) => (
            // <div key={title}>
            //     <p>
            //     [{id}] {title}: {author}
            //     </p>
            // </div>
            <Profiler id={`Book ${id}`} onRender={(...props)=> {console.log(props);}}>
            <Book key={id} title={title} author={author} id={id}/>
            </Profiler>
            ))
        }
        {/* <h4>New Book: {!loading && subData &&
        <p>
        <p>{subData.bookAdded.title}</p>
        <p>{subData.bookAdded.author}</p>
        </p>
        }</h4>; */}
        </Profiler>
    </div>
    )
  }

  export function Book(props) {
      console.log(`redrawing ${props.id}`)
    return (<div key={props.id}>
        <p>
        [{props.id}] {props.title}: {props.author}
        </p>
    </div>);
  }