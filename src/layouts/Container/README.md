# Container  

**<code>Container(props: ContainerProps): string[]</code>**  

Output container wrapper.

## Parameters  
- **`props`** <code><a href="#containerprops">ContainerProps</a></code> required

## Returns  

<code>string[]</code>

## Types

### ContainerArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`tag`** <code>string</code> optional  
Default: `'div'`  
- **`maxWidth`** <code>string | number</code> optional  
Used in image utilities.  
- **`layoutClasses`** <code>string</code> optional  
- **`classes`** <code>string</code> optional  
- **`style`** <code>string</code> optional  
- **`attr`** <code>string</code> optional  
- **`nest`** <code>boolean</code> optional

### ContainerProps  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderfunctionargs">RenderFunctionArgs</a></code>

#### Properties  
- **`args`** <code><a href="#containerargs">ContainerArgs</a></code> required