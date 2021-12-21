import { Button } from 'bootstrap-react'
import { useState, useEffect } from 'react';
import '../styles/Tweet.css'
import { apiTweetAction, apiTweetList } from '../tweet_functions'
 
function Tweet({ tweet, callback, className, currentUser }) { 
    const [didLike, setDidLike] = useState(false);
    const [didRetweet, setDidRetweet] = useState(false);
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const myCallback = callback 

    const handleLink = (e) => {
        e.preventDefault()
        e.stopPropagation()
        window.location.href = `/${tweet.id}`
    }    
    

    const handleBackendActionEvent = (response, status) => {
        console.log(status, response)
        if (status === 201 || status === 200) {
            setLikes(response.likes)
            setDidLike((prevState) => !prevState)
            if (status === 201) {
                setDidRetweet((prevState) => !prevState)
            } else if (status === 200 && response.is_logged_in) {
                window.location.href = '/'
            }
            apiTweetList(currentUser, callback)
        } else {
            setDidLike((prevState) => !prevState)
        }
    }


    function handleTweetAction(action, event) {
        event.stopPropagation()
        event.preventDefault()
        

        let currentAction = action
        
        if (action === 'like') {
            if (didLike) {
                currentAction = 'unlike'
            }   
        } else if (action === 'retweet' & didRetweet) {
            return
        }
        apiTweetAction(tweet.id, currentAction, handleBackendActionEvent, currentUser)
    }

    const Retweet = () => {
        return tweet.parent ? (
            <div onClick={((e) => handleLink(e))}>
                <p>Retweet</p>
                <div className=''>
                    <Tweet tweet={tweet.parent} callback={myCallback} className="retweet" currentUser={currentUser} />
                </div>
            </div>
        ) : null
    }

    useEffect(() => {
        setLikes(tweet.likes)
    }, [tweet.likes]);

    return (
        <div className={className + " overall-container"} onClick={((e) => handleLink(e))}>
            <div className="tweet-container">
                <div className="tweet-content-wrapper">
                        <p className="tweet-text">{`${tweet.id ? tweet.id : -1}   ${tweet.content}`}</p>
                </div>
                <div className="retweet-container">
                    <Retweet />
                </div>
                {!tweet.parent &&
                <div className="buttons">
                    
                    <Button variant={didLike ? "primary" : "outline"} onClick={((e) => handleTweetAction("like", e))}>
                        <i className="far fa-thumbs-up"></i>{likes}
                    </Button>
                    <div className="retweet-btn">
                        <Button variant={!didRetweet && "outline"} color="success" onClick={((e) => handleTweetAction("retweet", e))}><i className="fas fa-retweet"></i></Button>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Tweet


