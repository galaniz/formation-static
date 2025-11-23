# Render

## renderFunctions  

Output elements in render content.  

**Type:** <code><a href="#renderfunctions">RenderFunctions</a></code>

## renderInlineContent  

**<code>renderInlineContent(content: RenderItem[], args?: RenderContentArgs): Promise&lt;string&gt;</code>**  

Convenience wrapper for render content.

### Parameters  
- **`content`** <code><a href="#renderitem">RenderItem</a>[]</code> required  
- **`args`** <code><a href="#rendercontentargs">RenderContentArgs</a></code> optional

### Returns  

<code>Promise&lt;string&gt;</code>

## renderInlineItem  

**<code>renderInlineItem(item: RenderInlineItem): Promise&lt;string&gt;</code>**  

Convenience wrapper for render item.

### Parameters  
- **`item`** <code><a href="#renderinlineitem">RenderInlineItem</a></code> required

### Returns  

<code>Promise&lt;string&gt;</code>

## renderLayout  

**<code>renderLayout(args: RenderLayoutArgs): string | Promise&lt;string&gt;</code>**  

Output HTML element.

### Parameters  
- **`args`** <code><a href="#renderlayoutargs">RenderLayoutArgs</a></code> required

### Returns  

<code>string | Promise&lt;string&gt;</code>

## renderHttpError  

**<code>renderHttpError(args: RenderHttpErrorArgs): string | Promise&lt;string&gt;</code>**  

Output HTTP error page.

### Parameters  
- **`args`** <code><a href="#renderhttperrorargs">RenderHttpErrorArgs</a></code> required

### Returns  

<code>string | Promise&lt;string&gt;</code>

## renderNavigation  

**<code>renderNavigation(args: NavigationProps): void | Promise&lt;void&gt;</code>**  

Navigation instance for use in render functions.

### Parameters  
- **`args`** <code><a href="/src/components/Navigation/README.md#navigationprops">NavigationProps</a></code> required

### Returns  

<code>void | Promise&lt;void&gt;</code>

## setRenderFunctions  

**<code>setRenderFunctions(args: RenderFunctionsArgs): boolean</code>**  

Content, layout and navigation functions.

### Parameters  
- **`args`** <code><a href="#renderfunctionsargs">RenderFunctionsArgs</a></code> required

### Returns  

<code>boolean</code>

## renderContent  

**<code>renderContent(args: RenderContentArgs): Promise&lt;string&gt;</code>**  

Recurse and output nested content.

### Parameters  
- **`args`** <code><a href="#rendercontentargs">RenderContentArgs</a></code> required

### Returns  

<code>Promise&lt;string&gt;</code>

## renderItem  

**<code>renderItem(args: RenderItemArgs): Promise&lt;(RenderItemReturn|null)&gt;</code>**  

Output single post or page.

### Parameters  
- **`args`** <code><a href="#renderitemargs">RenderItemArgs</a></code> required

### Returns  

<code>Promise&lt;(<a href="#renderitemreturn">RenderItemReturn</a>|null)&gt;</code>

## render  

**<code>render(args: RenderArgs): Promise&lt;(RenderReturn&gt;|RenderReturn)[]</code>**  

Loop through all content types to output pages and posts.

### Parameters  
- **`args`** <code><a href="#renderargs">RenderArgs</a></code> required

### Returns  

<code>Promise&lt;(<a href="#renderreturn">RenderReturn</a>&gt;|<a href="#renderreturn">RenderReturn</a>)[]</code>

## Types

### RenderMeta  

**Type:** <code>object</code>

#### Properties  
- **`title`** <code>string</code> optional  
- **`paginationTitle`** <code>string</code> optional  
- **`description`** <code>string</code> optional  
- **`url`** <code>string</code> optional  
- **`image`** <code>string</code> optional  
- **`canonical`** <code>string</code> optional  
- **`canonicalParams`** <code>string</code> optional  
- **`prev`** <code>string</code> optional  
- **`next`** <code>string</code> optional  
- **`index`** <code>boolean</code> optional  
Default: `true`  
- **`isIndex`** <code>boolean</code> optional

### RenderTag  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required

### RenderMetaTags  

**Type:** <code>object</code>

#### Properties  
- **`tags`** <code><a href="#rendertag">RenderTag</a>[]</code> optional

### RenderItem  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a> | <a href="/src/global/README.md#taxonomy">Taxonomy</a></code>

#### Properties  
- **`id`** <code>string</code> optional  
- **`contentType`** <code>string</code> optional  
- **`renderType`** <code>string</code> optional  
- **`slug`** <code>string</code> optional  
- **`title`** <code>string</code> optional  
- **`content`** <code><a href="#renderitem">RenderItem</a> | <a href="#renderitem">RenderItem</a>[]</code> optional  
- **`meta`** <code><a href="#rendermeta">RenderMeta</a></code> optional  
- **`baseUrl`** <code>string</code> optional  
- **`baseType`** <code>string</code> optional  
- **`archive`** <code>string</code> optional  
- **`parent`** <code><a href="#renderitem">RenderItem</a></code> optional  
- **`taxonomy`** <code><a href="/src/global/README.md#taxonomy">Taxonomy</a></code> optional  
- **`metadata`** <code><a href="#rendermetatags">RenderMetaTags</a></code> optional  
- **`pagination`** <code><a href="/src/components/Pagination/README.md#paginationdata">PaginationData</a></code> optional

### RenderServerlessData  

**Type:** <code>object</code>

#### Properties  
- **`path`** <code>string</code> required  
- **`query`** <code><a href="/src/global/README.md#generic">Generic</a></code> optional

### RenderPreviewData  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required  
- **`contentType`** <code>string</code> required  
- **`locale`** <code>string</code> optional

### RenderBase  

**Type:** <code>object</code>

#### Properties  
- **`itemData`** <code><a href="#renderitem">RenderItem</a></code> required  
- **`itemContains`** <code>Set&lt;string&gt;</code> required  
- **`itemHeadings`** <code>Array&lt;<a href="/src/text/RichText/README.md#richtextheading">RichTextHeading</a>&gt;[]</code> required  
- **`serverlessData`** <code><a href="#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="#renderpreviewdata">RenderPreviewData</a></code> optional

### RenderContentArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="#renderbase">RenderBase</a></code>

#### Properties  
- **`content`** <code><a href="#renderitem">RenderItem</a>[]</code> required  
- **`parents`** <code><a href="/src/global/README.md#parentargs">ParentArgs</a>[]</code> required  
- **`headingsIndex`** <code>number</code> optional  
- **`depth`** <code>number</code> optional

### RenderInlineItem  

**Type:** <code>object</code>  

**Augments:** <code><a href="#renderitem">RenderItem</a></code>

### RenderFunctionArgs  

**Type:** <code>object</code>

#### Properties  
- **`args`** <code>object</code> required  
- **`parents`** <code><a href="/src/global/README.md#parentargs">ParentArgs</a>[]</code> optional  
- **`itemData`** <code><a href="#renderitem">RenderItem</a></code> optional  
- **`itemContains`** <code>Set&lt;string&gt;</code> optional  
- **`serverlessData`** <code><a href="#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="#renderpreviewdata">RenderPreviewData</a></code> optional  
- **`headings`** <code><a href="/src/text/RichText/README.md#richtextheading">RichTextHeading</a>[]</code> optional  
- **`children`** <code>object[]</code> optional

### RenderFunction  

**Type:** <code>function</code>

#### Parameters  
- **`props`** <code><a href="#renderfunctionargs">RenderFunctionArgs</a></code> required

#### Returns  

<code>string | string[] | Promise&lt;(string|string&gt;)[]</code>

### RenderFunctions  

**Type:** <code>Object&lt;string, <a href="#renderfunction">RenderFunction</a>&gt;</code>

### RenderLayoutArgs  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required  
- **`meta`** <code><a href="#rendermeta">RenderMeta</a></code> required  
- **`contentType`** <code>string</code> required  
- **`content`** <code>string</code> required  
- **`slug`** <code>string</code> required  
- **`itemData`** <code><a href="#renderitem">RenderItem</a></code> required  
- **`itemContains`** <code>Set&lt;string&gt;</code> optional  
- **`itemHeadings`** <code>Array&lt;<a href="/src/text/RichText/README.md#richtextheading">RichTextHeading</a>&gt;[]</code> optional  
- **`serverlessData`** <code><a href="#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="#renderpreviewdata">RenderPreviewData</a></code> optional

### RenderHttpErrorArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`code`** <code>number</code> required

### RenderLayout  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#renderlayoutargs">RenderLayoutArgs</a></code> required

#### Returns  

<code>string | Promise&lt;string&gt;</code>

### RenderNavigation  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="/src/components/Navigation/README.md#navigationprops">NavigationProps</a></code> required

#### Returns  

<code>void | Promise&lt;void&gt;</code>

### RenderHttpError  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#renderhttperrorargs">RenderHttpErrorArgs</a></code> required

#### Returns  

<code>string | Promise&lt;string&gt;</code>

### RenderFunctionsArgs  

**Type:** <code>object</code>

#### Properties  
- **`functions`** <code><a href="#renderfunctions">RenderFunctions</a></code> required  
- **`layout`** <code><a href="#renderlayout">RenderLayout</a></code> required  
- **`navigation`** <code><a href="#rendernavigation">RenderNavigation</a></code> optional  
- **`httpError`** <code><a href="#renderhttperror">RenderHttpError</a></code> optional

### RenderItemArgs  

**Type:** <code>object</code>

#### Properties  
- **`item`** <code><a href="#renderitem">RenderItem</a></code> required  
- **`serverlessData`** <code><a href="#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="#renderpreviewdata">RenderPreviewData</a></code> optional

### RenderItemReturnData  

**Type:** <code>object</code>

#### Properties  
- **`slug`** <code>string</code> required  
- **`output`** <code>string</code> required

### RenderItemReturn  

**Type:** <code>object</code>

#### Properties  
- **`serverlessRender`** <code>boolean</code> optional  
- **`itemData`** <code><a href="#renderitem">RenderItem</a></code> optional  
- **`data`** <code><a href="#renderitemreturndata">RenderItemReturnData</a></code> optional

### RenderRedirect  

**Type:** <code>object</code>

#### Properties  
- **`redirect`** <code>string[]</code> required

### RenderAllDataContent  

**Type:** <code>Object&lt;string, <a href="#renderitem">RenderItem</a>&gt;[]</code>

### RenderAllData  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`navigation`** <code><a href="/src/components/Navigation/README.md#navigationlist">NavigationList</a>[]</code> optional  
- **`navigationItem`** <code><a href="/src/components/Navigation/README.md#navigationitem">NavigationItem</a>[]</code> optional  
- **`redirect`** <code><a href="#renderredirect">RenderRedirect</a>[]</code> optional  
- **`content`** <code><a href="#renderalldatacontent">RenderAllDataContent</a></code> required

### RenderArgs  

**Type:** <code>object</code>

#### Properties  
- **`allData`** <code><a href="#renderalldata">RenderAllData</a></code> optional  
- **`serverlessData`** <code><a href="#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="#renderpreviewdata">RenderPreviewData</a></code> optional

### RenderReturn  

**Type:** <code>object</code>

#### Properties  
- **`slug`** <code>string</code> required  
- **`output`** <code>string</code> required