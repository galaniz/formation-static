# Redirects

## redirects  

Redirects data.  

**Type:** <code>string[]</code>

## createRedirectsFile  

**<code>createRedirectsFile(path: string): Promise&lt;void&gt;</code>**  

Create redirects file from redirects array.

### Parameters  
- **`path`** <code>string</code> required  
Default: `site/_redirects`

### Returns  

<code>Promise&lt;void&gt;</code>

## setRedirects  

**<code>setRedirects(data: RenderRedirect[]): boolean</code>**  

Clear redirects and append new data.

### Parameters  
- **`data`** <code><a href="/src/render/README.md#renderredirect">RenderRedirect</a>[]</code> required

### Returns  

<code>boolean</code>