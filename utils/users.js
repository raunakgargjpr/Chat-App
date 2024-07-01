const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = {
    id: id, 
    username: username, 
    room: room
  };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  // give that user whose id is matching
  return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) { // means the user index is there
    // first it will remove the user from the array, and return that removed user
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  // returns an array of users with room mentioned in argument
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
