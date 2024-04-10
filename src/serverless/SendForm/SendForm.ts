/**
 * Serverless - Send Form
 */

/* Imports */

import type { SendFormOutputData, SendFormRequestBody, SendFormRequestRes } from './SendFormTypes'
import type { AjaxActionArgs, AjaxActionReturn } from '../serverlessTypes'
import type { ConfigFormMeta } from '../../config/configTypes'
import { config } from '../../config/config'
import { escape } from '../../utils/escape/escape'
import { isArray } from '../../utils/isArray/isArray'
import { isString, isStringStrict } from '../../utils/isString/isString'
import { isObject, isObjectStrict } from '../../utils/isObject/isObject'
import { getPermalink } from '../../utils/getPermalink/getPermalink'
import { getObjectKeys } from '../../utils/getObjectKeys/getObjectKeys'
import { getJsonFile } from '../../utils/getJson/getJson'
import { getPath } from '../../utils/getPath/getPath'

/**
 * Function - recurse through data to output plain and html email body
 *
 * @private
 * @param {object} data
 * @param {Object.<string, string>} output
 * @param {string} output.html
 * @param {string} output.plain
 * @param {number} depth
 * @return {void}
 */
const _recurseEmailHtml = <T>(
  data: T,
  output: {
    html: string
    plain: string
  },
  depth: number = 1
): void => {
  if (!isObject(data)) {
    return
  }

  const isArr = isArray(data)

  getObjectKeys(data).forEach((label) => {
    const value = data[label]
    const l = label.toString()
    const h = depth + 1

    if (depth === 1) {
      output.html += `
        <tr>
          <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
      `
    }

    if (label !== '' && !isArr) {
      output.html += `
        <h${h} style='font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em'>
          ${l}
        </h${h}>
      `

      output.plain += `${l}\n`
    }

    if (isObject(value)) {
      _recurseEmailHtml(value, output, depth + 1)
    }

    if (isString(value)) {
      output.html += `
        <p style='font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;'>
          ${value}
        </p>
      `

      output.plain += value.replace(/(<([^>]+)>)/ig, '') + '\n'
    }

    if (depth === 1) {
      output.html += `
          </td>
        </tr>
      `

      output.plain += '\n'
    }
  })
}

/**
 * Function - generate email from form fields and send with Smtp2go
 *
 * @param {import('../serverlessTypes').AjaxActionArgs} args
 * @return {Promise<import('../serverlessTypes').AjaxActionReturn>}
 */
const SendForm = async ({ id, inputs }: AjaxActionArgs): Promise<AjaxActionReturn> => {
  /* Id required */

  if (!isStringStrict(id)) {
    return {
      error: {
        message: 'No id'
      }
    }
  }

  /* Meta information - to email and subject */

  const formMetaData: ConfigFormMeta | undefined = await getJsonFile(getPath('formMeta', 'store'))

  if (formMetaData === undefined) {
    return {
      error: {
        message: 'No meta information'
      }
    }
  }

  const meta = formMetaData[id]

  if (!isObjectStrict(meta)) {
    return {
      error: {
        message: 'No meta information'
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
  const outputData: SendFormOutputData = {}
  const output = { html: '', plain: '' }

  getObjectKeys(inputs).forEach((name) => {
    const input = inputs[name]

    /* Skip if exclude true */

    const exclude = input.exclude !== undefined ? input.exclude : false

    if (exclude) {
      return
    }

    /* Variables */

    const inputType = input.type
    const inputLabel = input.label.trim()
    const inputValue = input.value

    /* Escape value */

    let inputValueStr = ''

    if (isArray(inputValue)) {
      inputValueStr = inputValue.map(v => escape(v.trim() + '')).join('<br>')
    }

    if (isString(inputValue)) {
      inputValueStr = escape(inputValue.trim() + '')
    }

    /* Subject */

    if (name === 'subject' && inputValueStr !== '') {
      subject = `${isStringStrict(subject) ? `${subject} - ` : ''}${inputValueStr}`
      return
    }

    /* Reply to email */

    if (inputType === 'email' && inputValueStr !== '') {
      replyToEmail = inputValueStr
      inputValueStr = `<a href='mailto:${inputValueStr}'>${inputValueStr}</a>`
    }

    /* Output value */

    const outputValue = inputValueStr === '' ? '--' : inputValueStr

    /* Legend */

    let hasLegend = false
    let legend = ''

    if (isStringStrict(input.legend)) {
      hasLegend = true
      legend = input.legend
    }

    if (hasLegend) {
      const legendData = outputData[legend]

      if (isObjectStrict(legendData)) {
        const inputData = legendData[inputLabel]

        if (isArray(inputData)) {
          inputData.push(outputValue)
        } else {
          legendData[inputLabel] = []
        }
      } else {
        outputData[legend] = {}
      }
    }

    /* Label */

    if (!hasLegend) {
      const inputData = outputData[inputLabel]

      if (isArray(inputData)) {
        inputData.push(outputValue)
      } else {
        outputData[inputLabel] = []
      }
    }
  })

  _recurseEmailHtml(outputData, output)

  const outputHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" width="100%" style="padding: 0 16px 16px 16px;">
          <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-right: auto; margin-left: auto; border-spacing: 0; max-width: 37.5em;">
            <tr>
              <td style="padding: 32px 0 0 0;">
                <h1 style='font-family: sans-serif; color: #222; margin: 0; line-height: 1.3em;'>
                  ${header}
                </h1>
              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  ${output.html}
                  <tr>
                    <td style="padding: 32px 0;">
                      <p style='font-family: sans-serif; color: #222; margin: 0; line-height: 1.5em;'>
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

  const outputPlain = `
    ${header}\n\n
    ${output.plain}
    ${footer}
  `

  /* Subjext fallback */

  if (subject === '') {
    subject = `${config.title} Contact Form`
  }

  /* Smtp2go request */

  const body: SendFormRequestBody = {
    api_key: config.apiKeys.smtp2go,
    to: toEmails,
    sender: senderEmail,
    subject,
    text_body: outputPlain,
    html_body: outputHtml
  }

  if (replyToEmail !== '') {
    body.custom_headers = [
      {
        header: 'Reply-To',
        value: `<${replyToEmail}>`
      }
    ]
  }

  const res = await fetch(
    'https://api.smtp2go.com/v3/email/send',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )

  const resJson: SendFormRequestRes = await res.json()

  /* Success */

  if (resJson?.data?.succeeded !== undefined) {
    return {
      success: {
        message: 'Form successully sent'
      }
    }
  } else {
    return {
      error: {
        message: 'Error sending email'
      }
    }
  }
}

/* Exports */

export { SendForm }
