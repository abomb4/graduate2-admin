

const authorizationFunctions = {

  haveRole: function(user, role) {
    const roles = user.roles;
    if (!roles || roles.length === 0) {
      return false;
    } else {
      for (let i in roles) {
        if (roles[i].roleName === role) {
          return true;
        }
      }
    }
  }
};

export { authorizationFunctions } ;
export default authorizationFunctions;
