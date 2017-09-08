/**
  Attempts to provide a reasonable "name" for a URL.
  Invalid urls will return an empty string.
*/
export function humanizeURL(path) {
  try {
    const url = coerceToURL(path)
    
    const pathname = url.pathname
    
    // Get the last segment of the pathname:
    const segment = pathname.replace(/\/+$/,"").split("/").pop()
    
    // Split on non common non alphanumeric symbols and word breaks:
    const humanized = segment.split(/[-_\+\s]+/).join(" ").replace(/([a-z])([A-Z])/, "$1 $2")
    
    if (humanized.length > 2) {
      return startCase(humanized)
    } else {
      return url.hostname
    }
    
  } catch (err) {
    console.warn("Could not humanize: "+path+", "+err.toString())
    return path
  }
}

/**
  Tries to clean up messy URLs.  For instance:
  
      www.example.com => http://www.example.com
  
  Throws an Error if it cannot create a URL.
*/
function coerceToURL(path) {
  try {
    return new window.URL(path)
  } catch (err) {
    return new window.URL("http://" + path)
  }
}