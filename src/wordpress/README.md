# WordPress

## normalRoutes  

Normalize WordPress routes.  

**Type:** <code>Map&lt;string, string&gt;</code>

## normalMetaKeys  

Normalize WordPress meta keys.  

**Type:** <code>Map&lt;string, string&gt;</code>

## normalizeWordPressData  

**<code>normalizeWordPressData(data: WordPressDataItem[], route?: string): RenderItem[]</code>**  

Transform WordPress data into simpler objects.

### Parameters  
- **`data`** <code><a href="#wordpressdataitem">WordPressDataItem</a>[]</code> required  
- **`route`** <code>string</code> optional

### Returns  

<code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code>

## getRoute  

**<code>getRoute(type: string): string</code>**  

Normalize route by type.

### Parameters  
- **`type`** <code>string</code> required

### Returns  

<code>string</code>

## getWordPressData  

**<code>getWordPressData(args: WordPressDataArgs): Promise&lt;RenderData&gt;</code>**  

Fetch data from WordPress CMS or cache.

### Parameters  
- **`args`** <code><a href="#wordpressdataargs">WordPressDataArgs</a></code> required

### Returns  

<code>Promise&lt;<a href="/src/render/README.md#renderdata">RenderData</a>&gt;</code>

## getAllWordPressData  

**<code>getAllWordPressData(args?: AllWordPressDataArgs): Promise&lt;(RenderAllData|undefined)&gt;</code>**  

Fetch data from all content types or single entry if serverless.

### Parameters  
- **`args`** <code><a href="#allwordpressdataargs">AllWordPressDataArgs</a></code> optional

### Returns  

<code>Promise&lt;(<a href="/src/render/README.md#renderalldata">RenderAllData</a>|undefined)&gt;</code>

## Types

### WordPressDataRendered  

**Type:** <code>object</code>

#### Properties  
- **`rendered`** <code>string</code> optional

### WordPressDataStatus  

**Type:** <code>string</code>

### WordPressDataRenderedProtected  

**Type:** <code>object</code>

#### Properties  
- **`rendered`** <code>string</code> optional  
- **`protected`** <code>boolean</code> optional

### WordPressDataMeta  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`footnotes`** <code>string</code> optional

### WordPressDataLink  

**Type:** <code>object</code>

#### Properties  
- **`href`** <code>string</code> required  
- **`name`** <code>string</code> optional  
- **`templated`** <code>boolean</code> optional  
- **`count`** <code>number</code> optional  
- **`taxonomy`** <code>string</code> optional  
- **`embeddable`** <code>boolean</code> optional

### WordPressDataLinks  

**Type:** <code>object</code>

#### Properties  
- **`self`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`collection`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`about`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`'version-history'`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`'wp:attachment'`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`'wp:term'`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required  
- **`curies`** <code><a href="#wordpressdatalink">WordPressDataLink</a>[]</code> required

### WordPressDataAuthor  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required  
- **`name`** <code>string</code> optional  
- **`url`** <code>string</code> optional  
- **`description`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`slug`** <code>string</code> optional

### WordPressDataParent  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required  
- **`title`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`excerpt`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`slug`** <code>string</code> optional  
- **`type`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`author`** <code>number</code> optional  
- **`featured_media`** <code>number</code> optional  
- **`name`** <code>string</code> optional  
- **`taxonomy`** <code>string</code> optional

### WordPressDataMediaSize  

**Type:** <code>object</code>

#### Properties  
- **`source_url`** <code>string</code> optional  
- **`mime_type`** <code>string</code> optional  
- **`file`** <code>string</code> optional  
- **`filesize`** <code>number</code> optional  
- **`width`** <code>number</code> optional  
- **`height`** <code>number</code> optional

### WordPressDataMediaDetails  

**Type:** <code>object</code>

#### Properties  
- **`width`** <code>number</code> optional  
- **`height`** <code>number</code> optional  
- **`filesize`** <code>number</code> optional  
- **`file`** <code>string</code> optional  
- **`sizes`** <code>Object&lt;string, <a href="#wordpressdatamediasize">WordPressDataMediaSize</a>&gt;</code> optional

### WordPressDataFeaturedMedia  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required  
- **`source_url`** <code>string</code> optional  
- **`alt_text`** <code>string</code> optional  
- **`caption`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`media_type`** <code>string</code> optional  
- **`mime_type`** <code>string</code> optional  
- **`media_details`** <code><a href="#wordpressdatamediadetails">WordPressDataMediaDetails</a></code> optional

### WordPressDataAttachment  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required  
- **`source_url`** <code>string</code> optional  
- **`title`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`media_type`** <code>string</code> optional  
- **`mime_type`** <code>string</code> optional

### WordPressDataTerm  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required  
- **`link`** <code>string</code> optional  
- **`name`** <code>string</code> optional  
- **`slug`** <code>string</code> optional  
- **`taxonomy`** <code>string</code> optional

### WordPressDataEmbedded  

**Type:** <code>object</code>

#### Properties  
- **`author`** <code><a href="#wordpressdataauthor">WordPressDataAuthor</a>[]</code> optional  
- **`up`** <code><a href="#wordpressdataparent">WordPressDataParent</a>[]</code> optional  
- **`'wp:featuredmedia'`** <code><a href="#wordpressdatafeaturedmedia">WordPressDataFeaturedMedia</a>[]</code> optional  
- **`'wp:attachment'`** <code><a href="#wordpressdataattachment">WordPressDataAttachment</a>[]</code> optional  
- **`'wp:term'`** <code>Array&lt;<a href="#wordpressdataterm">WordPressDataTerm</a>&gt;[]</code> optional

### WordPressDataItem  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> optional  
- **`date`** <code>string</code> optional  
- **`date_gmt`** <code>string</code> optional  
- **`guid`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`modified`** <code>string</code> optional  
- **`modified_gmt`** <code>string</code> optional  
- **`slug`** <code>string</code> optional  
- **`status`** <code><a href="#wordpressdatastatus">WordPressDataStatus</a></code> optional  
- **`type`** <code>string</code> optional  
- **`link`** <code>string</code> optional  
- **`title`** <code><a href="#wordpressdatarendered">WordPressDataRendered</a></code> optional  
- **`content`** <code><a href="#wordpressdatarenderedprotected">WordPressDataRenderedProtected</a></code> optional  
- **`excerpt`** <code><a href="#wordpressdatarenderedprotected">WordPressDataRenderedProtected</a></code> optional  
- **`author`** <code>number</code> optional  
- **`featured_media`** <code>number</code> optional  
- **`parent`** <code>number</code> optional  
- **`menu_order`** <code>number</code> optional  
- **`comment_status`** <code>string</code> optional  
- **`ping_status`** <code>string</code> optional  
- **`sticky`** <code>boolean</code> optional  
- **`template`** <code>string</code> optional  
- **`format`** <code>string</code> optional  
- **`meta`** <code><a href="#wordpressdatameta">WordPressDataMeta</a></code> optional  
- **`categories`** <code>number[]</code> optional  
- **`tags`** <code>number[]</code> optional  
- **`class_list`** <code>string[]</code> optional  
- **`taxonomy`** <code>string</code> optional  
- **`string`** <code>string</code> optional  
- **`_links`** <code><a href="#wordpressdatalinks">WordPressDataLinks</a></code> optional  
- **`_embedded`** <code><a href="#wordpressdataembedded">WordPressDataEmbedded</a></code> optional

### WordPressDataParams  

**Type:** <code>Object&lt;string, (string|number|boolean)&gt;</code>

### WordPressDataArgs  

**Type:** <code>object</code>

#### Properties  
- **`key`** <code>string</code> required  
- **`route`** <code>string</code> required  
- **`params`** <code><a href="#wordpressdataparams">WordPressDataParams</a></code> optional  
- **`fetcher`** <code>fetch</code> optional  
- **`options`** <code>RequestInit</code> optional

### AllWordPressDataArgs  

**Type:** <code>object</code>

#### Properties  
- **`serverlessData`** <code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a></code> optional