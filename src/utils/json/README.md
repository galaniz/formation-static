# Json

## getJson  

**<code>getJson(value: string): object | undefined</code>**  

Check and return valid JSON or fallback.

### Parameters  
- **`value`** <code>string</code> required

### Returns  

<code>object | undefined</code>

## getJsonFile  

**<code>getJsonFile(path: string, store?: boolean): Promise&lt;(object|undefined)&gt;</code>**  

Import JSON file and return contents if object.

### Parameters  
- **`path`** <code>string</code> required  
- **`store`** <code>boolean</code> optional  
Default: `false`

### Returns  

<code>Promise&lt;(object|undefined)&gt;</code>