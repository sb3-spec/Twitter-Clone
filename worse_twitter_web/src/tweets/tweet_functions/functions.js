import { lookup } from '../../tweet_lookup/lookup'

export function apiTweetCreate(newTweet, callBack, user) {
    lookup("POST", "/tweets/create/", callBack, {content: newTweet, username: user})
}
  
export function apiTweetList(username, callback) {
    let endpoint = '/tweets/'

    if (username) {
        endpoint += `?username=${username}`
    }
    lookup("GET", endpoint, callback)
}

export function apiTweetDetail(tweetId, callback) {
    let endpoint = '/tweets/'

    if (tweetId) {
        endpoint += `${tweetId}`
    }
    lookup("GET", endpoint, callback)
}

export function apiTweetAction(tweetId, action, callback, user) {
    lookup("POST", "/tweets/action/", callback, {id: tweetId, action: action, username: user})
}

