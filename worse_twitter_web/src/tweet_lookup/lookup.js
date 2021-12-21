import { getCookie } from ".";

export function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest()
  const url = `http://localhost:8000/api${endpoint}`
  const csrftoken = getCookie('csrftoken')
  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  if (csrftoken) {
    // xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest')
    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest')
    xhr.setRequestHeader("X-CSRFToken", csrftoken)  
  } 

  xhr.onload = function(e) {
    if (xhr.status === 401 && xhr.response.detail === 'Authentication credentials were not provided.') {
      window.location.href = "/login?showLoginRequired=true"
    }
    console.log(callback)
    callback(xhr.response, xhr.status)
  }
  xhr.onerror = () => {
    
    callback({"message": "The request was an error"}, 400)
  }  
  xhr.send(jsonData)
}

