const rolePermissions = {
    Admin: ['view', 'add', 'assign', 'delete', 'status'],
    Manager: ['view', 'add', 'assign'],
    Team_Leader: ['view', 'assign'],
    Employee: ['view', 'status'],
    Intern: ['view'],
};

module.exports = rolePermissions;
