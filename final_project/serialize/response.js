// helper to send success response
const $send = (res, message, status = 200) =>
  res.status(status).json({ message });

// helper to send error response
const $error = (res, message, status = 400) =>
  res.status(status).json({ message });

// helper to send JSON response
const $response = (res, value, status = 200) =>
  res.status(status).send(JSON.stringify(value, null, 4));

module.exports = {
  $send,
  $error,
  $response,
};
