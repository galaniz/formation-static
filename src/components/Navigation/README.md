# Navigation  

Handles navigation data and recursively generating output.

## Constructor  

**<code>new Navigation(props: NavigationProps): Navigation</code>**  

Create new instance with given props.

### Parameters  
- **`props`** <code><a href="#navigationprops">NavigationProps</a></code> required

## Properties

### navigations  

All navigations.  

**Type:** <code><a href="#navigationlist">NavigationList</a>[]</code>

### items  

All navigation items.  

**Type:** <code><a href="#navigationitem">NavigationItem</a>[]</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

## Methods

### getOutput  

**<code>getOutput(location: string, args?: NavigationOutputArgs, maxDepth?: number): string</code>**  

Navigation HTML output.

#### Parameters  
- **`location`** <code>string</code> required  
- **`args`** <code><a href="#navigationoutputargs">NavigationOutputArgs</a></code> optional  
- **`maxDepth`** <code>number</code> optional

#### Returns  

<code>string</code> HTMLUListElement

### getItemsById  

**<code>getItemsById(): NavigationItemsById</code>**  

Items stored by ID.

#### Returns  

<code><a href="#navigationitemsbyid">NavigationItemsById</a></code>

### getNavigationsByLocation  

**<code>getNavigationsByLocation(): NavigationByLocation</code>**  

All navigations stored by location.

#### Returns  

<code><a href="#navigationbylocation">NavigationByLocation</a></code>

### getNavigationByLocation  

**<code>getNavigationByLocation(location: string): NavigationByLocationItem | undefined</code>**  

Single navigation by location.

#### Parameters  
- **`location`** <code>string</code> required

#### Returns  

<code><a href="#navigationbylocationitem">NavigationByLocationItem</a> | undefined</code>

## Types

### NavigationItem  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`id`** <code>string</code> required  
- **`title`** <code>string</code> required  
- **`link`** <code>string</code> optional  
- **`internalLink`** <code><a href="/src/global/README.md#internallink">InternalLink</a></code> optional  
- **`externalLink`** <code>string</code> optional  
- **`children`** <code><a href="#navigationitem">NavigationItem</a>[]</code> optional  
- **`current`** <code>boolean</code> optional  
- **`external`** <code>boolean</code> optional  
- **`descendentCurrent`** <code>boolean</code> optional  
- **`archiveCurrent`** <code>boolean</code> optional

### NavigationList  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`title`** <code>string</code> required  
- **`location`** <code>string | string[]</code> required  
- **`items`** <code><a href="#navigationitem">NavigationItem</a>[]</code> required

### NavigationProps  

**Type:** <code>object</code>

#### Properties  
- **`navigations`** <code><a href="#navigationlist">NavigationList</a>[]</code> required  
- **`items`** <code><a href="#navigationitem">NavigationItem</a>[]</code> required  
- **`currentLink`** <code>string</code> optional  
- **`currentType`** <code>string | string[]</code> optional

### NavigationOutputBaseArgs  

**Type:** <code>object</code>

#### Properties  
- **`listClass`** <code>string</code> optional  
- **`listAttr`** <code>string</code> optional  
- **`itemClass`** <code>string</code> optional  
- **`itemAttr`** <code>string</code> optional  
- **`linkClass`** <code>string</code> optional  
- **`internalLinkClass`** <code>string</code> optional  
- **`linkAttr`** <code>string</code> optional  
- **`depthAttr`** <code>boolean</code> optional  
Default: `false`  
- **`dataAttr`** <code>string</code> optional  
Default: `'data-nav'`

### NavigationOutputListFilterArgs  

**Type:** <code>object</code>

#### Properties  
- **`args`** <code><a href="#navigationoutputargs">NavigationOutputArgs</a></code> required  
- **`output`** <code><a href="/src/global/README.md#refstring">RefString</a></code> required  
- **`items`** <code><a href="#navigationitem">NavigationItem</a>[]</code> required  
- **`depth`** <code>number</code> required

### NavigationOutputListFilter  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#navigationoutputlistfilterargs">NavigationOutputListFilterArgs</a></code> required

#### Returns  

<code>void</code>

### NavigationOutputFilterArgs  

**Type:** <code>object</code>

#### Properties  
- **`args`** <code><a href="#navigationoutputargs">NavigationOutputArgs</a></code> required  
- **`item`** <code><a href="#navigationitem">NavigationItem</a></code> required  
- **`output`** <code><a href="/src/global/README.md#refstring">RefString</a></code> required  
- **`index`** <code>number</code> required  
- **`items`** <code><a href="#navigationitem">NavigationItem</a>[]</code> required  
- **`depth`** <code>number</code> required

### NavigationFilter  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#navigationoutputfilterargs">NavigationOutputFilterArgs</a></code> required

#### Returns  

<code>void</code>

### NavigationOutputArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="#navigationoutputbaseargs">NavigationOutputBaseArgs</a></code>

#### Properties  
- **`currentLink`** <code>string</code> optional  
Current link to compare against.  
- **`currentType`** <code>string[]</code> optional  
Current content type(s) to compare against.  
- **`listTag`** <code>string</code> optional  
- **`itemTag`** <code>string</code> optional  
- **`filterBeforeList`** <code><a href="#navigationoutputlistfilter">NavigationOutputListFilter</a></code> optional  
- **`filterAfterList`** <code><a href="#navigationoutputlistfilter">NavigationOutputListFilter</a></code> optional  
- **`filterBeforeItem`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional  
- **`filterAfterItem`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional  
- **`filterBeforeLink`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional  
- **`filterAfterLink`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional  
- **`filterBeforeLinkText`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional  
- **`filterAfterLinkText`** <code><a href="#navigationfilter">NavigationFilter</a></code> optional

### NavigationItemsById  

**Type:** <code>Map&lt;string, <a href="#navigationitem">NavigationItem</a>&gt;</code>

### NavigationByLocation  

**Type:** <code>Map&lt;string, NavigationInfo&gt;</code>

### NavigationByLocationItem  

**Type:** <code>object</code>

#### Properties  
- **`title`** <code>string</code> required  
- **`items`** <code><a href="#navigationitem">NavigationItem</a>[]</code> required