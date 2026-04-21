# User Authentication & Profile Management API

## API Authentication Flow Diagram

- ### `POST - /api/auth/register`
    - check credentials(`email`, `name`, `password`) valid(email format and already eixstance, password strength, name length) or not
        - if valid
            - generate hashed password
            - save credentials to db
            - return success message with 201 status code
        - if invalid
            - return failed message for bad request with 400 status code

---

- ### `POST - /api/auth/login`
    - check credentials(email, password) valid or not
        - if valid
            - generate session id, access token(with 15 minutes lifetime & payload: {uid, sid, email}) & refresh token(with 7 days lifetime)
            - save session id(sid) & refresh token(refresh_token) in cookie(httpOnly: true, secure: true, sameSite: "strict", for tokens - signed: true, path: "/")
            - generate hashed refresh token
            - save session id, user id & hashed refresh token in persistent-db/redis
            - return success message & access token with 200 status code
        - if invalid
            - return failed message for invalid credentials with 401 status code

---

- ### `POST - /api/auth/refresh`
    - check is there any refresh token in redis with same user id & session id
        - if yes
            - check is that hashed refresh token same to the passed refresh token using jwt verify method sent from client through cookie
                - if same
                    - check is that refresh token valid or not
                        - if valid
                            - generate new access token & refresh token
                            - generate hashed refresh token
                            - delete previous cookies for session id, access token & refresh token
                            - store newly generated refresh token & old session id to cookie(httpOnly: true, secure: true, sameSite: "strict", for tokens - signed: true, path: "/")
                            - update the refresh token in redis with newly generated hashed refresh token
                            - return success message & access token with 200 status code
                        - if invalid
                            - delete that refresh token from redis
                            - return failed message for invalid refresh token with 401 status code
                - if not same
                    - return failed message for invalid refresh token with 401 status code
        - if no
            - return failed message for invalid refresh token with 401 status code

---

- ### `GET - /api/users/me`
    - verify access token not null and valid & is there any refresh token exist with same user id and session id in redis/persistent-db
        - if valid
            - check requested data exist or not in db
                - if exist
                    - return success message & requested data with 200 status code
                - if not exist
                    - return failed message for data not found with 404 status code
        - if invalid
            - return failed message for invalid access token with 401 status code

---

- ### `PUT - /api/users/me`
    - verify access token not null and valid & is there any refresh token exist with same user id and session id in redis
        - if valid
            - check requested data exist or not in db
                - if exist
                    - check the passed data valid(email format, password strenght, name length) or not
                        - if valid
                            - update the data to database
                            - return success message for update with 200 status code
                        - if invalid
                            - return failed message for bad request(invalid data) with 400 status code
                - if not exist
                    - return failed message for data not found with 404 status code
        - if invalid
            - return failed message for invalid access token with 401 status code

---

- ### `POST - /api/auth/logout?all-device=true/false`
    - check logout `all-device` query true or false
        - if true
            - verify access token not null and valid & is there any refresh token exist with same user id and session id in redis
                - if valid
                    - delete all the refresh token with same user id in redis
                    - return success message with 200 status code
                - if invalid
                    - return failed message for invalid access token with 401 status code
        - if false
            - verify access token &  is there any refresh token exist with same user id and session id in redis
                - if valid
                    - delete refresh token with same user id & session id 
                    - return success message with 200 status code
                - if invalid
                    - return failed message for invalid access token with 401 status code

---

- ### `POST - /api/auth/forget-password`
    - check is the passed email exist in db or not
        - if yes
            - generate a password reset token
            - generate hashed token and save that hashed token in redis with 10 minutes expiration
            - send a mail to that email with a link that contain `token` query with the generated token
            - return success message with 200 status code
        - if no
            - return success message with 200 status code

---

- ### `POST - /api/auth/reset-password?token=my-token`
    - check if the token exist in redis or not
        - if exist
            - verify the token validity
                - if valid
                    - check is there any password passed in request body
                        - if password exist
                            - delete all refresh token & reset token with that user id from redis
                            - update password
                            - return success message with 200 status code
                        - if password not exist
                            - return success message with 200 status code
                - if invalid
                    - return failed message for invalid token with 401 status code
        - if not exist
            - return failed message for invalid token with 401 status code

---

## Format

### Access token JWT Payload Format

```typescript
{
	uid,
	sid?,
	email,
	type: "access" || "refresh" || "reset"
}
```

### Cookie Payload Format

```typescript
{
	uid,
	sid,
	refresh_token
}
```

## Future Improvements

- Temp mail detection
- Rate limiting
- store device metadata like user_agent, ip etc in redis to track behavior
- csrf protection
- cors
- remember me check mark when login

## Frontend Flow

- ### `Registration Flow`
    - trim email & name
    - validate credentials(email, name, password)
        - if valid
            - send the credentials to `POST - /api/auth/register` endpoint & wait for response
                - if response ok
                    - show registration success message
                    - redirect to login page
                - if response not ok
                    - show the response message
        - if invalid
            - show message for invalid data
- ### `Login Flow`
    - trim email
    - validate credentials(email, password)
        - if valid
            - send the credentials to `POST - /api/auth/login` endpoint & wait for response
                - if response ok
                    - store access token to a variable
                    - redirect to profile page
                - if response not ok
                    - show the response message
        - if invalid
            - show login failed message for invalid credentials
- ### `Profile Flow`
    - attach access token to Authorization header and send request to `GET - /api/users/me` endpoint
        - if response ok
            - process & show the data
        - if response not ok
            - send a request to `POST - /api/auth/refresh` endpoint
                - if response ok
                    - store access token to a variable
                    - attach access token to Authorization header and send request to `GET - /api/users/me` endpoint
                        - if response ok
                            - process and show the data
                        - if response not ok
                            - redirect to login page
                - if response not ok
                    - redirect to login page
- ### `Logout Flow`
    - attach access token to Authorization header and send request to `GET - /api/auth/logout?all-device=true/false` endpoint
        - if response ok
            - redirect to login page
        - if response not ok
            - send a request to `POST - /api/auth/refresh` endpoint
                - if response ok
                    - store access token to a variable
                    - attach access token to Authorization header and send request to `GET - /api/auth/logout?all-device=true/false` endpoint
                        - if response ok
                            - redirect to login page
                        - if response not ok
                            - show logout failed message for some reason
                - if response not ok
                    - show logout failed message for some reason
- ### `Forget Password Flow`
    - attach email address to request body and send request to `POST - /api/auth/forget-password` endpoint
        - if response ok
            - show response message
        - if response not ok
            - show response message
- ### `Reset Password Flow`
    - send request to `POST - /api/auth/reset-password?token=my-token` endpoint
        - if response ok
            - redirect to password reset form
        - if response not ok
            - show the response message
- ### `Reset Form Flow`
    - attach new password to request body and send request to `POST - /api/auth/reset-password?token=my-token` endpoint
        - if response ok
            - redirect to login page
        - if response not ok
            - show the response message