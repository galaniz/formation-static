# Link

## shareLinks  

Start of share links by platform.  

**Type:** <code><a href="#linkshare">LinkShare</a></code>

## getShareLinks  

**<code>getShareLinks(url: string, platforms: string[]): LinkShareReturn[]</code>**  

Social share links.

### Parameters  
- **`url`** <code>string</code> required  
- **`platforms`** <code>string[]</code> required

### Returns  

<code><a href="#linksharereturn">LinkShareReturn</a>[]</code>

## getSlug  

**<code>getSlug(args: LinkSlugArgs, returnParents?: boolean): LinkSlugReturnType</code>**  

Slug with archive/taxonomy base and parents.

### Parameters  
- **`args`** <code><a href="#linkslugargs">LinkSlugArgs</a></code> required  
- **`returnParents`** <code>boolean</code> optional  
Default: `false`

### Returns  

<code><a href="#linkslugreturntype">LinkSlugReturnType</a></code>

## getPermalink  

**<code>getPermalink(slug?: string, trailingSlash?: boolean): string</code>**  

Absolute or relative URL.

### Parameters  
- **`slug`** <code>string</code> optional  
- **`trailingSlash`** <code>boolean</code> optional  
Default: `true`

### Returns  

<code>string</code>

## getLink  

**<code>getLink(internalLink?: InternalLink, externalLink?: string): string</code>**  

Permalink from external or internal source.

### Parameters  
- **`internalLink`** <code><a href="/src/global/README.md#internallink">InternalLink</a></code> optional  
- **`externalLink`** <code>string</code> optional

### Returns  

<code>string</code>

## Types

### LinkShare  

**Type:** <code>object</code>

#### Properties  
- **`Facebook`** <code>string</code> required  
- **`X`** <code>string</code> required  
- **`LinkedIn`** <code>string</code> required  
- **`Pinterest`** <code>string</code> required  
- **`Reddit`** <code>string</code> required  
- **`Email`** <code>string</code> required

### LinkShareReturn  

**Type:** <code>object</code>

#### Properties  
- **`type`** <code>string</code> required  
- **`link`** <code>string</code> required

### LinkSlugArgs  

**Type:** <code>object</code>

#### Properties  
- **`slug`** <code>string</code> required  
- **`id`** <code>string</code> optional  
- **`contentType`** <code>string</code> optional  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional  
- **`params`** <code>Record&lt;string, string&gt; | string</code> optional

### LinkSlugReturn  

**Type:** <code>object</code>

#### Properties  
- **`slug`** <code>string</code> required  
- **`parents`** <code><a href="/src/global/README.md#parent">Parent</a>[]</code> required

### LinkSlugReturnType  

**Type:** <code>string | <a href="#linkslugreturn">LinkSlugReturn</a></code>