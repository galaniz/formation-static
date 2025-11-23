# Scripts

## scripts  

Scripts data per render item.  

**Type:** <code><a href="#scripts">Scripts</a></code>

## styles  

Styles data per render item.  

**Type:** <code><a href="#styles">Styles</a></code>

## addScript  

**<code>addScript(path: string, deps?: string[], priority?: ScriptsPriority): boolean</code>**  

Add script path and dependencies to item and build maps.

### Parameters  
- **`path`** <code>string</code> required  
- **`deps`** <code>string[]</code> optional  
- **`priority`** <code><a href="#scriptspriority">ScriptsPriority</a></code> optional

### Returns  

<code>boolean</code>

## addStyle  

**<code>addStyle(path: string, deps?: string[], priority?: ScriptsPriority): boolean</code>**  

Add style path and dependencies to item and build maps.

### Parameters  
- **`path`** <code>string</code> required  
- **`deps`** <code>string[]</code> optional  
- **`priority`** <code><a href="#scriptspriority">ScriptsPriority</a></code> optional

### Returns  

<code>boolean</code>

## outputScripts  

**<code>outputScripts(link: string): string</code>**  

Output script elements.

### Parameters  
- **`link`** <code>string</code> required

### Returns  

<code>string</code>

## outputStyles  

**<code>outputStyles(link: string): string</code>**  

Output stylesheet elements.

### Parameters  
- **`link`** <code>string</code> required

### Returns  

<code>string</code>

## Types

### ScriptsPriority  

**Type:** <code>&#39;high&#39; | &#39;low&#39;</code>

### Scripts  

**Type:** <code>object</code>

#### Properties  
- **`item`** <code>Map&lt;string, string&gt;</code> required  
Current render item scripts or styles.  
- **`build`** <code>Map&lt;string, string&gt;</code> required  
- **`deps`** <code>Map&lt;string, Set&lt;string&gt;&gt;</code> required  
- **`priority`** <code>Map&lt;string, <a href="#scriptspriority">ScriptsPriority</a>&gt;</code> required  
- **`meta`** <code><a href="/src/global/README.md#generic">Generic</a></code> required

### Styles  

**Type:** <code>object</code>

#### Properties  
- **`item`** <code>Map&lt;string, string&gt;</code> required  
Current render item scripts or styles.  
- **`build`** <code>Map&lt;string, string&gt;</code> required  
- **`deps`** <code>Map&lt;string, Set&lt;string&gt;&gt;</code> required  
- **`priority`** <code>Map&lt;string, <a href="#scriptspriority">ScriptsPriority</a>&gt;</code> required