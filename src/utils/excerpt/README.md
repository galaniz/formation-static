# getExcerpt  

**<code>getExcerpt(args: ExcerptArgs): string</code>**  

Excerpt from content limited by word count.

## Parameters  
- **`args`** <code><a href="#excerptargs">ExcerptArgs</a></code> required

## Returns  

<code>string</code>

## Types

### ExcerptArgs  

**Type:** <code>object</code>

#### Properties  
- **`excerpt`** <code>string</code> optional  
- **`content`** <code><a href="/src/global/README.md#generic">Generic</a> | <a href="/src/global/README.md#generic">Generic</a>[]</code> optional  
- **`prop`** <code>string</code> optional  
Default: `'value'`  
- **`limit`** <code>number</code> optional  
Default: `25`  
- **`limitExcerpt`** <code>boolean</code> optional  
Default: `false`  
- **`more`** <code>string</code> optional  
Default: `'&hellip;'`