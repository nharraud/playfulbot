import React from 'react';
import { useQuery, useSubscription, gql } from '@apollo/client';

// import { gql } from '@apollo/client';
const BOOKS_QUERY = gql`
      query GetBooks {
        books {
          title
          author
        }
      }
    `;

const BOOK_SUBSCRIPTION = gql`
    subscription onBookAdded {
      bookAdded {
        title
        author
      }
    }
  `;

export function Books() {
    const { loading, error, data } = useQuery(BOOKS_QUERY);

    const { data: subData, loading: subLoading } = useSubscription(
        BOOK_SUBSCRIPTION,
        { }
      );
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    return (<div>
        {
        data.books.map(({ title, author }) => (
            <div key={title}>
                <p>
                {title}: {author}
                </p>
            </div>
            ))
        }
        <h4>New Book: {!loading && subData &&
        <p>
        <p>{subData.bookAdded.title}</p>
        <p>{subData.bookAdded.author}</p>
        </p>
        }</h4>;
    </div>
    )
  }