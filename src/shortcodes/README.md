# Shortcodes

## shortcodes  

Shortcode callbacks by name.  

**Type:** <code><a href="#shortcodes">Shortcodes</a></code>

## addShortcode  

**<code>addShortcode(name: string, shortcode: Shortcode): boolean</code>**  

Add shortcode to shortcodes map.

### Parameters  
- **`name`** <code>string</code> required  
- **`shortcode`** <code><a href="#shortcode">Shortcode</a></code> required

### Returns  

<code>boolean</code>

## removeShortcode  

**<code>removeShortcode(name: string): boolean</code>**  

Remove shortcode from shortcodes map.

### Parameters  
- **`name`** <code>string</code> required

### Returns  

<code>boolean</code>

## doShortcodes  

**<code>doShortcodes(content: string, itemData?: RenderItem): Promise&lt;string&gt;</code>**  

Transform content string with shortcode callbacks.

### Parameters  
- **`content`** <code>string</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional

### Returns  

<code>Promise&lt;string&gt;</code>

## resetShortcodes  

**<code>resetShortcodes(): void</code>**  

Empty shortcodes map.

### Returns  

<code>void</code>

## setShortcodes  

**<code>setShortcodes(args: ShortcodesSet): boolean</code>**  

Fill shortcodes map.

### Parameters  
- **`args`** <code><a href="#shortcodesset">ShortcodesSet</a></code> required

### Returns  

<code>boolean</code>

## stripShortcodes  

**<code>stripShortcodes(content: string): string</code>**  

Remove shortcodes from string.

### Parameters  
- **`content`** <code>string</code> required

### Returns  

<code>string</code>

## Types

### ShortcodeData  

**Type:** <code>object</code>

#### Properties  
- **`name`** <code>string</code> required  
- **`replaceContent`** <code>string</code> required  
- **`content`** <code>string</code> required  
- **`attr`** <code>ShortcodeAtts</code> required  
- **`children`** <code><a href="#shortcodedata">ShortcodeData</a>[]</code> required  
- **`itemData`** <code><a href="/src/render/README.md#renderitem">RenderItem</a></code> optional

### ShortcodeCallback  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#shortcodedata">ShortcodeData</a></code> required

#### Returns  

<code>string | Promise&lt;string&gt;</code>

### ShortcodeAttrTypes  

**Type:** <code>Object&lt;string, (&#39;string&#39;|&#39;number&#39;|&#39;boolean&#39;)&gt;</code>

### Shortcode  

**Type:** <code>object</code>

#### Properties  
- **`callback`** <code><a href="#shortcodecallback">ShortcodeCallback</a></code> required  
- **`attrTypes`** <code><a href="#shortcodeattrtypes">ShortcodeAttrTypes</a></code> optional  
- **`child`** <code>string</code> optional

### Shortcodes  

**Type:** <code>Map&lt;string, <a href="#shortcode">Shortcode</a>&gt;</code>

### ShortcodesSet  

**Type:** <code>Object&lt;string, <a href="#shortcode">Shortcode</a>&gt;</code>