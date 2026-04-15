# API Documentation

## endpoints

### `POST - /api/auth/register`

- for success operation, return success message like `{message:  "success message"}` with 200 status code
- for server error, return failed message like `{message: "Something went wrong"}` with 500 status code
- for invalid input, return error from zod like below:

  ```typescript
  {
  	messages: [
  		"message 1",
  		"message 2",
  		//.....
  	],
  	issues: [
  		// here issues
  	]
  }
  ```