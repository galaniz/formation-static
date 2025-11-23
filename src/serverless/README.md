# Serverless

## serverlessActions  

Actions to use in serverless functions.  

**Type:** <code><a href="#serverlessactions">ServerlessActions</a></code>

## serverlessPreview  

**<code>serverlessPreview(request: Request): RenderPreviewData | undefined</code>**  

Check if request is a preview.

### Parameters  
- **`request`** <code>Request</code> required

### Returns  

<code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a> | undefined</code>

## serverlessReload  

**<code>serverlessReload(request: Request, allowedParams?: string[]): RenderServerlessData | undefined</code>**  

Check if request is a paginated and/or filtered page.

### Parameters  
- **`request`** <code>Request</code> required  
- **`allowedParams`** <code>string[]</code> optional

### Returns  

<code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a> | undefined</code>

## serverlessRender  

**<code>serverlessRender(getData: getAllContentfulData | getAllWordPressData, serverlessData?: RenderServerlessData, previewData?: RenderPreviewData): Promise&lt;Response&gt;</code>**  

Re-render with serverless or preview data.

### Parameters  
- **`getData`** <code>getAllContentfulData | getAllWordPressData</code> required  
- **`serverlessData`** <code><a href="/src/render/README.md#renderserverlessdata">RenderServerlessData</a></code> optional  
- **`previewData`** <code><a href="/src/render/README.md#renderpreviewdata">RenderPreviewData</a></code> optional

### Returns  

<code>Promise&lt;Response&gt;</code>

## setServerless  

**<code>setServerless(actions?: ServerlessActions): void</code>**  

Set serverless actions.

### Parameters  
- **`actions`** <code><a href="#serverlessactions">ServerlessActions</a></code> optional

### Returns  

<code>void</code>

## doServerlessAction  

**<code>doServerlessAction(request: Request, env: Generic, headers?: GenericStrings, honeypotName?: string): Promise&lt;Response&gt;</code>**  

Handle POST requests to serverless action.

### Parameters  
- **`request`** <code>Request</code> required  
- **`env`** <code><a href="/src/global/README.md#generic">Generic</a></code> required  
- **`headers`** <code><a href="/src/global/README.md#genericstrings">GenericStrings</a></code> optional  
- **`honeypotName`** <code>string</code> optional

### Returns  

<code>Promise&lt;Response&gt;</code>

## Types

### ServerlessActionPrimitive  

**Type:** <code>string | number | boolean | File</code>

### ServerlessActionInput  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`value`** <code><a href="#serverlessactionprimitive">ServerlessActionPrimitive</a> | <a href="#serverlessactionprimitive">ServerlessActionPrimitive</a>[]</code> required  
- **`type`** <code>string | string[]</code> required  
- **`label`** <code>string</code> optional  
- **`legend`** <code>string</code> optional

### ServerlessActionData  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>string</code> required  
- **`action`** <code>string</code> required  
- **`inputs`** <code>Object&lt;string, <a href="#serverlessactioninput">ServerlessActionInput</a>&gt;</code> required

### ServerlessActionError  

**Type:** <code>object</code>

#### Properties  
- **`message`** <code>string</code> required  
- **`response`** <code>Response</code> optional

### ServerlessActionSuccess  

**Type:** <code>object</code>

#### Properties  
- **`message`** <code>string</code> required  
- **`headers`** <code><a href="/src/global/README.md#genericstrings">GenericStrings</a></code> optional

### ServerlessActionReturn  

**Type:** <code>object</code>

#### Properties  
- **`error`** <code><a href="#serverlessactionerror">ServerlessActionError</a></code> optional  
- **`success`** <code><a href="#serverlessactionsuccess">ServerlessActionSuccess</a></code> optional

### ServerlessAction  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#serverlessactiondata">ServerlessActionData</a></code> required  
- **`request`** <code>Request</code> required  
- **`env`** <code><a href="/src/global/README.md#generic">Generic</a></code> required

#### Returns  

<code><a href="#serverlessactionreturn">ServerlessActionReturn</a> | Promise&lt;<a href="#serverlessactionreturn">ServerlessActionReturn</a>&gt;</code>

### ServerlessActions  

**Type:** <code>Object&lt;string, <a href="#serverlessaction">ServerlessAction</a>&gt;</code>