# Image

## getRemoteImages  

**<code>getRemoteImages(images: ImageRemote[]): Promise&lt;string&gt;[]</code>**  

Download remote images to local images directory.

### Parameters  
- **`images`** <code><a href="#imageremote">ImageRemote</a>[]</code> required

### Returns  

<code>Promise&lt;string&gt;[]</code>

## setLocalImages  

**<code>setLocalImages(): Promise&lt;sharp.OutputInfo&gt;[]</code>**  

Transform local images (quality and sizes).

### Returns  

<code>Promise&lt;sharp.OutputInfo&gt;[]</code>

## getImage  

**<code>getImage(args: ImageArgs, returnDetails?: boolean): ImageReturnType</code>**  

Responsive image output.

### Parameters  
- **`args`** <code><a href="#imageargs">ImageArgs</a></code> required  
- **`returnDetails`** <code>boolean</code> optional  
Default: `false`

### Returns  

<code><a href="#imagereturntype">ImageReturnType</a></code>

## getImageClosestSize  

**<code>getImageClosestSize(size: number, sizes?: number[]): number</code>**  

Closest value in config sizes.

### Parameters  
- **`size`** <code>number</code> required  
- **`sizes`** <code>number[]</code> optional

### Returns  

<code>number</code>

## getImageSizes  

**<code>getImageSizes(args: ImageSizesArgs): ImageSizesReturn</code>**  

Calculate sizes from column and container parents.

### Parameters  
- **`args`** <code><a href="#imagesizesargs">ImageSizesArgs</a></code> required

### Returns  

<code><a href="#imagesizesreturn">ImageSizesReturn</a></code>

## Types

### ImageRemote  

**Type:** <code>object</code>

#### Properties  
- **`path`** <code>string</code> required  
- **`url`** <code>string</code> required  
- **`format`** <code>string</code> optional

### ImageArgs  

**Type:** <code>object</code>

#### Properties  
- **`data`** <code><a href="/src/render/README.md#renderfile">RenderFile</a></code> optional  
- **`classes`** <code>string</code> optional  
- **`attr`** <code>string</code> optional  
- **`alt`** <code>string</code> optional  
Default: `'inherit'`  
- **`width`** <code>string | number</code> optional  
Default: `'auto'`  
- **`height`** <code>string | number</code> optional  
Default: `'auto'`  
- **`lazy`** <code>boolean</code> optional  
Default: `true`  
- **`picture`** <code>boolean</code> optional  
Default: `false`  
- **`quality`** <code>number</code> optional  
Default: `75`  
- **`source`** <code><a href="/src/global/README.md#source">Source</a> | &#39;remote&#39;</code> optional  
- **`maxWidth`** <code>number</code> optional  
Default: `1200`  
- **`viewportWidth`** <code>number</code> optional  
Default: `100`  
- **`sizes`** <code>string</code> optional  
- **`format`** <code>string</code> optional  
Default: `'webp'`  
- **`params`** <code>Record&lt;string, string&gt;</code> optional  
Default: `{fm: '%format', q: '%quality', w: '%width', h: '%height'}`

### ImageReturn  

**Type:** <code>object</code>

#### Properties  
- **`output`** <code>string</code> required  
- **`src`** <code>string</code> required  
- **`srcFallback`** <code>string</code> required  
- **`srcset`** <code>string[]</code> required  
- **`sizes`** <code>string</code> required  
- **`aspectRatio`** <code>number</code> required  
- **`naturalWidth`** <code>number</code> required  
- **`naturalHeight`** <code>number</code> required

### ImageReturnType  

**Type:** <code><a href="#imagereturn">ImageReturn</a> | string</code>

### ImageSizesParents  

**Type:** <code><a href="/src/global/README.md#parentargs">ParentArgs</a> | <a href="/src/layouts/Column/README.md#columnprops">ColumnProps</a> | <a href="/src/layouts/Container/README.md#containerprops">ContainerProps</a></code>

### ImageSizesArgs  

**Type:** <code>object</code>

#### Properties  
- **`parents`** <code><a href="#imagesizesparents">ImageSizesParents</a>[]</code> required  
- **`widths`** <code><a href="/src/global/README.md#genericnumbers">GenericNumbers</a></code> required  
- **`maxWidths`** <code><a href="/src/global/README.md#genericnumbers">GenericNumbers</a></code> required  
- **`breakpoints`** <code>number[]</code> required  
- **`source`** <code><a href="/src/global/README.md#source">Source</a></code> optional  
- **`viewportWidth`** <code>number</code> optional  
Default: `100`  
- **`maxWidth`** <code>number</code> optional

### ImageSizesReturn  

**Type:** <code>object</code>

#### Properties  
- **`maxWidth`** <code>number</code> required  
- **`sizes`** <code>string</code> required