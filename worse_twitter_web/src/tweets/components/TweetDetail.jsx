import React, { useState, useEffect } from 'react'
import { apiTweetDetail } from '../tweet_functions'
import Tweet from './Tweet'

function TweetDetail(props) {
    const { tweetId } = props
    const [didLookup, setDidLookup] = useState(false)
    const [tweet, setTweet] = useState(null)

    const handleBackendLookup = (response, status) => {
        if (status === 200) {
            setTweet(response)
            console.log(response)
        } else {
            alert("There was an error finding your tweet. Please try again.")
        }
    }

    useEffect(() => {
        if (didLookup === false) {
            apiTweetDetail(tweetId, handleBackendLookup)
            setDidLookup(true)
        }
    }, [setDidLookup, tweetId, didLookup])

    return tweet === null ? null : <Tweet tweet={tweet} />
}

export default TweetDetail
