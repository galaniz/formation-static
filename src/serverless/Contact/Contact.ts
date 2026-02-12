/**
 * Serverless - Contact
 */

/* Imports */

import type { ContactData, ContactBody } from './ContactTypes.js'
import type { ServerlessAction, ServerlessActionReturn } from '../serverlessTypes.js'
import type { RefString } from '../../global/globalTypes.js'
import { config } from '../../config/config.js'
import { escape } from '../../utils/escape/escape.js'
import { isArray } from '../../utils/array/array.js'
import { isString, isStringSafe, isStringStrict } from '../../utils/string/string.js'
import { isObject, isObjectStrict } from '../../utils/object/object.js'
import { getObjectKeys } from '../../utils/object/objectUtils.js'
import { applyFilters } from '../../filters/filters.js'
import { getPermalink } from '../../utils/link/link.js'
import { getStoreItem } from '../../store/store.js'
import { minify } from '../../utils/minify/minify.js'
import { isFile } from '../../utils/file/file.js'

/**
 * Recurse through data to output plain and HTML email body.
 *
 * @private
 * @param {ContactData} data
 * @param {RefString} html
 * @param {RefString} plain
 * @param {number} depth
 * @return {void}
 */
const recurseEmailHtml = (
  data: ContactData,
  html: RefString,
  plain: RefString,
  depth: number = 1
): void => {
  if (!isObject(data)) {
    return
  }

  const isArr = isArray(data)

  getObjectKeys(data).forEach(label => {
    const value = data[label]
    const l = label.toString()
    const h = depth + 1

    if (depth === 1) {
      html.ref += `
        <tr>
          <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
      `
    }

    if (label && !isArr) {
      html.ref += `
        <h${h} style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
          ${l}
        </h${h}>
      `

      plain.ref += `${l}\n`
    }

    recurseEmailHtml(value as ContactData, html, plain, depth + 1)

    if (isString(value)) {
      html.ref += `
        <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
          ${value}
        </p>
      `

      plain.ref += value
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/(<([^>]+)>)/ig, '') + '\n'
    }

    if (depth === 1) {
      html.ref += `
          </td>
        </tr>
      `

      plain.ref += '\n'
    }
  })
}

/**
 * Generate email from contact form fields.
 *
 * @type {ServerlessAction}
 */
const Contact: ServerlessAction = async (args) => {
  /* Args */

  const { id, action, inputs } = args

  /* Id required */

  if (!isStringStrict(id)) {
    return {
      error: {
        message: 'No ID'
      }
    }
  }

  /* Inputs required */

  if (!isObjectStrict(inputs) || !Object.keys(inputs).length) {
    return {
      error: {
        message: 'No inputs'
      }
    }
  }

  /* Meta information - to email and subject */

  const formMetaData = getStoreItem('formMeta')

  if (!isObjectStrict(formMetaData)) {
    return {
      error: {
        message: 'No meta'
      }
    }
  }

  const meta = formMetaData[id]

  if (!isObjectStrict(meta)) {
    return {
      error: {
        message: 'No meta object'
      }
    }
  }

  /* To email */

  const toEmail = meta.toEmail

  if (!isStringStrict(toEmail)) {
    return {
      error: {
        message: 'No to email'
      }
    }
  }

  const toEmails: string[] = toEmail.split(',')

  /* Sender email */

  const senderEmail = meta.senderEmail

  if (!isStringStrict(senderEmail)) {
    return {
      error: {
        message: 'No sender email'
      }
    }
  }

  /* Subject */

  let subject = isStringStrict(meta.subject) ? meta.subject : ''

  /* Reply to email */

  let replyToEmail = ''

  /* Email content */

  const header = `${config.title} contact form submission`
  const footer = `This email was sent from a contact form on ${config.title} (${getPermalink()})`
  const outputData: ContactData = {}
  const html = { ref: '' }
  const plain = { ref: '' }

  for (const [name, input] of Object.entries(inputs)) {
    const inputType = input.type
    const inputLabel = input.label?.trim() || `[${name}]`
    const inputValue = input.value

    if (!isStringSafe(inputLabel)) {
      continue
    }

    /* Escape value */

    let inputValueStr = ''

    if (isArray(inputValue)) {
      inputValueStr = inputValue.map(v => {
        if (isFile(v)) {
          return v.name
        }

        return escape(v.toString().trim())
      }).join('<br>')
    } else {
      inputValueStr = isFile(inputValue) ? inputValue.name : escape(inputValue.toString().trim())
    }

    /* Subject */

    if (name === 'subject') {
      subject = inputValueStr ? `${isStringStrict(subject) ? `${subject} - ` : ''}${inputValueStr}` : subject
      continue
    }

    /* Reply to email */

    if (inputType === 'email' && inputValueStr) {
      replyToEmail = inputValueStr
      inputValueStr = `<a href="mailto:${inputValueStr}">${inputValueStr}</a>`
    }

    /* Output value */

    const outputValue = inputValueStr === '' ? '--' : inputValueStr

    /* Legend */

    let hasLegend = false
    let legend = ''

    if (isStringSafe(input.legend)) {
      hasLegend = true
      legend = input.legend
    }

    if (hasLegend) {
      const legendData = outputData[legend]

      if (legendData == null) {
        outputData[legend] = {}
      }

      // @ts-expect-error - legend object set above
      const inputData = outputData[legend][inputLabel] as string[] | undefined

      if (inputData == null) {
        // @ts-expect-error - legend object set above
        outputData[legend][inputLabel] = []
      }

      // @ts-expect-error - input array set above
      (outputData[legend][inputLabel] as string[]).push(outputValue)
    }

    /* Label */

    if (!hasLegend) {
      const inputData = outputData[inputLabel]

      if (inputData == null) {
        outputData[inputLabel] = []
      }

      // @ts-expect-error - input array set above
      outputData[inputLabel].push(outputValue)
    }
  }

  recurseEmailHtml(outputData, html, plain)

  const outputHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" width="100%" style="padding: 0 16px 16px 16px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-right: auto; margin-left: auto; border-spacing: 0; max-width: 37.5em;">
            <tr>
              <td style="padding: 32px 0 0 0;">
                <h1 style="font-family: sans-serif; color: #222; margin: 0; line-height: 1.3em;">
                  ${header}
                </h1>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  ${html.ref}
                  <tr>
                    <td style="padding: 32px 0;">
                      <p style="font-family: sans-serif; color: #222; margin: 0; line-height: 1.5em;">
                        ${footer}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  const outputPlain = `${header}\n\n${plain.ref}${footer}`

  /* Subjext fallback */

  if (!subject) {
    subject = `${config.title} Contact Form`
  }

  /* Request body */

  const body: ContactBody = {
    id,
    action,
    inputs,
    to: toEmails,
    sender: senderEmail,
    subject,
    text: minify(outputPlain),
    html: minify(outputHtml)
  }

  if (replyToEmail) {
    body.replyTo = replyToEmail
  }

  /* Result */

  return await applyFilters('contactResult', {} as ServerlessActionReturn, body, true)
}

/* Exports */

export { Contact }
