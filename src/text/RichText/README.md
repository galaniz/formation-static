# Rich Text

## getPlainText  

**<code>getPlainText(args: RichTextContent | RichTextContent[] | string | undefined): string</code>**  

Rich text content as plain text string.

### Parameters  
- **`args`** <code><a href="#richtextcontent">RichTextContent</a> | <a href="#richtextcontent">RichTextContent</a>[] | string | undefined</code> required

### Returns  

<code>string</code>

## RichText  

**<code>RichText(props: RichTextProps): string</code>**  

Output rich text.

### Parameters  
- **`props`** <code><a href="#richtextprops">RichTextProps</a></code> required

### Returns  

<code>string</code>

## Types

### RichTextContent  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`content`** <code><a href="/src/render/README.md#renderrichtext">RenderRichText</a>[] | string</code> optional

### RichTextArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`tag`** <code>string</code> optional  
- **`content`** <code><a href="/src/render/README.md#renderrichtext">RenderRichText</a>[] | string</code> optional  
- **`classes`** <code>string</code> optional  
- **`textStyle`** <code>string</code> optional  
- **`headingStyle`** <code>string</code> optional  
- **`caption`** <code><a href="/src/render/README.md#renderrichtext">RenderRichText</a>[] | string</code> optional  
- **`align`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`internalLink`** <code><a href="/src/global/README.md#internallink">InternalLink</a></code> optional  
- **`style`** <code>string</code> optional  
- **`attr`** <code>string | <a href="/src/global/README.md#genericstrings">GenericStrings</a></code> optional  
- **`dataAttr`** <code>boolean | string[]</code> optional  
Default: `true`

### RichTextProps  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderfunctionargs">RenderFunctionArgs</a></code>

#### Properties  
- **`args`** <code><a href="#richtextargs">RichTextArgs</a></code> required