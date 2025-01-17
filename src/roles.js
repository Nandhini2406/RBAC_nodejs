const express = require('express');
const rolePermissions = require('./utils/rolesPermissions'); 


const getRoles = (req, res) => {
    res.json(rolePermissions); // Send the roles object
};

module.exports = { getRoles };
