import { expect } from '@playwright/test'
import { test, useForm, useCombobox, useLabel, useSelect, useTable, useButton, usePageHeading } from './utilities'

test('Can create a notification', async ({ page }) => {
  await page.goto('/notifications')

  const { table, rows: notifications } = useTable()
  const existingNotifications = await notifications.count()

  const { heading } = usePageHeading()
  await heading.locator('[href="/notifications/new"]').click()

  const { control: states } = useLabel('Run states')
  const { selectOption } = useSelect(states)
  await selectOption('Completed')
  await selectOption('Running')

  const { control: tags } = useLabel('Tags')
  const { selectCustomOption } = useCombobox(tags)
  await selectCustomOption('foo')

  const { button } = useButton('Slack Webhook')
  await button.click()

  const { control: webhookUrl } = useLabel('Webhook URL')
  await webhookUrl.fill('https://slack.test')

  const { submit } = useForm()
  await submit()

  await table.waitFor()
  const newNotifications = await notifications.count()

  expect(newNotifications).toBe(existingNotifications + 1)
})
