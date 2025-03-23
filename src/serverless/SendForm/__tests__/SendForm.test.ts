/**
 * Serverless - Send Form Test
 */

/* Imports */

import type { SendFormRequestBody } from '../SendFormTypes.js'
import { it, expect, describe, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { testContext, testResetStore, testMinify } from '../../../../tests/utils.js'
import { mockSendFormFetch } from './SendFormMock.js'
import { store, setStoreItem } from '../../../store/store.js'
import { config } from '../../../config/config.js'
import { setServerless } from '../../serverless.js'
import { SendForm } from '../SendForm.js'

/* Mock fetch */

beforeAll(() => {
  vi.stubGlobal('fetch', mockSendFormFetch)
})

/* Tests */

describe('SendForm()', () => {
  const action = 'sendForm'
  const context = testContext()
  const inputs = {
    name: {
      type: 'text',
      value: 'Name',
      label: 'Name'
    },
    email: {
      type: 'email',
      value: 'email@test.com',
      label: 'Email'
    },
    subject: {
      type: 'text',
      value: 'Test Subject',
      label: 'Subject'
    },
    message: {
      type: 'textarea',
      value: 'Message',
      label: 'Message'
    },
    exclude: {
      type: 'text',
      value: 'test',
      label: 'Exclude',
      exclude: true
    },
    legend: {
      type: 'text',
      legend: 'Legend',
      label: 'Options',
      value: [
        'One',
        'Two',
        'Three'
      ]
    }
  }

  const successResult = {
    success: {
      message: 'Form successully sent'
    }
  }

  beforeEach(() => {
    config.title = 'Test'
    setServerless({
      apiKeys: {
        smtp2go: 'test'
      }
    })
  })

  afterEach(() => {
    config.title = ''
    config.env.prod = false
    config.env.prodUrl = ''
    testResetStore()
  })

  it('should return error if no api key', async () => {
    setServerless({
      apiKeys: {
        smtp2go: ''
      }
    })

    // @ts-expect-error - test empty params
    const result = await SendForm()
    const expectedResult = {
      error: {
        message: 'No api key'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if id is empty string', async () => {
    const result = await SendForm({
      action,
      id: '',
      inputs: {}
    }, context)

    const expectedResult = {
      error: {
        message: 'No id'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if inputs is null', async () => {
    const result = await SendForm({
      action,
      id: 'test',
      // @ts-expect-error - test null inputs
      inputs: null
    }, context)

    const expectedResult = {
      error: {
        message: 'No inputs'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if form meta is null', async () => {
    // @ts-expect-error - test null form meta
    store.formMeta = null

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const expectedResult = {
      error: {
        message: 'No meta'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if form meta is not an object', async () => {
    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'doesNotExist',
      inputs
    }, context)

    const expectedResult = {
      error: {
        message: 'No meta object'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if no to email', async () => {
    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        senderEmail: 'from@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const expectedResult = {
      error: {
        message: 'No to email'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if no sender email', async () => {
    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const expectedResult = {
      error: {
        message: 'No sender email'
      }
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return error if incorrect api key', async () => {
    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    setServerless({
      apiKeys: {
        smtp2go: 'incorrect'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const message = result.error?.message
    const expectedMessage = 'Error sending email'
    const error = await result.error?.response?.json() as {
      data: {
        error: string
      }
    }

    const expectedError = {
      data: {
        error: 'Authorization is invalid'
      }
    }

    expect(message).toEqual(expectedMessage)
    expect(error).toEqual(expectedError)
  })

  it('should return success with specified body object', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')

    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    config.env.prod = true
    config.env.prodUrl = 'http://test.com'

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const expectedResult = {
      success: {
        message: 'Form successully sent'
      }
    }

    const fetchBody = JSON.parse(fetchSpy.mock.calls[0]?.[1]?.body as string) as SendFormRequestBody

    fetchBody.text_body = testMinify(fetchBody.text_body)
    fetchBody.html_body = testMinify(fetchBody.html_body)

    const expectedBody = {
      api_key: 'test',
      to: ['to@test.com'],
      sender: 'from@test.com',
      subject: 'Meta Subject - Test Subject',
      text_body: testMinify(`
        Test contact form submission\n\n
        Name\n
        Name\n
        Email\n
        email@test.com\n
        Message\n
        Message\n
        Legend\n
        Options\n
        One\n
        Two\n
        Three\n
        This email was sent from a contact form on Test (http://test.com)
      `),
      html_body: testMinify(`
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" width="100%" style="padding: 0 16px 16px 16px;">
              <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-right: auto; margin-left: auto; border-spacing: 0; max-width: 37.5em;">
                <tr>
                  <td style="padding: 32px 0 0 0;">
                    <h1 style="font-family: sans-serif; color: #222; margin: 0; line-height: 1.3em;">
                      Test contact form submission
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Name
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            Name
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Email
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            <a href="mailto:email@test.com">email@test.com</a>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Message
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            Message
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Legend
                          </h2>
                          <h3 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Options
                          </h3>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            One<br>
                            Two<br>
                            Three
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 32px 0;">
                          <p style="font-family: sans-serif; color: #222; margin: 0; line-height: 1.5em;">
                            This email was sent from a contact form on Test (http://test.com)
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
      `),
      custom_headers: [
        {
          header: 'Reply-To',
          value: '<email@test.com>'
        }
      ]
    }

    expect(result).toEqual(expectedResult)
    expect(fetchBody).toEqual(expectedBody)
  })

  it('should return success with default subject', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')

    setStoreItem('formMeta', {
      test: {
        subject: '',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs: {
        ...inputs,
        subject: { // Test default subject
          type: 'text',
          value: '',
          label: 'Subject'
        },
        lorem: {
          type: 'text',
          value: '', // Test empty value
          label: 'Lorem'
        }
      }
    }, context)

    const fetchBody = JSON.parse(fetchSpy.mock.calls[0]?.[1]?.body as string) as SendFormRequestBody
    const subject = fetchBody.subject
    const expectedSubject = 'Test Contact Form'

    expect(result).toEqual(successResult)
    expect(subject).toEqual(expectedSubject)
  })

  it('should return success with meta subject and two to emails', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')

    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com,test@test.com',
        senderEmail: 'from@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs: {
        ...inputs,
        subject: { // Test meta subject
          type: 'text',
          value: '',
          label: 'Subject'
        }
      }
    }, context)

    const fetchBody = JSON.parse(fetchSpy.mock.calls[0]?.[1]?.body as string) as SendFormRequestBody
    const toEmails = fetchBody.to
    const expectedToEmails = ['to@test.com', 'test@test.com']
    const subject = fetchBody.subject
    const expectedSubject = 'Meta Subject'

    expect(result).toEqual(successResult)
    expect(toEmails).toEqual(expectedToEmails)
    expect(subject).toEqual(expectedSubject)
  })

  it('should return success with input subject', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')

    setStoreItem('formMeta', {
      test: {
        subject: '',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    const result = await SendForm({
      action,
      id: 'test',
      inputs
    }, context)

    const fetchBody = JSON.parse(fetchSpy.mock.calls[0]?.[1]?.body as string) as SendFormRequestBody
    const subject = fetchBody.subject
    const expectedSubject = 'Test Subject'

    expect(result).toEqual(successResult)
    expect(subject).toEqual(expectedSubject)
  })
})
