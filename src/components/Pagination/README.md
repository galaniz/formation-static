# Pagination  

**<code>Pagination(props: PaginationProps): PaginationReturn</code>**  

Output pagination navigation.

## Parameters  
- **`props`** <code><a href="#paginationprops">PaginationProps</a></code> required

## Returns  

<code><a href="#paginationreturn">PaginationReturn</a></code>

## Types

### PaginationArgs  

**Type:** <code>object</code>

#### Properties  
- **`listClass`** <code>string</code> optional  
- **`listAttr`** <code>string</code> optional  
- **`itemClass`** <code>string</code> optional  
- **`itemAttr`** <code>string</code> optional  
- **`linkClass`** <code>string</code> optional  
- **`linkAttr`** <code>string</code> optional  
- **`currentClass`** <code>string</code> optional  
- **`a11yClass`** <code>string</code> optional  
- **`firstClass`** <code>string</code> optional  
- **`lastClass`** <code>string</code> optional  
- **`prevSpanClass`** <code>string</code> optional  
- **`prevLinkClass`** <code>string</code> optional  
- **`nextSpanClass`** <code>string</code> optional  
- **`nextLinkClass`** <code>string</code> optional

### PaginationProps  

**Type:** <code>object</code>

#### Properties  
- **`total`** <code>number</code> optional  
- **`display`** <code>number</code> optional  
- **`current`** <code>number</code> optional  
- **`filters`** <code>Record&lt;string, string&gt;</code> optional  
- **`url`** <code>string</code> optional  
- **`ellipsis`** <code>string</code> optional  
- **`first`** <code>string</code> optional  
- **`last`** <code>string</code> optional  
- **`prev`** <code>string</code> optional  
- **`next`** <code>string</code> optional  
- **`firstLabel`** <code>string</code> optional  
Default: `'First page'`  
- **`lastLabel`** <code>string</code> optional  
Default: `'Last page'`  
- **`prevLabel`** <code>string</code> optional  
Default: `'Previous page'`  
- **`nextLabel`** <code>string</code> optional  
Default: `'Next page'`  
- **`currentLabel`** <code>string</code> optional  
Default: `'Current page'`  
- **`pageLabel`** <code>string</code> optional  
Default: `'Page'`  
- **`titleTemplate`** <code>string</code> optional  
Default: `'Page %current of %total'`  
- **`args`** <code><a href="#paginationargs">PaginationArgs</a></code> optional

### PaginationData  

**Type:** <code>object</code>

#### Properties  
- **`current`** <code>number</code> optional  
- **`total`** <code>number</code> optional  
- **`title`** <code>string</code> optional  
- **`first`** <code>number</code> optional  
- **`last`** <code>number</code> optional  
- **`next`** <code>number</code> optional  
- **`prev`** <code>number</code> optional  
- **`firstParams`** <code>Record&lt;string, string&gt;</code> optional  
- **`lastParams`** <code>Record&lt;string, string&gt;</code> optional  
- **`nextParams`** <code>Record&lt;string, string&gt;</code> optional  
- **`prevParams`** <code>Record&lt;string, string&gt;</code> optional  
- **`currentParams`** <code>Record&lt;string, string&gt;</code> optional

### PaginationReturn  

**Type:** <code>object</code>

#### Properties  
- **`output`** <code>string</code> required  
- **`data`** <code><a href="#paginationdata">PaginationData</a></code> required