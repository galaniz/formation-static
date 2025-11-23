# Store

## storeDir  

Directory to write store files to.  

**Type:** <code>string</code>

## defaultStore  

Default store object.  

**Type:** <code><a href="#store">Store</a></code>

## store  

Store options.  

**Type:** <code><a href="#store">Store</a></code>

## createStoreFiles  

**<code>createStoreFiles(): Promise&lt;void&gt;</code>**  

Create files from store object.

### Returns  

<code>Promise&lt;void&gt;</code>

## setStore  

**<code>setStore(args: Store, dir?: string): Store</code>**  

Update default store with user options.

### Parameters  
- **`args`** <code><a href="#store">Store</a></code> required  
- **`dir`** <code>string</code> optional  
Default: `lib/store`

### Returns  

<code><a href="#store">Store</a></code>

## setStoreItem  

**<code>setStoreItem(prop: string, value: object, subProp?: string): boolean</code>**  

Update individual store property.

### Parameters  
- **`prop`** <code>string</code> required  
- **`value`** <code>object</code> required  
- **`subProp`** <code>string</code> optional

### Returns  

<code>boolean</code>

## setStoreData  

**<code>setStoreData(allData: RenderAllData): boolean</code>**  

Build time data (navigations, archive meta, parents).

### Parameters  
- **`allData`** <code><a href="/src/render/README.md#renderalldata">RenderAllData</a></code> required

### Returns  

<code>boolean</code>

## getStoreItem  

**<code>getStoreItem(prop: string): object</code>**  

Individual store property.

### Parameters  
- **`prop`** <code>string</code> required

### Returns  

<code>object</code>

## Types

### StoreSlugs  

Expect ID, contentType and optional locale in array.  

**Type:** <code>Object&lt;string, string&gt;[]</code>

### StoreParents  

Expect ID, slug and title in array.  

**Type:** <code>Object&lt;string, Object&lt;string, string&gt;&gt;[]</code>

### StoreArchiveMeta  

**Type:** <code>Object&lt;string, (<a href="/src/utils/archive/README.md#archivemeta">ArchiveMeta</a>|Object&lt;string, <a href="/src/utils/archive/README.md#archivemeta">ArchiveMeta</a>&gt;)&gt;</code>

### StoreFormMeta  

**Type:** <code>Object&lt;string, <a href="/src/objects/Form/README.md#formmeta">FormMeta</a>&gt;</code>

### StoreImageMeta  

**Type:** <code>Object&lt;string, <a href="/src/utils/image/README.md#imageprops">ImageProps</a>&gt;</code>

### StoreTaxonomies  

**Type:** <code>Object&lt;string, <a href="/src/global/README.md#taxonomy">Taxonomy</a>&gt;</code>

### StorePrimitiveGeneric  

**Type:** <code>Object&lt;string, <a href="#storeprimitive">StorePrimitive</a>&gt;</code>

### StorePrimitive  

**Type:** <code>string | number | boolean | null | undefined | <a href="#storeprimitive">StorePrimitive</a>[] | <a href="#storeprimitivegeneric">StorePrimitiveGeneric</a></code>

### StoreServerless  

**Type:** <code>Object&lt;string, <a href="#storeprimitive">StorePrimitive</a>&gt;[]</code>

### Store  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`slugs`** <code><a href="#storeslugs">StoreSlugs</a></code> required  
- **`parents`** <code><a href="#storeparents">StoreParents</a></code> required  
- **`archiveMeta`** <code><a href="#storearchivemeta">StoreArchiveMeta</a></code> required  
- **`formMeta`** <code><a href="#storeformmeta">StoreFormMeta</a></code> required  
- **`imageMeta`** <code><a href="#storeimagemeta">StoreImageMeta</a></code> required  
- **`navigations`** <code><a href="/src/components/Navigation/README.md#navigationlist">NavigationList</a>[]</code> required  
- **`navigationItems`** <code><a href="/src/components/Navigation/README.md#navigationitem">NavigationItem</a>[]</code> required  
- **`taxonomies`** <code><a href="#storetaxonomies">StoreTaxonomies</a></code> required  
- **`serverless`** <code><a href="#storeserverless">StoreServerless</a></code> required