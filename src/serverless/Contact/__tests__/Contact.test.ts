/**
 * Serverless - Contact Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { testContext, testResetStore } from '../../../../tests/utils.js'
import { store, setStoreItem } from '../../../store/store.js'
import { addFilter, resetFilters } from '../../../utils/filter/filter.js'
import { config } from '../../../config/config.js'
import { Contact } from '../Contact.js'
import { minify } from '../../../utils/minify/minify.js'

/* Tests */

describe('Contact()', () => {
  const action = 'contact'
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
      label: ''
    },
    boolean: {
      type: 'checkbox',
      value: false,
      label: 'Boolean'
    },
    number: {
      type: 'number',
      value: 123,
      label: 'Number'
    },
    numbers: {
      type: 'number',
      value: [1, 2, 3],
      label: 'Numbers'
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

  beforeEach(() => {
    config.title = 'Test'
  })

  afterEach(() => {
    config.title = ''
    config.env.prod = false
    config.env.prodUrl = ''
    testResetStore()
    resetFilters()
  })

  it('should return error if id is empty string', async () => {
    const result = await Contact({
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
    const result = await Contact({
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

    const result = await Contact({
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

    const result = await Contact({
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

    const result = await Contact({
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

    const result = await Contact({
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

  it('should return empty object if no filters', async () => {
    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })
  
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'
  
    const result = await Contact({
      action,
      id: 'test',
      inputs
    }, context)

    expect(result).toEqual({})
  })

  it('should return filtered success result', async () => {
    const contactResult = vi.fn()

    addFilter('contactResult', async (result, args) => {
      contactResult(result, args)

      return await Promise.resolve({
        success: {
          message: 'Form successully sent'
        }
      })
    })

    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })
  
    config.env.prod = true
    config.env.prodUrl = 'http://test.com'
  
    const result = await Contact({
      action,
      id: 'test',
      inputs
    }, context)

    const expectedResult = {
      success: {
        message: 'Form successully sent'
      }
    }

    const expectedArgs = {
      id: 'test',
      action,
      inputs,
      to: ['to@test.com'],
      sender: 'from@test.com',
      subject: 'Meta Subject - Test Subject',
      replyTo: 'email@test.com',
      text: minify(`
        Test contact form submission\n\n
        Name\n
        Name\n
        Email\n
        email@test.com\n
        [message]\n
        Message\n
        Boolean\n
        false\n
        Number\n
        123\n
        Numbers\n
        1\n
        2\n
        3\n
        Legend\n
        Options\n
        One\n
        Two\n
        Three\n
        This email was sent from a contact form on Test (http://test.com)
      `),
      html: minify(`
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
                            [message]
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            Message
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Boolean
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            false
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Number
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            123
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0; border-bottom: 2px solid #ccc;">
                          <h2 style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.3em">
                            Numbers
                          </h2>
                          <p style="font-family: sans-serif; color: #222; margin: 16px 0; line-height: 1.5em;">
                            1<br>2<br>3
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
                            One<br>Two<br>Three
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
      `)
    }

    expect(contactResult).toHaveBeenCalledTimes(1)
    expect(contactResult).toHaveBeenCalledWith({}, expectedArgs)
    expect(result).toEqual(expectedResult)
  })

  it('should pass default subject to filter', async () => {
    let subject = ''

    addFilter('contactResult', async (_result, args) => {
      subject = args.subject

      return await Promise.resolve({})
    })

    setStoreItem('formMeta', {
      test: {
        subject: '',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })

    await Contact({
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

    const expectedSubject = 'Test Contact Form'

    expect(subject).toEqual(expectedSubject)
  })

  it('should pass meta subject and two to emails to filter', async () => {
    let toEmails: string[] = []
    let subject = ''

    addFilter('contactResult', async (_result, args) => {
      toEmails = args.to
      subject = args.subject

      return await Promise.resolve({})
    })

    setStoreItem('formMeta', {
      test: {
        subject: 'Meta Subject',
        toEmail: 'to@test.com,test@test.com',
        senderEmail: 'from@test.com'
      }
    })
  
    await Contact({
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

    const expectedToEmails = ['to@test.com', 'test@test.com']
    const expectedSubject = 'Meta Subject'

    expect(toEmails).toEqual(expectedToEmails)
    expect(subject).toEqual(expectedSubject)
  })

  it('should pass input subject to filter', async () => {
    let subject = ''

    addFilter('contactResult', async (_result, args) => {
      subject = args.subject

      return await Promise.resolve({})
    })

    setStoreItem('formMeta', {
      test: {
        subject: '',
        toEmail: 'to@test.com',
        senderEmail: 'from@test.com'
      }
    })
  
    await Contact({
      action,
      id: 'test',
      inputs
    }, context)
    
    const expectedSubject = 'Test Subject'

    expect(subject).toEqual(expectedSubject)
  })
})
