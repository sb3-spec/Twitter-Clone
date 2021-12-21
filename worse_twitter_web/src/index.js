import React from 'react';
import ReactDOM from 'react-dom';
import TweetDetail from './tweets/components/TweetDetail'

import Home from './pages/Home';


// const appEl = document.getElementById('root')
// const e = document.createElement
// if (appEl) {
//     MyComponent = e
//     ReactDOM.render(<App />, appEl);
// }
const e = React.createElement
const tweetList = document.getElementById("root")
if (tweetList) {
    const MyComponent = e(Home, tweetList.dataset)
    ReactDOM.render(MyComponent, tweetList);
}

const tweetDetailElements = document.getElementById("tweet-detail-view")

if (tweetDetailElements) {
    ReactDOM.render(e(TweetDetail, tweetDetailElements.dataset), tweetDetailElements)
}



