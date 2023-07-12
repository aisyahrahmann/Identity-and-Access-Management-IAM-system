//define all the authentication method that we gonna use throughout the development
module.exports={
    getUser:function(){
        const user = sessionStorage.getItem('user');
        console.log('name', user);
        if(user==='undefined'||!user){
            return null;
        }else{
            return JSON.parse(user);
        }
    },

    getToken: function(){
        return sessionStorage.getItem('token');
    },

    setUserSession: function(user,token){
        console.log('Setting user session:', user, token);
        console.log('token for user: ', token)
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token',token);
    },

    resetUserSession:function(){
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }
}