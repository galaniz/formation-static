# Form

## FormOption  

**<code>FormOption(props: FormOptionProps): string</code>**  

Output form option.

### Parameters  
- **`props`** <code><a href="#formoptionprops">FormOptionProps</a></code> required

### Returns  

<code>string</code> HTMLOptionElement|HTMLDivElement

## FormField  

**<code>FormField(props: FormFieldProps): string[]</code>**  

Output form field.

### Parameters  
- **`props`** <code><a href="#formfieldprops">FormFieldProps</a></code> required

### Returns  

<code>string[]</code> HTMLDivElement

## Form  

**<code>Form(props: FormProps): string[]</code>**  

Output form wrapper.

### Parameters  
- **`props`** <code><a href="#formprops">FormProps</a></code> required

### Returns  

<code>string[]</code> HTMLFormElement

## Types

### FormOptionArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`label`** <code>string</code> optional  
- **`value`** <code>string</code> optional  
- **`name`** <code>string</code> optional  
- **`hint`** <code>string</code> optional  
- **`selected`** <code>boolean</code> optional  
- **`optionClasses`** <code>string</code> optional  
- **`labelClasses`** <code>string</code> optional  
- **`classes`** <code>string</code> optional  
- **`radioIcon`** <code>string</code> optional  
- **`checkboxIcon`** <code>string</code> optional

### FormFieldType  

**Type:** <code>&#39;text&#39; | &#39;email&#39; | &#39;checkbox&#39; | &#39;radio&#39; | &#39;number&#39; | &#39;password&#39; | &#39;tel&#39; | &#39;url&#39; | &#39;textarea&#39; | &#39;select&#39; | &#39;radio-group&#39; | &#39;checkbox-group&#39; | &#39;fieldset&#39; | &#39;hidden&#39; | &#39;file&#39;</code>

### FormFieldArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`type`** <code><a href="#formfieldtype">FormFieldType</a></code> optional  
Default: `'text'`  
- **`name`** <code>string</code> optional  
- **`label`** <code>string</code> optional  
- **`hint`** <code>string</code> optional  
- **`value`** <code>string</code> optional  
- **`required`** <code>boolean</code> optional  
Default: `false`  
- **`attr`** <code>string</code> optional  
- **`emptyError`** <code>string</code> optional  
- **`invalidError`** <code>string</code> optional  
- **`fieldsetClasses`** <code>string</code> optional  
- **`fieldsetAttr`** <code>string</code> optional  
- **`fieldTag`** <code>string</code> optional  
Default: `'div'`  
- **`fieldClasses`** <code>string</code> optional  
- **`fieldAttr`** <code>string</code> optional  
- **`labelClasses`** <code>string</code> optional  
- **`classes`** <code>string</code> optional  
- **`radioIcon`** <code>string</code> optional  
- **`checkboxIcon`** <code>string</code> optional  
- **`selectIcon`** <code>string</code> optional  
- **`requiredIcon`** <code>string</code> optional

### FormOptionProps  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderfunctionargs">RenderFunctionArgs</a></code>

#### Properties  
- **`args`** <code><a href="#formoptionargs">FormOptionArgs</a></code> required  
- **`parents`** <code><a href="#formfieldargs">FormFieldArgs</a></code> optional

### FormFieldProps  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderfunctionargs">RenderFunctionArgs</a></code>

#### Properties  
- **`args`** <code><a href="#formfieldargs">FormFieldArgs</a></code> required

### FormArgs  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`id`** <code>string</code> optional  
- **`formTag`** <code>string</code> optional  
Default: `'form'`  
- **`formClasses`** <code>string</code> optional  
- **`formAttr`** <code>string</code> optional  
- **`fields`** <code>string</code> optional  
- **`fieldsClasses`** <code>string</code> optional  
- **`fieldsAttr`** <code>string</code> optional  
- **`submitFieldClasses`** <code>string</code> optional  
- **`submitFieldAttr`** <code>string</code> optional  
- **`submitLabel`** <code>string</code> optional  
Default: `'Submit'`  
- **`submitClasses`** <code>string</code> optional  
- **`submitAttr`** <code>string</code> optional  
- **`honeypotName`** <code>string</code> optional  
- **`honeypotFieldClasses`** <code>string</code> optional  
- **`honeypotFieldAttr`** <code>string</code> optional  
- **`honeypotLabelClasses`** <code>string</code> optional  
- **`honeypotClasses`** <code>string</code> optional  
- **`honeypotLabel`** <code>string</code> optional  
Default: `'Website'`  
- **`honeypotAttr`** <code>string</code> optional

### FormProps  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/render/README.md#renderfunctionargs">RenderFunctionArgs</a></code>

#### Properties  
- **`args`** <code><a href="#formargs">FormArgs</a></code> required