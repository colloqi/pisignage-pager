let base = 'https://efle3r.colloqi.com'

export default {
    base: base,
    category: base+'/api/categories',
    users: base+'/api/users',
    stats: base+'/api/Stats',
    messages: base+'/api/messages',
    groups: base+'/api/groups',
    containers: base+'/api/containers',
    login: base+'/api/users/login?include=user&rememberMe=true',
    logout: base+'/api/users/logout',
    resetPassword: base+'/api/users/reset'
}