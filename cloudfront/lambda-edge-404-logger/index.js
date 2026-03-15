/**
 * Lambda@Edge: origin-response — Log 404 paths to CloudWatch
 *
 * CloudFront Functions are NOT invoked for 4xx/5xx responses, so we use
 * Lambda@Edge origin-response to capture unknown URLs for Ahrefs redirect discovery.
 *
 * Log group: /aws/lambda/us-east-1.log-404-origin-response (or your function name)
 */
exports.handler = async (event) => {
  const response = event.Records[0].cf.response;
  const request = event.Records[0].cf.request;

  if (response.status === "404") {
    console.log(
      JSON.stringify({
        type: "404_MISSING_REDIRECT",
        uri: request.uri,
        querystring: request.querystring,
        host: request.headers.host?.[0]?.value,
      })
    );
  }

  return response;
};
