# Local

## normalizeLocalData  

**<code>normalizeLocalData(data: LocalData, refProps?: string[], imageProps?: string[], unsetProps?: string[]): LocalData</code>**  

Transform and link local data.

### Parameters  
- **`data`** <code><a href="#localdata">LocalData</a></code> required  
- **`refProps`** <code>string[]</code> optional  
- **`imageProps`** <code>string[]</code> optional  
- **`unsetProps`** <code>string[]</code> optional

### Returns  

<code><a href="#localdata">LocalData</a></code>

## getLocalData  

**<code>getLocalData(args: LocalDataArgs): Promise&lt;LocalData&gt;</code>**  

Data from local files or cache.

### Parameters  
- **`args`** <code><a href="#localdataargs">LocalDataArgs</a></code> required

### Returns  

<code>Promise&lt;<a href="#localdata">LocalData</a>&gt;</code>

## getAllLocalData  

**<code>getAllLocalData(args?: AllLocalDataArgs): Promise&lt;(RenderAllData|undefined)&gt;</code>**  

All data from file system.

### Parameters  
- **`args`** <code><a href="#alllocaldataargs">AllLocalDataArgs</a></code> optional

### Returns  

<code>Promise&lt;(<a href="/src/render/README.md#renderalldata">RenderAllData</a>|undefined)&gt;</code>

## Types

### LocalData  

**Type:** <code>Object&lt;string, <a href="/src/render/README.md#renderitem">RenderItem</a>&gt;</code>

### LocalDataArgs  

**Type:** <code>object</code>

#### Properties  
- **`key`** <code>string</code> required  
- **`refProps`** <code>string[]</code> optional  
- **`imageProps`** <code>string[]</code> optional  
- **`unsetProps`** <code>string[]</code> optional

### AllLocalDataArgs  

**Type:** <code>object</code>

#### Properties  
- **`refProps`** <code>string[]</code> optional  
- **`imageProps`** <code>string[]</code> optional  
- **`unsetProps`** <code>string[]</code> optional