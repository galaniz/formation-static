# Global

## Types

### Taxonomy  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required  
- **`title`** <code>string</code> required  
- **`contentTypes`** <code>string[]</code> required  
- **`slug`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`isPage`** <code>boolean</code> optional  
- **`usePrimaryContentTypeSlug`** <code>boolean</code> optional  
Default: `true`

### Generic  

**Type:** <code>Object&lt;string, &ast;&gt;</code>

### InternalLink  

**Type:** <code>object</code>  

**Augments:** <code><a href="#generic">Generic</a></code>

#### Properties  
- **`id`** <code>string</code> optional  
- **`contentType`** <code>string</code> optional  
- **`slug`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`title`** <code>string</code> optional  
- **`taxonomy`** <code><a href="#taxonomy">Taxonomy</a></code> optional

### Parent  

**Type:** <code>object</code>  

**Augments:** <code><a href="#internallink">InternalLink</a></code>

#### Properties  
- **`id`** <code>string</code> required  
- **`slug`** <code>string</code> required  
- **`title`** <code>string</code> required

### ParentArgs  

**Type:** <code>object</code>

#### Properties  
- **`renderType`** <code>string</code> required  
- **`args`** <code>object</code> required

### RefString  

**Type:** <code>object</code>

#### Properties  
- **`ref`** <code>string</code> required

### Source  

**Type:** <code>&#39;cms&#39; | &#39;local&#39;</code>

### GenericFunction  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code>&ast;</code> required

#### Returns  

<code>&ast;</code>

### GenericStrings  

**Type:** <code>Object&lt;string, string&gt;</code>

### GenericNumbers  

**Type:** <code>Object&lt;string, number&gt;</code>