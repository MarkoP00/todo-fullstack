export default function callError(message, status, data = null) {
  const error = new Error(message);
  error.status = status;
  error.data = data;
  return error;
}
