# Contentful

## normalizeContentfulData  

**<code>normalizeContentfulData(data: ContentfulDataItem[]): RenderItem[]</code>**  

Transform Contentful data into simpler objects.

### Parameters  
- **`data`** <code><a href="#contentfuldataitem">ContentfulDataItem</a>[]</code> required

### Returns  

<code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code>

## getContentfulData  

**<code>getContentfulData(key: string, params?: ContentfulDataParams): Promise&lt;RenderData&gt;</code>**  

Fetch data from Contentful CMS or cache.

### Parameters  
- **`key`** <code>string</code> required  
- **`params`** <code><a href="#contentfuldataparams">ContentfulDataParams</a></code> optional

### Returns  

<code>Promise&lt;<a href="/src/render/README.md#renderdata">RenderData</a>&gt;</code>

## getAllContentfulData  

**<code>getAllContentfulData(args?: AllContentfulDataArgs): Promise&lt;(RenderAllData|undefined)&gt;</code>**  

Fetch data from all content types or single entry if serverless.

### Parameters  
- **`args`** <code><a href="#allcontentfuldataargs">AllContentfulDataArgs</a></code> optional

### Returns  

<code>Promise&lt;(<a href="/src/render/README.md#renderalldata">RenderAllData</a>|undefined)&gt;</code>

## Types

### ContentfulDataMark  

**Type:** <code>object</code>

#### Properties  
- **`type`** <code>string</code> required

### ContentfulDataDatum  

**Type:** <code>object</code>

#### Properties  
- **`uri`** <code>string</code> optional  
- **`target`** <code><a href="#contentfuldataitem">ContentfulDataItem</a></code> optional

### ContentfulDataId  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> optional

### ContentfulDataTag  

**Type:** <code>object</code>

#### Properties  
- **`sys`** <code><a href="#contentfuldataid">ContentfulDataId</a></code> optional

### ContentfulDataMeta  

**Type:** <code>object</code>

#### Properties  
- **`tags`** <code><a href="#contentfuldatatag">ContentfulDataTag</a>[]</code> optional

### ContentfulDataSysType  

**Type:** <code>object</code>

#### Properties  
- **`sys`** <code><a href="#contentfuldataid">ContentfulDataId</a></code> optional

### ContentfulDataSys  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> optional  
- **`type`** <code>string</code> optional  
- **`locale`** <code>string</code> optional  
- **`contentType`** <code><a href="#contentfuldatasystype">ContentfulDataSysType</a></code> optional

### ContentfulDataFileImage  

**Type:** <code>object</code>

#### Properties  
- **`width`** <code>number</code> optional  
- **`height`** <code>number</code> optional

### ContentfulDataFileDetails  

**Type:** <code>object</code>

#### Properties  
- **`size`** <code>number</code> optional  
- **`image`** <code><a href="#contentfuldatafileimage">ContentfulDataFileImage</a></code> optional

### ContentfulDataFile  

**Type:** <code>object</code>

#### Properties  
- **`url`** <code>string</code> optional  
- **`contentType`** <code>string</code> optional  
- **`fileName`** <code>string</code> optional  
- **`details`** <code><a href="#contentfuldatafiledetails">ContentfulDataFileDetails</a></code> optional

### ContentfulDataFields  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`content`** <code><a href="#contentfuldataitem">ContentfulDataItem</a>[] | <a href="#contentfuldataitem">ContentfulDataItem</a></code> optional  
- **`file`** <code><a href="#contentfuldatafile">ContentfulDataFile</a></code> optional  
- **`internalLink`** <code><a href="#contentfuldataitem">ContentfulDataItem</a></code> optional  
- **`description`** <code>string</code> optional  
- **`title`** <code>string</code> optional

### ContentfulDataItem  

**Type:** <code>object</code>

#### Properties  
- **`value`** <code>string</code> optional  
- **`nodeType`** <code>string</code> optional  
- **`marks`** <code><a href="#contentfuldatamark">ContentfulDataMark</a>[]</code> optional  
- **`data`** <code><a href="#contentfuldatadatum">ContentfulDataDatum</a></code> optional  
- **`content`** <code><a href="#contentfuldataitem">ContentfulDataItem</a>[] | string</code> optional  
- **`metadata`** <code><a href="#contentfuldatameta">ContentfulDataMeta</a></code> optional  
- **`sys`** <code><a href="#contentfuldatasys">ContentfulDataSys</a></code> optional  
- **`fields`** <code><a href="#contentfuldatafields">ContentfulDataFields</a></code> optional

### ContentfulDataParams  

**Type:** <code>Object&lt;string, (string|number|boolean)&gt;</code>

### AllContentfulDataArgs  

**Type:** <code>object</code>

#### Properties  
- **`serverlessData`** <code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a></code> optional