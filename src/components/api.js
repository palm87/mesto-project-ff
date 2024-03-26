const configApi = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-9',
    headers: {
      authorization: '10c1d3be-59bf-42c2-a7cc-3e9744607a63',
      'Content-Type': 'application/json'
    }
  }

function handleResponse(response) {
    if (response.ok) {
        return response.json()
    }
    else {
        return Promise.reject(error);
    }

}

export function handleError(error) {
    console.log('Возникла ошибка: ' + error)

}



export function getData (uri) {
    const targetUrl = configApi.baseUrl + uri
    return fetch(targetUrl, {headers:configApi.headers})
        .then(handleResponse)
}

export function getHead(url) {
    return fetch(url, {method: 'HEAD'})
        .then(result => {return result.headers.get('Content-Type')})
      
     
}


export function changeData(uri, data, method='POST') {
    const targetUrl = configApi.baseUrl + uri
    const body = JSON.stringify(data);
    return fetch(targetUrl, {
        method: method,
        body: body,
        headers: configApi.headers})
        .then(handleResponse)
}


