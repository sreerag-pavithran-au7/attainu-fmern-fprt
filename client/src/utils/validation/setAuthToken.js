const setAuthToken = token=>{
    console.log('token -- ', token)
    if(token){
        fetch.defaults.headers.common['Authorization']='Bearer '+token;
    }
    else {
        delete fetch.defaults.headers.common['Authorization'];
    }
}


export default setAuthToken;