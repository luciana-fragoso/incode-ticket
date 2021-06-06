
checkCookie = function(cookie){
    var user_id = null;
  if (cookie !== undefined) {
    let token = cookie.slice(11);
    console.log(token);
    user_id = isLogged(token);
  } 

  return user_id;
}




module.exports = { checkCookie }