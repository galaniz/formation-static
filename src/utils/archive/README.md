# Archive

## isTerm  

**<code>isTerm(contentType: string, itemData: RenderItem): boolean</code>**  

Check if item is given term.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> required

### Returns  

<code>boolean</code>

## isArchive  

**<code>isArchive(contentType: string, itemData: RenderItem): boolean</code>**  

Check if item is given archive or term.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> required

### Returns  

<code>boolean</code>

## getArchiveMeta  

**<code>getArchiveMeta(contentType: string, locale?: string): ArchiveMeta</code>**  

Archive meta by content type and locale.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`locale`** <code>string</code> optional

### Returns  

<code><a href="#archivemeta">ArchiveMeta</a></code>

## getArchiveInfo  

**<code>getArchiveInfo(contentType: string, locale?: string): ArchiveInfo</code>**  

Archive ID, slug and title.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`locale`** <code>string</code> optional

### Returns  

<code><a href="#archiveinfo">ArchiveInfo</a></code>

## getTaxonomyInfo  

**<code>getTaxonomyInfo(contentType: string, itemData?: RenderItem): ArchiveTaxonomy</code>**  

Taxonomy attributes.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional

### Returns  

<code><a href="#archivetaxonomy">ArchiveTaxonomy</a></code>

## getArchiveLink  

**<code>getArchiveLink(contentType: string, itemData?: RenderItem): ArchiveLink</code>**  

Archive link by content type or taxonomy.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional

### Returns  

<code><a href="#archivelink">ArchiveLink</a></code>

## getArchiveLabel  

**<code>getArchiveLabel(contentType: string, itemData?: RenderItem, labelType?: string, fallback?: string): string</code>**  

Localized archive label.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional  
- **`labelType`** <code>string</code> optional  
Default: `'singular'`  
- **`fallback`** <code>string</code> optional

### Returns  

<code>string</code>

## getArchiveLabels  

**<code>getArchiveLabels(contentType: string, itemData?: RenderItem): ArchiveLabels</code>**  

Singular and plural labels by content/taxonomy type.

### Parameters  
- **`contentType`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional

### Returns  

<code><a href="#archivelabels">ArchiveLabels</a></code>

## Types

### ArchiveMeta  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> optional  
- **`slug`** <code>string</code> optional  
- **`title`** <code>string</code> optional  
- **`singular`** <code>string</code> optional  
- **`plural`** <code>string</code> optional  
- **`contentType`** <code>string</code> optional  
- **`layout`** <code>string</code> optional  
- **`order`** <code>string</code> optional  
- **`display`** <code>number</code> optional

### ArchiveInfo  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required  
- **`slug`** <code>string</code> required  
- **`title`** <code>string</code> required  
- **`contentType`** <code>string</code> required

### ArchiveTaxonomy  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#taxonomy">Taxonomy</a></code>

#### Properties  
- **`primaryContentType`** <code>string</code> required

### ArchiveLink  

**Type:** <code>object</code>

#### Properties  
- **`title`** <code>string</code> required  
- **`link`** <code>string</code> required

### ArchiveLabels  

**Type:** <code>object</code>

#### Properties  
- **`singular`** <code>string</code> required  
- **`plural`** <code>string</code> required