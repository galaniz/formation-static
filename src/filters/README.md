# Filters

## filters  

Filter callbacks by name.  

**Type:** <code><a href="#filtermap">FilterMap</a></code>

## addFilter  

**<code>addFilter(name: string, filter: GenericFunction): boolean</code>**  

Add filter to filters map.

### Parameters  
- **`name`** <code>string</code> required  
- **`filter`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## removeFilter  

**<code>removeFilter(name: string, filter: GenericFunction): boolean</code>**  

Remove filter from filters map.

### Parameters  
- **`name`** <code>string</code> required  
- **`filter`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## applyFilters  

**<code>applyFilters(name: string, value: &ast;, args?: &ast;, isAsync?: boolean): &ast;</code>**  

Update value from callback return values.

### Parameters  
- **`name`** <code>string</code> required  
- **`value`** <code>&ast;</code> required  
- **`args`** <code>&ast;</code> optional  
- **`isAsync`** <code>boolean</code> optional  
Default: `false`

### Returns  

<code>&ast;</code>

## resetFilters  

**<code>resetFilters(): void</code>**  

Empty filters map.

### Returns  

<code>void</code>

## setFilters  

**<code>setFilters(args: Filters): boolean</code>**  

Fill filters map.

### Parameters  
- **`args`** <code><a href="#filters">Filters</a></code> required

### Returns  

<code>boolean</code>

## Types

### CacheData  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderdata">RenderData</a></code>

#### Properties  
- **`data`** <code>Object&lt;string, <a href="/src/render/README.md#renderitem">RenderItem</a>&gt;</code> optional

### CacheDataFilterArgs  

**Type:** <code>object</code>

#### Properties  
- **`key`** <code>string</code> required  
- **`type`** <code>string</code> required  
- **`data`** <code><a href="#cachedata">CacheData</a></code> optional

### CacheDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`data`** <code><a href="#cachedata">CacheData</a></code> required  
- **`args`** <code><a href="#cachedatafilterargs">CacheDataFilterArgs</a></code> required

#### Returns  

<code>Promise&lt;(<a href="#cachedata">CacheData</a>|undefined)&gt;</code>

### StoreDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`data`** <code>object | undefined</code> required  
- **`type`** <code>string</code> required

#### Returns  

<code>Promise&lt;(object|undefined)&gt;</code>

### DataFilterArgs  

**Type:** <code>object</code>

#### Properties  
- **`serverlessData`** <code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a></code> optional  
- **`contentType`** <code>string</code> optional

### ContentfulDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`data`** <code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code> required  
- **`args`** <code><a href="#datafilterargs">DataFilterArgs</a></code> required

#### Returns  

<code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code>

### WordpressDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`data`** <code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code> required  
- **`args`** <code><a href="#datafilterargs">DataFilterArgs</a></code> required

#### Returns  

<code><a href="/src/render/README.md#renderitem">RenderItem</a>[]</code>

### LocalDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`data`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> required

#### Returns  

<code><a href="/src/render/README.md#renderitem">RenderItem</a></code>

### AllDataFilterArgs  

**Type:** <code>object</code>

#### Properties  
- **`type`** <code>string</code> required  
- **`serverlessData`** <code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a></code> optional

### AllDataFilter  

**Type:** <code>function</code>

#### Parameters  
- **`allData`** <code><a href="/src/render/README.md#renderalldata">RenderAllData</a></code> required  
- **`args`** <code><a href="#alldatafilterargs">AllDataFilterArgs</a></code> required

#### Returns  

<code><a href="/src/render/README.md#renderalldata">RenderAllData</a></code>

### FilterMap  

**Type:** <code>Map&lt;string, Set&lt;<a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;&gt;</code>

#### Properties  
- **`columnProps`** <code>Set&lt;<a href="/src/layouts/Column/README.md#columnpropsfilter">ColumnPropsFilter</a>&gt;</code> required  
- **`containerProps`** <code>Set&lt;<a href="/src/layouts/Container/README.md#containerpropsfilter">ContainerPropsFilter</a>&gt;</code> required  
- **`formOptionProps`** <code>Set&lt;<a href="/src/objects/Form/README.md#formoptionpropsfilter">FormOptionPropsFilter</a>&gt;</code> required  
- **`formFieldProps`** <code>Set&lt;<a href="/src/objects/Form/README.md#formfieldpropsfilter">FormFieldPropsFilter</a>&gt;</code> required  
- **`formProps`** <code>Set&lt;<a href="/src/objects/Form/README.md#formpropsfilter">FormPropsFilter</a>&gt;</code> required  
- **`richTextProps`** <code>Set&lt;<a href="/src/text/RichText/README.md#richtextpropsfilter">RichTextPropsFilter</a>&gt;</code> required  
- **`richTextOutput`** <code>Set&lt;<a href="/src/text/RichText/README.md#richtextoutputfilter">RichTextOutputFilter</a>&gt;</code> required  
- **`richTextContentItem`** <code>Set&lt;<a href="/src/text/RichText/README.md#richtextcontentitemfilter">RichTextContentItemFilter</a>&gt;</code> required  
- **`richTextContent`** <code>Set&lt;<a href="/src/text/RichText/README.md#richtextcontentfilter">RichTextContentFilter</a>&gt;</code> required  
- **`richTextContentOutput`** <code>Set&lt;<a href="/src/text/RichText/README.md#richtextcontentoutputfilter">RichTextContentOutputFilter</a>&gt;</code> required  
- **`renderItem`** <code>Set&lt;<a href="/src/render/README.md#renderitemfilter">RenderItemFilter</a>&gt;</code> required  
- **`renderItemData`** <code>Set&lt;<a href="/src/render/README.md#renderitemdatafilter">RenderItemDataFilter</a>&gt;</code> required  
- **`renderContent`** <code>Set&lt;<a href="/src/render/README.md#rendercontentfilter">RenderContentFilter</a>&gt;</code> required  
- **`serverlessResult`** <code>Set&lt;<a href="/src/serverless/README.md#serverlessresultfilter">ServerlessResultFilter</a>&gt;</code> required  
- **`contactResult`** <code>Set&lt;<a href="/src/serverless/Contact/README.md#contactresultfilter">ContactResultFilter</a>&gt;</code> required  
- **`cacheData`** <code>Set&lt;<a href="#cachedatafilter">CacheDataFilter</a>&gt;</code> required  
- **`storeData`** <code>Set&lt;<a href="#storedatafilter">StoreDataFilter</a>&gt;</code> required  
- **`contentfulData`** <code>Set&lt;<a href="#contentfuldatafilter">ContentfulDataFilter</a>&gt;</code> required  
- **`wordpressData`** <code>Set&lt;<a href="#wordpressdatafilter">WordpressDataFilter</a>&gt;</code> required  
- **`localData`** <code>Set&lt;<a href="#localdatafilter">LocalDataFilter</a>&gt;</code> required  
- **`allData`** <code>Set&lt;<a href="#alldatafilter">AllDataFilter</a>&gt;</code> required  
- **`slugParts`** <code>Set&lt;<a href="/src/utils/link/README.md#linkslugpartsfilter">LinkSlugPartsFilter</a>&gt;</code> required  
- **`slug`** <code>Set&lt;<a href="/src/utils/link/README.md#linkslugfilter">LinkSlugFilter</a>&gt;</code> required

### Filters  

**Type:** <code>Object&lt;string, <a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;</code>

#### Properties  
- **`columnProps`** <code><a href="/src/layouts/Column/README.md#columnpropsfilter">ColumnPropsFilter</a></code> required  
- **`containerProps`** <code><a href="/src/layouts/Container/README.md#containerpropsfilter">ContainerPropsFilter</a></code> required  
- **`formOptionProps`** <code><a href="/src/objects/Form/README.md#formoptionpropsfilter">FormOptionPropsFilter</a></code> required  
- **`formFieldProps`** <code><a href="/src/objects/Form/README.md#formfieldpropsfilter">FormFieldPropsFilter</a></code> required  
- **`formProps`** <code><a href="/src/objects/Form/README.md#formpropsfilter">FormPropsFilter</a></code> required  
- **`richTextProps`** <code><a href="/src/text/RichText/README.md#richtextpropsfilter">RichTextPropsFilter</a></code> required  
- **`richTextOutput`** <code><a href="/src/text/RichText/README.md#richtextoutputfilter">RichTextOutputFilter</a></code> required  
- **`richTextContent`** <code><a href="/src/text/RichText/README.md#richtextcontentfilter">RichTextContentFilter</a></code> required  
- **`richTextContentItem`** <code><a href="/src/text/RichText/README.md#richtextcontentitemfilter">RichTextContentItemFilter</a></code> required  
- **`richTextContentOutput`** <code><a href="/src/text/RichText/README.md#richtextcontentoutputfilter">RichTextContentOutputFilter</a></code> required  
- **`renderItem`** <code><a href="/src/render/README.md#renderitemfilter">RenderItemFilter</a></code> required  
- **`renderItemData`** <code><a href="/src/render/README.md#renderitemdatafilter">RenderItemDataFilter</a></code> required  
- **`renderContent`** <code><a href="/src/render/README.md#rendercontentfilter">RenderContentFilter</a></code> required  
- **`serverlessResult`** <code><a href="/src/serverless/README.md#serverlessresultfilter">ServerlessResultFilter</a></code> required  
- **`contactResult`** <code><a href="/src/serverless/Contact/README.md#contactresultfilter">ContactResultFilter</a></code> required  
- **`cacheData`** <code><a href="#cachedatafilter">CacheDataFilter</a></code> required  
- **`storeData`** <code><a href="#storedatafilter">StoreDataFilter</a></code> required  
- **`contentfulData`** <code><a href="#contentfuldatafilter">ContentfulDataFilter</a></code> required  
- **`wordpressData`** <code><a href="#wordpressdatafilter">WordpressDataFilter</a></code> required  
- **`localData`** <code><a href="#localdatafilter">LocalDataFilter</a></code> required  
- **`allData`** <code><a href="#alldatafilter">AllDataFilter</a></code> required  
- **`slugParts`** <code><a href="/src/utils/link/README.md#linkslugpartsfilter">LinkSlugPartsFilter</a></code> required  
- **`slug`** <code><a href="/src/utils/link/README.md#linkslugfilter">LinkSlugFilter</a></code> required