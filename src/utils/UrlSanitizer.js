const UrlSanitizer = (urltxt) => {
  try {
    // Return early if the URL text is empty or whitespace
    if (!urltxt || urltxt.trim() === '') {
      return '';
    }

    urltxt = urltxt.trim();

    // Add https:// if the protocol is missing
    if (!/^(?:f|ht)tps?:\/\//.test(urltxt)) {
      urltxt = 'https://' + urltxt;
    }

    // Add www. if missing (but only if it’s an https:// URL without www)
    if (/^https:\/\//.test(urltxt) && !/^https:\/\/www\./.test(urltxt)) {
      urltxt = urltxt.replace(/^https:\/\//, 'https://');
    }

    // URL validation pattern for complex domains and minimum length requirements
    const pattern = new RegExp(
      '^' +
      '(?:https?:\\/\\/)?' + // protocol (optional)
      '(?:(?:[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]\\.)+)' + // subdomains
      '[a-zA-Z0-9][-a-zA-Z0-9]{1,}' + // main domain name (minimum 4 chars)
      '\\.' + // dot before TLD
      '[a-zA-Z]{2,}' + // TLD
      '(?::\\d+)?' + // port (optional)
      '(?:\\/[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)?' + // path (optional)
      '(?:#[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)?' + // fragment/hash (optional)
      '$'
    );

    const result = pattern.test(urltxt);

    if (result) {
      console.log('url is valid');
      return new URL(urltxt);
    }

  } catch (error) {
    // If URL is invalid, return an empty string
    return '';
  }
};

export default UrlSanitizer;
