# Demo APP: https://chetantheone-increment-integer-service-1.glitch.me/

## This is incremental integer service created using Express js( Node js ), MongoDB, Jquery and Bootstrap 4.5.

### By this you can get:
1. Current integer
2. Get next integer in sequence.
3. Reset integer to an integer no greater than or equal to 0.

### Steps to run:
1. Install node 12.16.3
2. Copy config_sample.js and create config.js.
3. Add DB URL, port no and other information.
3. Run `npm install`
4. run `node app.js` ( for production run `npm start`)
5. Use GitHub login

### Additional Notes:
1. Time spent 5hrs approx
2. User's integers data state is not managed at the client-side.
3. Generating the next integer state is only managed by the MongoDB and not sending any current state.
4. This service accurately tells the current/next integer even when multiple reset/next calls simultaneously.
