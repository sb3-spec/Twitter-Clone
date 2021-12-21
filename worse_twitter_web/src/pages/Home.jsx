import React, { useState } from 'react'


import TweetList from "../tweets/components/TweetList"
import '../styles/Home.css'
import TweetForm from "../tweets/components/TweetForm"
import Sidebar from "../tweets/components/Sidebar"

function Home(props) {
    const [newTweets, setNewTweets] = useState([])
    const [tweets, setTweets] = useState([])
    const [tweetsDidSet, setTweetsDidSet] = useState(false)
    const [nextUrl, setNextUrl] = useState(null)

    function apiTweetListCallback (response, status) {
        if (status === 200) {
          setTweets(response.results)
          setTweetsDidSet(true)
          setNextUrl(response.next)
        } else {
          alert("There was an error")
        }
      };

    return (
        <div className="home-container">
            <Sidebar />
            <div className="twitter_feed">
                <TweetForm  
                    username={props.username}
                    newTweets={newTweets} 
                    setNewTweets={setNewTweets} 
                    tweets={tweets} 
                    setTweets={setTweets} 
                    tweetsDidSet={tweetsDidSet} 
                    callback={apiTweetListCallback}
                />
                <TweetList 
                    newTweets={newTweets} 
                    setNewTweets={setNewTweets} 
                    tweets={tweets} 
                    setTweets={setTweets} 
                    username={props.username}
                    tweetsDidSet={tweetsDidSet}
                    setTweetsDidSet={setTweetsDidSet}
                    callback={apiTweetListCallback}
                />
            </div>
        </div>
    )
}

export default Home
