# Actions

## actions  

Action callbacks by name.  

**Type:** <code><a href="#actionmap">ActionMap</a></code>

## addAction  

**<code>addAction(name: string, action: GenericFunction): boolean</code>**  

Add action to action map.

### Parameters  
- **`name`** <code>string</code> required  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## removeAction  

**<code>removeAction(name: string, action: GenericFunction): boolean</code>**  

Remove action from actions map.

### Parameters  
- **`name`** <code>string</code> required  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## doActions  

**<code>doActions(name: string, args?: &ast;, isAsync?: boolean): &ast;</code>**  

Run callback functions from actions map.

### Parameters  
- **`name`** <code>string</code> required  
- **`args`** <code>&ast;</code> optional  
- **`isAsync`** <code>boolean</code> optional  
Default: `false`

### Returns  

<code>&ast;</code>

## resetActions  

**<code>resetActions(): void</code>**  

Empty actions map.

### Returns  

<code>void</code>

## setActions  

**<code>setActions(args: Actions): boolean</code>**  

Fill actions map.

### Parameters  
- **`args`** <code><a href="#actions">Actions</a></code> required

### Returns  

<code>boolean</code>

## Types

### ActionMap  

**Type:** <code>Map&lt;string, Set&lt;<a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;&gt;</code>

#### Properties  
- **`renderStart`** <code>Set&lt;<a href="/src/render/README.md#renderstartaction">RenderStartAction</a>&gt;</code> required  
- **`renderEnd`** <code>Set&lt;<a href="/src/render/README.md#renderendaction">RenderEndAction</a>&gt;</code> required  
- **`renderItemStart`** <code>Set&lt;<a href="/src/render/README.md#renderitemstartaction">RenderItemStartAction</a>&gt;</code> required  
- **`renderItemEnd`** <code>Set&lt;<a href="/src/render/README.md#renderitemendaction">RenderItemEndAction</a>&gt;</code> required

### Actions  

**Type:** <code>Object&lt;string, <a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;</code>

#### Properties  
- **`renderStart`** <code><a href="/src/render/README.md#renderstartaction">RenderStartAction</a></code> required  
- **`renderEnd`** <code><a href="/src/render/README.md#renderendaction">RenderEndAction</a></code> required  
- **`renderItemStart`** <code><a href="/src/render/README.md#renderitemstartaction">RenderItemStartAction</a></code> required  
- **`renderItemEnd`** <code><a href="/src/render/README.md#renderitemendaction">RenderItemEndAction</a></code> required