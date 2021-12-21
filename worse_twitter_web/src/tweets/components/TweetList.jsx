import { useEffect } from 'react'
import { Button } from 'bootstrap-react'
import Tweet from './Tweet'
import { apiTweetList } from '../tweet_functions'
import '../styles/TweetList.css'


const TweetList = ({ newTweets, setNewTweets, tweets, setTweets, username, tweetsDidSet, callback, nextUrl }) => {
  
  function handleNextPageRequestCallback(response, status) {
    window.location.href = nextUrl
  }

  useEffect(() => {
    if (newTweets.length > 0) {
      setTweets([...newTweets, ...tweets])
      setNewTweets([])
    }
    // eslint-disable-next-line
  }, [newTweets]);
  
  useEffect(() => {
    if (tweetsDidSet === false) {
      apiTweetList(username, callback)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweetsDidSet, username]);

  return (
      <div className="tweet_list__container">
          {tweets.map((tweet, idx) => {return <Tweet tweet={tweet} idx={idx} key={`${idx}-{tweet.id}`} callback={callback} currentUser={username}/>})}
          {nextUrl !== null && <button></button>}
      </div>
  )
}

export default TweetList