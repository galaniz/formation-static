# Config

## config  

Default options.  

**Type:** <code><a href="#config">Config</a></code>

## setConfig  

**<code>setConfig(args: Config): Config</code>**  

Update default config with user options.

### Parameters  
- **`args`** <code><a href="#config">Config</a></code> required

### Returns  

<code><a href="#config">Config</a></code>

## setConfigFilter  

**<code>setConfigFilter(env: Generic): Config</code>**  

Filter config with environment variables.

### Parameters  
- **`env`** <code><a href="/src/global/README.md#generic">Generic</a></code> required

### Returns  

<code><a href="#config">Config</a></code>

## Types

### ConfigMeta  

**Type:** <code>object</code>

#### Properties  
- **`description`** <code>string</code> required  
- **`image`** <code>string</code> required

### ConfigEnv  

**Type:** <code>object</code>

#### Properties  
- **`dev`** <code>boolean</code> required  
- **`prod`** <code>boolean</code> required  
- **`build`** <code>boolean</code> required  
- **`cache`** <code>boolean</code> required  
- **`dir`** <code>string</code> required  
- **`devUrl`** <code>string</code> required  
- **`prodUrl`** <code>string</code> required

### ConfigCms  

**Type:** <code>object</code>

#### Properties  
- **`name`** <code>string</code> required  
- **`space`** <code>string</code> required  
- **`prodUser`** <code>string</code> required  
- **`prodCredential`** <code>string</code> required  
- **`prodHost`** <code>string</code> required  
- **`devUser`** <code>string</code> required  
- **`devCredential`** <code>string</code> required  
- **`devHost`** <code>string</code> required  
- **`ssl`** <code>boolean</code> optional  
- **`env`** <code>string</code> optional  
- **`locales`** <code>string[]</code> optional

### ConfigLocal  

**Type:** <code>object</code>

#### Properties  
- **`dir`** <code>string</code> required

### ConfigAsset  

**Type:** <code>object</code>

#### Properties  
- **`inputDir`** <code>string</code> required  
- **`outputDir`** <code>string</code> required  
Relative to site folder.

### ConfigImage  

**Type:** <code>object</code>

#### Properties  
- **`inputDir`** <code>string</code> required  
- **`outputDir`** <code>string</code> required  
- **`localUrl`** <code>string</code> required  
- **`remoteUrl`** <code>string</code> required  
- **`sizes`** <code>number[]</code> required  
- **`quality`** <code>number</code> required

### ConfigFilter  

**Type:** <code>function</code>

#### Parameters  
- **`config`** <code><a href="#config">Config</a></code> required  
- **`env`** <code><a href="/src/global/README.md#generic">Generic</a></code> required

#### Returns  

<code><a href="#config">Config</a></code>

### Config  

**Type:** <code>object</code>

#### Properties  
- **`namespace`** <code>string</code> required  
- **`source`** <code><a href="/src/global/README.md#source">Source</a></code> required  
- **`title`** <code>string</code> required  
- **`meta`** <code><a href="#configmeta">ConfigMeta</a></code> required  
- **`partialTypes`** <code>string[]</code> required  
- **`wholeTypes`** <code>string[]</code> required  
- **`renderTypes`** <code><a href="/src/global/README.md#genericstrings">GenericStrings</a></code> required  
- **`normalTypes`** <code><a href="/src/global/README.md#genericstrings">GenericStrings</a></code> required  
- **`hierarchicalTypes`** <code>string[]</code> required  
- **`localeInSlug`** <code>Object&lt;string, string&gt;</code> required  
- **`typeInSlug`** <code>Object&lt;string, (string|Object&lt;string, string&gt;)&gt;</code> required  
- **`taxonomyInSlug`** <code>Object&lt;string, (string|Object&lt;string, string&gt;)&gt;</code> required  
- **`env`** <code><a href="#configenv">ConfigEnv</a></code> required  
- **`cms`** <code><a href="#configcms">ConfigCms</a></code> required  
- **`local`** <code><a href="#configlocal">ConfigLocal</a></code> required  
- **`scripts`** <code><a href="#configasset">ConfigAsset</a></code> required  
- **`styles`** <code><a href="#configasset">ConfigAsset</a></code> required  
- **`image`** <code><a href="#configimage">ConfigImage</a></code> required  
- **`filter`** <code><a href="#configfilter">ConfigFilter</a></code> required