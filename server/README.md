There a few endpoints exists in this server

// Auth
POST - ip:port/api/v1/auth/sign-in
POST - ip:port/api/v1/auth/sign-up
POST - ip:port/api/v1/auth/sign-out

// User
GET - ip:port/api/v1/user (to get user info)
POST - ip:port/api/v1/user (to update user info)

// Appointments
GET - ip:port/api/v1/appointments (get list of appointments)
POST - ip:port/api/v1/appointments (insert new appointment)
PUT - ip:port/api/v1/appointments (update an appointment)
DELETE - ip:port/api/v1/appointments (delete an appointment)
